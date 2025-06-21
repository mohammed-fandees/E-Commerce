import { getOrdersFromLocalStorage, formatOrderForDisplay } from './orderUtils';

/**
 * Generate CSV content from orders data
 * @param {Array} orders - Array of orders
 * @returns {string} CSV content
 */
export const generateOrdersCSV = (orders) => {
  if (!orders || orders.length === 0) {
    return 'No orders to export';
  }

  // CSV Headers
  const headers = [
    'Order Number',
    'Order Date',
    'Status',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Shipping Address',
    'City',
    'Payment Method',
    'Items Count',
    'Total Quantity',
    'Subtotal',
    'Discount',
    'Shipping',
    'Total Amount',
    'Items Details'
  ];

  // Convert orders to CSV rows
  const rows = orders.map(order => {
    const itemsDetails = order.items.map(item => 
      `${item.name} (Qty: ${item.quantity}, Price: $${item.price})`
    ).join('; ');

    return [
      order.orderNumber,
      order.formattedDate || new Date(order.createdAt).toLocaleDateString(),
      order.status,
      order.billing?.firstName || 'N/A',
      order.billing?.emailAddress || 'N/A',
      order.billing?.phoneNumber || 'N/A',
      order.billing?.streetAddress || 'N/A',
      order.billing?.townCity || 'N/A',
      order.paymentMethod || 'N/A',
      order.items?.length || 0,
      order.totalQuantity || order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
      order.pricing?.subtotal?.toFixed(2) || '0.00',
      order.pricing?.discount?.toFixed(2) || '0.00',
      order.pricing?.shipping?.toFixed(2) || '0.00',
      order.pricing?.total?.toFixed(2) || '0.00',
      `"${itemsDetails}"`
    ];
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  return csvContent;
};

/**
 * Download orders as CSV file
 * @param {Array} orders - Orders to export (optional, will fetch all if not provided)
 * @param {string} filename - Custom filename (optional)
 */
export const downloadOrdersCSV = (orders = null, filename = null) => {
  try {
    // Get orders data
    const ordersData = orders || getOrdersFromLocalStorage().map(formatOrderForDisplay);
    
    if (ordersData.length === 0) {
      throw new Error('No orders found to export');
    }

    // Generate CSV content
    const csvContent = generateOrdersCSV(ordersData);
    
    // Create filename
    const defaultFilename = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    const finalFilename = filename || defaultFilename;

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', finalFilename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    return true;
  } catch (error) {
    console.error('Error downloading CSV:', error);
    throw error;
  }
};

/**
 * Generate invoice HTML content
 * @param {Object} order - Single order object
 * @param {Object} options - Formatting options
 * @returns {string} HTML content for invoice
 */
export const generateInvoiceHTML = (order, options = {}) => {
  const {
    companyName = 'Your E-Commerce Store',
    companyAddress = '123 Business St, City, State 12345',
    companyPhone = '(555) 123-4567',
    companyEmail = 'info@yourstore.com',
    logoUrl = null
  } = options;

  const invoiceDate = new Date().toLocaleDateString();
  const orderDate = new Date(order.createdAt).toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${order.orderNumber}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: white;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }
        .company-info {
          flex: 1;
        }
        .company-logo {
          max-width: 150px;
          height: auto;
          margin-bottom: 10px;
        }
        .invoice-info {
          text-align: right;
          flex: 1;
        }
        .invoice-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1f2937;
          margin: 0;
        }
        .invoice-number {
          font-size: 1.1rem;
          color: #6b7280;
          margin: 5px 0;
        }
        .billing-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .billing-info h3 {
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .items-table th,
        .items-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .items-table th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        .items-table .text-right {
          text-align: right;
        }
        .totals-section {
          margin-left: auto;
          width: 300px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .total-row.final {
          border-bottom: 2px solid #1f2937;
          font-weight: bold;
          font-size: 1.2rem;
          color: #1f2937;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 0.9rem;
        }
        .payment-info {
          background-color: #f0f9ff;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        @media print {
          body { margin: 0; padding: 15px; }
          .no-print { display: none; }
        }
        @media (max-width: 768px) {
          .invoice-header { flex-direction: column; text-align: left; }
          .invoice-info { text-align: left; margin-top: 20px; }
          .billing-section { grid-template-columns: 1fr; gap: 20px; }
          .items-table { font-size: 0.9rem; }
          .totals-section { width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div class="company-info">
          ${logoUrl ? `<img src="${logoUrl}" alt="Company Logo" class="company-logo">` : ''}
          <h2>${companyName}</h2>
          <p>${companyAddress}<br>
          ${companyPhone}<br>
          ${companyEmail}</p>
        </div>
        <div class="invoice-info">
          <h1 class="invoice-title">INVOICE</h1>
          <p class="invoice-number">Invoice #: ${order.orderNumber}</p>
          <p>Invoice Date: ${invoiceDate}</p>
          <p>Order Date: ${orderDate}</p>
        </div>
      </div>

      <div class="billing-section">
        <div class="billing-info">
          <h3>Bill To:</h3>
          <p><strong>${order.billing?.firstName || 'Customer'}</strong><br>
          ${order.billing?.streetAddress || 'Address not provided'}<br>
          ${order.billing?.townCity || 'City not provided'}<br>
          Phone: ${order.billing?.phoneNumber || 'N/A'}<br>
          Email: ${order.billing?.emailAddress || 'N/A'}</p>
        </div>
        <div class="billing-info">
          <h3>Order Details:</h3>
          <p>Status: <strong style="text-transform: capitalize;">${order.status}</strong><br>
          Payment Method: <strong style="text-transform: capitalize;">${order.paymentMethod || 'N/A'}</strong><br>
          Items Count: <strong>${order.items?.length || 0}</strong><br>
          Total Quantity: <strong>${order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}</strong></p>
        </div>
      </div>

      ${order.paymentMethod === 'bank' ? `
      <div class="payment-info">
        <h3 style="margin-top: 0;">Payment Information</h3>
        <p>This invoice is for a bank payment order. Please process payment according to your banking procedures.</p>
      </div>
      ` : ''}

      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th class="text-right">Price</th>
            <th class="text-right">Qty</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items?.map(item => `
            <tr>
              <td>
                <strong>${item.name}</strong><br>
                <small style="color: #6b7280;">ID: ${item.id}</small>
              </td>
              <td class="text-right">$${item.price.toFixed(2)}</td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('') || ''}
        </tbody>
      </table>

      <div class="totals-section">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${order.pricing?.subtotal?.toFixed(2) || '0.00'}</span>
        </div>
        ${order.pricing?.discount > 0 ? `
        <div class="total-row">
          <span>Discount:</span>
          <span style="color: #059669;">-$${order.pricing.discount.toFixed(2)}</span>
        </div>
        ` : ''}
        <div class="total-row">
          <span>Shipping:</span>
          <span>${order.pricing?.shipping === 0 ? 'Free' : `$${order.pricing?.shipping?.toFixed(2) || '0.00'}`}</span>
        </div>
        <div class="total-row final">
          <span>Total:</span>
          <span>$${order.pricing?.total?.toFixed(2) || '0.00'}</span>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>If you have any questions about this invoice, please contact us at ${companyEmail}</p>
        <p><small>Generated on ${new Date().toLocaleString()}</small></p>
      </div>

      <div class="no-print" style="margin-top: 30px; text-align: center;">
        <button onclick="window.print()" style="
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          margin-right: 10px;
        ">Print Invoice</button>
        <button onclick="window.close()" style="
          background: #6b7280;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
        ">Close</button>
      </div>
    </body>
    </html>
  `;
};

/**
 * Download single order invoice
 * @param {Object} order - Order object
 * @param {Object} options - Company/invoice options
 */
export const downloadInvoice = (order, options = {}) => {
  try {
    const invoiceHTML = generateInvoiceHTML(order, options);
    
    // Create new window for invoice
    const newWindow = window.open('', '_blank', 'width=800,height=600');
    newWindow.document.write(invoiceHTML);
    newWindow.document.close();
    
    // Auto-focus for printing
    newWindow.focus();
    
    return true;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
};

/**
 * Download multiple invoices (opens each in new tab)
 * @param {Array} orders - Array of orders
 * @param {Object} options - Company/invoice options
 */
export const downloadMultipleInvoices = (orders, options = {}) => {
  try {
    if (!orders || orders.length === 0) {
      throw new Error('No orders selected for invoice generation');
    }

    // Limit to prevent browser blocking too many popups
    const maxInvoices = 10;
    const ordersToProcess = orders.slice(0, maxInvoices);
    
    if (orders.length > maxInvoices) {
      console.warn(`Only processing first ${maxInvoices} invoices to prevent browser popup blocking`);
    }

    // Generate invoices with slight delay to prevent popup blocking
    ordersToProcess.forEach((order, index) => {
      setTimeout(() => {
        downloadInvoice(order, options);
      }, index * 500); // 500ms delay between each invoice
    });

    return true;
  } catch (error) {
    console.error('Error generating multiple invoices:', error);
    throw error;
  }
};

/**
 * Download invoice as PDF (using browser print to PDF)
 * @param {Object} order - Order object
 * @param {Object} options - Company/invoice options
 */
export const downloadInvoicePDF = (order, options = {}) => {
  try {
    const invoiceHTML = generateInvoiceHTML(order, options);
    
    // Create hidden iframe for PDF generation
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    
    document.body.appendChild(iframe);
    
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(invoiceHTML);
    doc.close();
    
    // Focus and print
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    
    // Clean up after a delay
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF invoice:', error);
    throw error;
  }
};

/**
 * Export orders data as JSON
 * @param {Array} orders - Orders to export
 * @param {string} filename - Custom filename
 */
export const downloadOrdersJSON = (orders = null, filename = null) => {
  try {
    const ordersData = orders || getOrdersFromLocalStorage();
    
    if (ordersData.length === 0) {
      throw new Error('No orders found to export');
    }

    const jsonContent = JSON.stringify(ordersData, null, 2);
    const defaultFilename = `orders-backup-${new Date().toISOString().split('T')[0]}.json`;
    const finalFilename = filename || defaultFilename;

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', finalFilename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    return true;
  } catch (error) {
    console.error('Error downloading JSON:', error);
    throw error;
  }
};
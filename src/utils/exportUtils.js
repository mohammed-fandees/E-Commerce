import { getOrdersFromLocalStorage, formatOrderForDisplay } from "./orderUtils";

/**
 * Generate CSV content from orders data
 * @param {Array} orders - Array of orders
 * @returns {string} CSV content
 */
export const generateOrdersCSV = (orders) => {
  if (!orders || orders.length === 0) {
    return "No orders to export";
  }

  // CSV Headers
  const headers = [
    "Order Number",
    "Order Date",
    "Status",
    "Customer Name",
    "Customer Email",
    "Customer Phone",
    "Shipping Address",
    "City",
    "Payment Method",
    "Items Count",
    "Total Quantity",
    "Subtotal",
    "Discount",
    "Shipping",
    "Total Amount",
    "Items Details",
  ];

  // Convert orders to CSV rows
  const rows = orders.map((order) => {
    // Supabase: order fields
    const orderNumber = order.order_number || order.orderNumber;
    const orderDate = order.created_at
      ? new Date(order.created_at).toLocaleDateString()
      : order.formattedDate || new Date(order.createdAt).toLocaleDateString();
    const status = order.status;
    const billing = order.billing || {};
    const paymentMethod = order.payment_method || order.paymentMethod || "N/A";
    // Items from Supabase: order_items or items
    const items = order.order_items || order.items || [];
    const itemsDetails = items
      .map(
        (item) => `${item.name} (Qty: ${item.quantity}, Price: $${item.price})`
      )
      .join("; ");
    const itemsCount = items.length;
    const totalQuantity = items.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    // Pricing
    const subtotal = order.subtotal || order.subtotal || 0;
    const discount = order.discount || order.discount || 0;
    const shipping = order.shipping || order.shipping || 0;
    const total = order.total || order.total || 0;

    return [
      orderNumber,
      orderDate,
      status,
      billing.firstName || "N/A",
      billing.emailAddress || "N/A",
      billing.phoneNumber || "N/A",
      billing.streetAddress || "N/A",
      billing.townCity || "N/A",
      paymentMethod,
      itemsCount,
      totalQuantity,
      Number(subtotal).toFixed(2),
      Number(discount).toFixed(2),
      Number(shipping).toFixed(2),
      Number(total).toFixed(2),
      `"${itemsDetails}"`,
    ];
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

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
    const ordersData =
      orders || getOrdersFromLocalStorage().map(formatOrderForDisplay);

    if (ordersData.length === 0) {
      throw new Error("No orders found to export");
    }

    // Generate CSV content
    const csvContent = generateOrdersCSV(ordersData);

    // Create filename
    const defaultFilename = `orders-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    const finalFilename = filename || defaultFilename;

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", finalFilename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    return true;
  } catch (error) {
    console.error("Error downloading CSV:", error);
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
    companyName = "Exclusive Store",
    companyAddress = "123 Business St, City, State 12345",
    companyPhone = "(555) 123-4567",
    companyEmail = "info@exclusive-store.com",
    logoUrl = null,
  } = options;

  const invoiceDate = new Date().toLocaleDateString();
  const orderDate = new Date(order.created_at).toLocaleDateString();
  const items = order.order_items || order.items || [];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${order.orderNumber}</title>
      <style>
        * {
          box-sizing: border-box;
        }
        html, body {
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px;
          background: #fff;
        }
        .invoice-container {
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
          flex-wrap: nowrap;
        }
        .company-info {
          max-width: 50%;
        }
        .company-logo {
          max-width: 180px;
          height: auto;
          margin-bottom: 10px;
        }
        .invoice-info {
          text-align: right;
          flex-shrink: 0;
        }
        .invoice-title {
          font-size: 2.2rem;
          font-weight: bold;
          color: #111827;
          margin: 0 0 10px 0;
        }
        .invoice-number, .invoice-date {
          margin: 2px 0;
          font-size: 0.95rem;
          color: #555;
        }
        .billing-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .billing-info {
          width: 48%;
        }
        .billing-info h3 {
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
          margin-bottom: 10px;
          font-size: 1.1rem;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          font-size: 0.95rem;
        }
        .items-table th,
        .items-table td {
          border: 1px solid #ddd;
          padding: 10px;
        }
        .items-table th {
          background: #f9fafb;
          text-align: left;
        }
        .items-table td.text-right {
          text-align: right;
        }
        .totals-section {
          margin-left: auto;
          width: 300px;
          font-size: 0.95rem;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #ddd;
        }
        .total-row.final {
          font-weight: bold;
          font-size: 1.05rem;
          border-bottom: 2px solid #000;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 0.85rem;
          color: #555;
        }
        .no-print {
          margin-top: 30px;
          text-align: center;
        }
        .no-print button {
          background: #3b82f6;
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-right: 10px;
        }
        .no-print button:last-child {
          background: #6b7280;
        }
        @media print {
          html, body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none;
          }
          .invoice-header, .billing-section, .items-table, .totals-section, .footer {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="company-info">
            ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="company-logo">` : ""}
            <h2>${companyName}</h2>
            <p>${companyAddress}<br>${companyPhone}<br>${companyEmail}</p>
          </div>
          <div class="invoice-info">
            <h1 class="invoice-title">INVOICE</h1>
            <p class="invoice-number"># ${order.orderNumber}</p>
            <p class="invoice-date">Invoice Date: ${invoiceDate}</p>
            <p class="invoice-date">Order Date: ${orderDate}</p>
          </div>
        </div>

        <div class="billing-section">
          <div class="billing-info">
            <h3>Bill To:</h3>
            <p><strong>${order.billing?.firstName || "Customer"}</strong><br>
            ${order.billing?.streetAddress || "Address not provided"}<br>
            ${order.billing?.townCity || "City not provided"}<br>
            Phone: ${order.billing?.phoneNumber || "N/A"}<br>
            Email: ${order.billing?.emailAddress || "N/A"}</p>
          </div>
          <div class="billing-info">
            <h3>Order Info:</h3>
            <p>Status: ${order.status}<br>
            Payment: ${order.payment_method || "N/A"}<br>
            Items: ${items.length}<br>
            Total Qty: ${items.reduce((s, i) => s + (i.quantity || 0), 0)}</p>
          </div>
        </div>

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
            ${items.map(item => `
              <tr>
                <td><small>ID: ${item.id}</small></td>
                <td class="text-right">$${Number(item.price).toFixed(2)}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="totals-section">
          <div class="total-row"><span>Subtotal:</span><span>$${Number(order.subtotal || 0).toFixed(2)}</span></div>
          ${order.discount > 0 ? `<div class="total-row"><span>Discount:</span><span>-$${Number(order.discount).toFixed(2)}</span></div>` : ""}
          <div class="total-row"><span>Shipping:</span><span>${order.shipping === 0 ? "Free" : `$${Number(order.shipping).toFixed(2)}`}</span></div>
          <div class="total-row final"><span>Total:</span><span>$${Number(order.total || 0).toFixed(2)}</span></div>
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>If you have questions, contact us: ${companyEmail}</p>
          <p><small>Generated on ${new Date().toLocaleString()}</small></p>
        </div>

        <div class="no-print">
          <button onclick="window.print()">Print Invoice</button>
          <button onclick="window.close()">Close</button>
        </div>
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
    const newWindow = window.open("", "_blank", "width=800,height=600");
    newWindow.document.write(invoiceHTML);
    newWindow.document.close();

    // Auto-focus for printing
    newWindow.focus();

    return true;
  } catch (error) {
    console.error("Error generating invoice:", error);
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
      throw new Error("No orders selected for invoice generation");
    }

    // Limit to prevent browser blocking too many popups
    const maxInvoices = 10;
    const ordersToProcess = orders.slice(0, maxInvoices);

    if (orders.length > maxInvoices) {
      console.warn(
        `Only processing first ${maxInvoices} invoices to prevent browser popup blocking`
      );
    }

    // Generate invoices with slight delay to prevent popup blocking
    ordersToProcess.forEach((order, index) => {
      setTimeout(() => {
        downloadInvoice(order, options);
      }, index * 500); // 500ms delay between each invoice
    });

    return true;
  } catch (error) {
    console.error("Error generating multiple invoices:", error);
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
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    iframe.style.width = "1px";
    iframe.style.height = "1px";

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
    console.error("Error generating PDF invoice:", error);
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
      throw new Error("No orders found to export");
    }

    const jsonContent = JSON.stringify(ordersData, null, 2);
    const defaultFilename = `orders-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    const finalFilename = filename || defaultFilename;

    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", finalFilename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    return true;
  } catch (error) {
    console.error("Error downloading JSON:", error);
    throw error;
  }
};

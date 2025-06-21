/**
 * Save order to localStorage
 * @param {Object} orderData - The order data to save
 * @returns {Object} - The saved order with additional metadata
 */
export const saveOrderToLocalStorage = (orderData) => {
  try {
    const existingOrders = getOrdersFromLocalStorage();
    const newOrder = {
      id: Date.now().toString(),
      orderNumber: `ORD-${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    existingOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    return newOrder;
  } catch (error) {
    console.error('Error saving order to localStorage:', error);
    throw new Error('Failed to save order');
  }
};

/**
 * Get all orders from localStorage
 * @returns {Array} - Array of orders
 */
export const getOrdersFromLocalStorage = () => {
  try {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error reading orders from localStorage:', error);
    return [];
  }
};

/**
 * Get order by ID from localStorage
 * @param {string} orderId - The order ID
 * @returns {Object|null} - The order or null if not found
 */
export const getOrderById = (orderId) => {
  try {
    const orders = getOrdersFromLocalStorage();
    return orders.find(order => order.id === orderId) || null;
  } catch (error) {
    console.error('Error finding order:', error);
    return null;
  }
};

/**
 * Update order status
 * @param {string} orderId - The order ID
 * @param {string} newStatus - The new status
 * @returns {boolean} - Success status
 */
export const updateOrderStatus = (orderId, newStatus) => {
  try {
    const orders = getOrdersFromLocalStorage();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('orders', JSON.stringify(orders));
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};

/**
 * Delete order from localStorage
 * @param {string} orderId - The order ID
 * @returns {boolean} - Success status
 */
export const deleteOrder = (orderId) => {
  try {
    const orders = getOrdersFromLocalStorage();
    const filteredOrders = orders.filter(order => order.id !== orderId);
    
    localStorage.setItem('orders', JSON.stringify(filteredOrders));
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
};

/**
 * Get orders by status
 * @param {string} status - The order status
 * @returns {Array} - Array of orders with the specified status
 */
export const getOrdersByStatus = (status) => {
  try {
    const orders = getOrdersFromLocalStorage();
    return orders.filter(order => order.status === status);
  } catch (error) {
    console.error('Error filtering orders by status:', error);
    return [];
  }
};

/**
 * Get order statistics
 * @returns {Object} - Order statistics
 */
export const getOrderStatistics = () => {
  try {
    const orders = getOrdersFromLocalStorage();
    
    const stats = {
      total: orders.length,
      pending: orders.filter(order => order.status === 'pending').length,
      completed: orders.filter(order => order.status === 'completed').length,
      cancelled: orders.filter(order => order.status === 'cancelled').length,
      totalValue: orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0)
    };
    
    return stats;
  } catch (error) {
    console.error('Error calculating order statistics:', error);
    return {
      total: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
      totalValue: 0
    };
  }
};

/**
 * Format order for display
 * @param {Object} order - The order object
 * @returns {Object} - Formatted order data
 */
export const formatOrderForDisplay = (order) => {
  try {
    return {
      ...order,
      formattedDate: new Date(order.createdAt).toLocaleDateString(),
      formattedTime: new Date(order.createdAt).toLocaleTimeString(),
      formattedTotal: `$${order.pricing?.total?.toFixed(2) || '0.00'}`,
      itemCount: order.items?.length || 0,
      totalQuantity: order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
    };
  } catch (error) {
    console.error('Error formatting order:', error);
    return order;
  }
};
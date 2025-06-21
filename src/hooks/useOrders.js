import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  getOrdersFromLocalStorage, 
  formatOrderForDisplay,
  getOrderStatistics,
  updateOrderStatus,
  deleteOrder
} from '@/utils/orderUtils';
import { toast } from 'sonner';

export const useOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Load orders from localStorage
  const loadOrders = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      const ordersData = getOrdersFromLocalStorage();
      const formattedOrders = ordersData
        .map(formatOrderForDisplay)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error(t('orders.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders based on search, status, and date
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(query) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(query)
        )
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(order => 
          new Date(order.createdAt) >= filterDate
        );
      }
    }

    return filtered;
  }, [orders, searchQuery, statusFilter, dateFilter]);

  // Order statistics
  const statistics = useMemo(() => {
    return getOrderStatistics();
  }, [orders]);

  // Toggle order expansion
  const toggleOrderExpanded = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Reorder functionality
  const reorderItems = (order) => {
    try {
      // Get current cart or create new one
      const currentCart = JSON.parse(localStorage.getItem('cart') || '{"items": []}');
      
      // Add order items to cart
      const itemsToAdd = order.items.map(item => ({
        id: item.id,
        name: item.name,
        img: item.image,
        price: item.price,
        quantity: item.quantity
      }));

      // Update cart
      const updatedCart = {
        ...currentCart,
        items: [...currentCart.items, ...itemsToAdd]
      };

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      toast.success(t('orders.reorderSuccess'));
      
      // Navigate to cart or trigger cart update
      // window.location.href = '/cart';
      
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error(t('orders.errors.reorderFailed'));
    }
  };

  // Update order status
  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      const success = updateOrderStatus(orderId, newStatus);
      if (success) {
        await loadOrders(); // Reload orders
        toast.success(t('orders.statusUpdated'));
      } else {
        toast.error(t('orders.errors.statusUpdateFailed'));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(t('orders.errors.statusUpdateFailed'));
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    try {
      await changeOrderStatus(orderId, 'cancelled');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(t('orders.errors.cancelFailed'));
    }
  };

  // Delete order
  const removeOrder = async (orderId) => {
    try {
      const success = deleteOrder(orderId);
      if (success) {
        await loadOrders(); // Reload orders
        toast.success(t('orders.orderDeleted'));
      } else {
        toast.error(t('orders.errors.deleteFailed'));
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error(t('orders.errors.deleteFailed'));
    }
  };

  // Track order (simulate)
  const trackOrder = (order) => {
    toast.info(t('orders.trackingInfo', { orderNumber: order.orderNumber }));
    // In real app, this would navigate to tracking page
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFilter('all');
  };

  return {
    // State
    orders: filteredOrders,
    allOrders: orders,
    loading,
    searchQuery,
    statusFilter,
    dateFilter,
    expandedOrders,
    statistics,
    
    // Actions
    setSearchQuery,
    setStatusFilter,
    setDateFilter,
    toggleOrderExpanded,
    reorderItems,
    changeOrderStatus,
    cancelOrder,
    removeOrder,
    trackOrder,
    clearFilters,
    loadOrders
  };
};
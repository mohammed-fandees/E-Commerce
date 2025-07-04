import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchOrders as fetchOrdersApi,
  createOrder as createOrderApi,
  updateOrderStatus as updateOrderStatusApi,
  deleteOrder as deleteOrderApi,
} from "@/services/ordersApi";
import { toast } from "sonner";

export const useOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Load orders from Supabase
  const loadOrders = async () => {
    setLoading(true);
    try {
      const ordersData = await fetchOrdersApi();
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error(t("orders.errors.loadFailed"));
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
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          (order.orderNumber || "").toLowerCase().includes(query) ||
          (order.order_items || []).some((item) =>
            (item.name || "").toLowerCase().includes(query)
          )
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      switch (dateFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "3months":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      filtered = filtered.filter(
        (order) => new Date(order.created_at) >= filterDate
      );
    }
    return filtered;
  }, [orders, searchQuery, statusFilter, dateFilter]);

  // Toggle order expansion
  const toggleOrderExpanded = (orderId) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Update order status
  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, newStatus);
      await loadOrders();
      toast.success(t("orders.statusUpdated"));
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(t("orders.errors.statusUpdateFailed"));
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    try {
      await changeOrderStatus(orderId, "cancelled");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(t("orders.errors.cancelFailed"));
    }
  };

  // Delete order
  const removeOrder = async (orderId) => {
    try {
      await deleteOrderApi(orderId);
      await loadOrders();
      toast.success(t("orders.orderDeleted"));
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(t("orders.errors.deleteFailed"));
    }
  };

  // Track order (simulate)
  const trackOrder = (order) => {
    toast.info(t("orders.trackingInfo", { orderNumber: order.orderNumber }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("all");
  };

  // Create order (for checkout)
  const createOrder = async (orderData, items) => {
    setLoading(true);
    try {
      await createOrderApi(orderData, items);
      await loadOrders();
      toast.success(t("orders.orderCreated"));
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(t("orders.errors.createFailed"));
    } finally {
      setLoading(false);
    }
  };

  return {
    orders: filteredOrders,
    allOrders: orders,
    loading,
    searchQuery,
    statusFilter,
    dateFilter,
    expandedOrders,
    setSearchQuery,
    setStatusFilter,
    setDateFilter,
    toggleOrderExpanded,
    changeOrderStatus,
    cancelOrder,
    removeOrder,
    trackOrder,
    clearFilters,
    loadOrders,
    createOrder,
  };
};

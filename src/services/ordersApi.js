import supabase from "./supabase/supabaseClient";

// Get current user id from supabase auth
export async function getCurrentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id || null;
}

// Create a new order and order items
export async function createOrder(orderData, items) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("User not logged in");
  // Insert order
  const { data: orderArr, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      orderNumber: orderData.orderNumber,
      billing: orderData.billing,
      payment_method: orderData.paymentMethod,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shipping: orderData.shipping,
      total: orderData.total,
      coupon: orderData.coupon ? JSON.stringify(orderData.coupon) : null,
      save_info: orderData.saveInfo || false,
      status: orderData.status || "pending",
    })
    .select("*");
  if (orderError) throw orderError;
  const order = Array.isArray(orderArr) ? orderArr[0] : orderArr;
  // Insert order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    name: item.title,
    image: item.img || item.image,
    price: item.price,
    quantity: item.quantity,
  }));
  if (orderItems.length > 0) {
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);
    if (itemsError) throw itemsError;
  }
  return order;
}

// Fetch all orders for current user
export async function fetchOrders() {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getOrderTotalQuantity(orderId) {
  const { data, error } = await supabase
    .from("order_items")
    .select("quantity")
    .eq("order_id", orderId);

  if (error) {
    console.error(error);
    return null;
  }

  return data.reduce((total, item) => total + item.quantity, 0);
}

export async function fetchOrderItems(orderId) {
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);
  
    if (error) {
    console.error(error);
    return null;
  }

  return data;
}

// Update order status
export async function updateOrderStatus(orderId, newStatus) {
  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId);
  if (error) throw error;
}

// Delete order
export async function deleteOrder(orderId) {
  const { error } = await supabase.from("orders").delete().eq("id", orderId);
  if (error) throw error;
}

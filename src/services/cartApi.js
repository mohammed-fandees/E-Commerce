import supabase from "./supabase/supabaseClient";

// Get current user id from supabase auth
export async function getCurrentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id || null;
}

// Get or create cart for user
export async function getOrCreateCart() {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("User not logged in");
  let { data: cart, error } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!cart) {
    // Create new cart
    const { data: newCart, error: createError } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select("*")
      .maybeSingle();
    if (createError) throw createError;
    cart = newCart;
  }
  return cart;
}

// Fetch cart items for user
export async function fetchCartItems() {
  const cart = await getOrCreateCart();
  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id);
  if (error) throw error;
  return data || [];
}

// Add or update item in cart
export async function addOrUpdateCartItem(product, quantity = 1) {
  const cart = await getOrCreateCart();
  // Check if item exists
  const { data: existing, error: findError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id)
    .eq("product_id", product.id)
    .maybeSingle();
  if (findError) throw findError;
  if (existing) {
    // Update quantity
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
    if (updateError) throw updateError;
  } else {
    // Insert new item
    const { error: insertError } = await supabase.from("cart_items").insert({
      cart_id: cart.id,
      product_id: product.id,
      name: product.title,
      img: product.img || product.image,
      price: product.price,
      quantity,
    });
    if (insertError) throw insertError;
  }
}

// Remove item from cart
export async function removeCartItem(productId) {
  const cart = await getOrCreateCart();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id)
    .eq("product_id", productId);
  if (error) throw error;
}

// Update quantity for item
export async function updateCartItemQuantity(productId, quantity) {
  const cart = await getOrCreateCart();
  if (quantity <= 0) return removeCartItem(productId);
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("cart_id", cart.id)
    .eq("product_id", productId);
  if (error) throw error;
}

// Clear all items from cart
export async function clearCartItems() {
  const cart = await getOrCreateCart();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id);
  if (error) throw error;
}

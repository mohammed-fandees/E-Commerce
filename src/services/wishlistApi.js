import supabase from "./supabase/supabaseClient";

// Get current user id from supabase auth
export async function getCurrentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id || null;
}

// Fetch wishlist items for current user
export async function fetchWishlist() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from("wishlists")
    .select(`
      product_id,
      products (
        id,
        title,
        description,
        img,
        images,
        price,
        oldPrice,
        rating,
        reviewsCount,
        inStock,
        stockCount,
        category,
        brand,
        sku,
        specifications,
        colors,
        sizes
      )
    `)
    .eq("user_id", userId);

  if (error) throw error;

  return data?.map((row) => ({
    id: row.products.id,
    title: row.products.title,
    description: row.products.description,
    img: row.products.img,
    images: row.products.images,
    price: row.products.price,
    oldPrice: row.products.oldPrice,
    rating: row.products.rating,
    reviewsCount: row.products.reviewsCount,
    inStock: row.products.inStock,
    stockCount: row.products.stockCount,
    category: row.products.category,
    brand: row.products.brand,
    sku: row.products.sku,
    specifications: row.products.specifications,
    colors: row.products.colors,
    sizes: row.products.sizes
  })) || [];
}


// Add product to wishlist
export async function addToWishlist(productId) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("User not logged in");
  const { error } = await supabase
    .from("wishlists")
    .insert({ user_id: userId, product_id: productId });
  if (error && error.code !== "23505") throw error; // ignore duplicate
}

// Remove product from wishlist
export async function removeFromWishlist(productId) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("User not logged in");
  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
  if (error) throw error;
}

// Clear all wishlist items for user
export async function clearWishlist() {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("User not logged in");
  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}

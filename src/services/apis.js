import supabase from "./supabase/supabaseClient";

// Fetch products from the database

export async function fetchProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return data;
}

export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("getProductById error:", err);
    return null;
  }
};

// Fetch reviews for a product
export async function fetchReviews(productId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Add a new review
export async function addReview({
  product_id,
  user_name,
  user_email,
  user_avatar,
  rating,
  text,
}) {
  const { data, error } = await supabase
    .from("reviews")
    .insert(
      [
        {
          product_id: Number(product_id),
          user_name,
          user_email,
          user_avatar,
          rating: Number(rating),
          text,
        },
      ],
      { returning: "representation" }
    )
    .select("*");
  if (error) throw error;
  // data is array, return first item
  return Array.isArray(data) ? data[0] : data;
}

// Check if user already reviewed this product
export async function getUserReview(productId, userEmail) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", Number(productId))
    .eq("user_email", userEmail)
    .maybeSingle();
  if (error && error.code !== "PGRST116" && error.code !== "406") throw error; // ignore not found/406
  return data;
}


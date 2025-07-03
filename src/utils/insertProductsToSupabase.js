import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const SUPABASE_URL = "your-supabase-url"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = "your-supabase-anon-key"; // Replace with your Supabase anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const rawData = fs.readFileSync("./src/data/products.json", "utf8");
const products = JSON.parse(rawData).products;

async function insertProducts() {
  for (const product of products) {
    const { error } = await supabase.from("products").insert([
      {
        id: product.id,
        title: product.title,
        description: product.description,
        img: product.img,
        images: product.images,
        price: product.price,
        old_price: product.oldPrice,
        rating: product.rating,
        reviews_count: product.reviewsCount,
        in_stock: product.inStock,
        stock_count: product.stockCount,
        category: product.category,
        brand: product.brand,
        sku: product.sku,
        specifications: product.specifications,
        colors: product.colors,
        sizes: product.sizes,
      },
    ]);

    if (error) {
      console.error(
        `❌ Error inserting product ID ${product.id}:`,
        error.message
      );
    } else {
      console.log(`✅ Inserted product ID ${product.id}`);
    }
  }

  console.log("🎉 Done!");
}

insertProducts();

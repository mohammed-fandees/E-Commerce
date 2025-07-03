import { useEffect, useState } from "react";
import { fetchProducts } from "@/services/apis";

export function useProductTitle(productId) {
  const [title, setTitle] = useState("");
  useEffect(() => {
    if (!productId) return;
    fetchProducts().then((products) => {
      const product = (products || []).find(
        (p) => String(p.id) === String(productId)
      );
      setTitle(product ? product.title : "");
    });
  }, [productId]);
  return title;
}

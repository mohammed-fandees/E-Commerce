import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "./useCart";
import { useWishlist } from "./useWishlist";
import { toast } from "sonner";
import { fetchProducts } from "@/services/apis";

export const useProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const allProducts = await fetchProducts();
        const foundProduct = allProducts.find((p) => p.id === parseInt(id));
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedColor(foundProduct.colors?.[0] || null);
          setSelectedSize(foundProduct.sizes?.find((s) => s.available) || null);

          // Get related products (exclude current product)
          const related = allProducts
            .filter(
              (p) =>
                p.category == foundProduct.category && p.id !== foundProduct.id
            )
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          setProduct(null);
          setRelatedProducts([]);
        }
      } catch (error) {
        setProduct(null);
        setRelatedProducts([]);
      }
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  const handleImageSelect = (index) => {
    setSelectedImage(index);
    setImageLoading(true);
  };

  const handleColorSelect = (color) => {
    if (color.available) {
      setSelectedColor(color);
    }
  };

  const handleSizeSelect = (size) => {
    if (size.available) {
      setSelectedSize(size);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stockCount || 99)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.title,
      img: product.images?.[selectedImage] || product.img,
      price: product.price,
      quantity: quantity,
      selectedColor: selectedColor?.name,
      selectedSize: selectedSize?.name,
    };

    addItem(cartItem);
    toast.success(t("product.addedToCart", { name: product.title }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const handleAddToWishlist = () => {
    if (!product) return;

    const wishlistItem = {
      id: product.id,
      title: product.title,
      image: product.images?.[selectedImage] || product.img,
      price: product.price,
      oldPrice: product.oldPrice,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
    };

    addToWishlist(wishlistItem);
    toast.success(t("product.addedToWishlist", { name: product.title }));
  };

  // Calculate discount percentage
  const discountPercentage = product?.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  // Check if product is in wishlist
  const isWishlistItem = product ? isInWishlist(product.id) : false;

  return {
    // Data
    product,
    relatedProducts,
    selectedImage,
    selectedColor,
    selectedSize,
    quantity,
    discountPercentage,
    isWishlistItem,

    // State
    loading,
    imageLoading,

    // Actions
    handleImageSelect,
    handleColorSelect,
    handleSizeSelect,
    handleQuantityChange,
    handleAddToCart,
    handleBuyNow,
    handleAddToWishlist,
    setImageLoading,
  };
};

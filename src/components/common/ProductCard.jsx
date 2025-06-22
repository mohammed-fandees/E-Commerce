import { useState } from "react";
import { ImageOff, Eye, Heart, Trash2 } from "lucide-react";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useWishlist } from "@/hooks/useWishlist";

export default function ProductCard({ id, title, image, price, oldPrice, rating, wish = false, reviewsCount, loading = false, showAsWishlistItem = false }) {
  const [imgError, setImgError] = useState(false);
  const [animationState, setAnimationState] = useState(""); // Track animation state
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isWishlistItem = showAsWishlistItem || isInWishlist(id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const product = { id, name: title, img: image, price, quantity: 1 };

    addItem(product);

    toast.success(t("cart.itemAdded"))
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlistItem) {
      // Removing from wishlist
      setAnimationState("removing");
      removeFromWishlist(id);
      toast.success(t("wishlist.itemRemoved"));
      
      // Clear animation after it completes (400ms for bounce-out)
      setTimeout(() => {
        setAnimationState("");
      }, 400);
    } else {
      // Adding to wishlist
      setAnimationState("adding");
      const product = { id, title, image, price, oldPrice, rating, reviewsCount };
      addToWishlist(product);
      toast.success(t("wishlist.itemAdded"));
      
      // Clear animation after it completes (800ms for bounce-glow)
      setTimeout(() => {
        setAnimationState("");
      }, 800);
    }
  };

  // Generate wishlist button classes
  const getWishlistButtonClasses = () => {
    let classes = "cursor-pointer bg-white p-1 rounded-full shadow wishlist-button";
    
    if (animationState) {
      classes += ` ${animationState}`;
    }
    
    if (isWishlistItem) {
      classes += " active";
    }
    
    return classes;
  };

  return (
    <div className="product-card rounded-md relative min-w-[270px] min-h-[350px] [direction:ltr]">
      {loading ? (
        <div className="p-4">
          <Skeleton variant="rectangular" width="100%" height="250px" className="mb-3 rounded" />
          <div className="flex flex-col ms-3">
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="30%" />
          </div>
        </div>
      ) : (
        <>
          {oldPrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{Math.floor(100 - (price / oldPrice) * 100)}%
            </div>
          )}

          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {wish ? (
              <button className="cursor-pointer bg-white p-1 rounded-full shadow">
                <Trash2 size="24" />
              </button>
            ) : (
              <button onClick={handleWishlistToggle} className={getWishlistButtonClasses()}>
                <Heart  size="24"  fill={isInWishlist(id) ? "currentColor" : "none"}  className="heart-icon" />
              </button>
            )}
          </div>

          <div className="rounded-sm h-[250px] overflow-hidden bg-[#F5F5F5]">
            {imgError ? (
              <Link to={`/products/${id}`}>
                <div className="flex items-center mb-4 justify-center h-[250px]">
                  <ImageOff size="68" color="#aaa" />
                </div>
              </Link>
            ) : (
              <Link to={`/products/${id}`}>
                <div className="rounded-sm h-[250px] mb-4 overflow-hidden flex items-center justify-center ">
                  <img loading="lazy" src={image} alt={title} onError={() => setImgError(true)} className="object-contain w-[80%] h-[75%]" />
                </div>
              </Link>
            )}
            <button
              onClick={handleAddToCart}
              className={`add-to-card w-full py-2 bg-black text-white text-sm hover:opacity-90 transition ${wish && "on-wish-list -translate-y-[52px]"}`}
            >
              {t("common.addToCart")}
            </button>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-800 line-clamp-2 mb-1">
              <Link to={`/products/${id}`}>{title}</Link>
            </h3>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-600 font-semibold">${price}</span>
              {oldPrice && (
                <span className="text-gray-400 line-through text-sm">
                  ${oldPrice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-yellow-500 text-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-xl">{i < rating ? "★" : "☆"}</span>
              ))}
              <span className="text-gray-600 ml-1">({reviewsCount})</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
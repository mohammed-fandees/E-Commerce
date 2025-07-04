import { useState } from "react";
import { ImageOff, Heart, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useWishlist } from "@/hooks/useWishlist";
import { useInView } from "react-intersection-observer";

export default function ProductCard({ id, title, image, price, oldPrice, rating, wish = false, reviewsCount, showAsWishlistItem = false }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [animationState, setAnimationState] = useState(""); // Track animation state
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "-100px 0px" });
  const isWishlistItem = showAsWishlistItem || isInWishlist(id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const product = { id, name: title, img: image, price, quantity: 1 };

    addItem(product);

    toast.promise(
      addItem(product),
      {
        success: t("cart.itemAdded"),
        error: t("cart.errorAddingItem"),
        loading: t("cart.addingItem"),
      },
      { duration: 2000 }
    );
  };

  const handleRemoveFromWishlist = (id) => {
    removeFromWishlist(id);
    toast.promise(
      removeFromWishlist(id),
      {
        success: t("wishlist.itemRemoved"),
        error: t("wishlist.errorRemovingItem"),
        loading: t("wishlist.removingItem"),
      },
      { duration: 2000 }
    );
    setAnimationState("removing");
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlistItem) {
      setAnimationState("removing");
      removeFromWishlist(id);
      toast.promise(
        removeFromWishlist(id),
        {
          success: t("wishlist.itemRemoved"),
          error: t("wishlist.errorRemovingItem"),
          loading: t("wishlist.removingItem"),
        },
        { duration: 2000 }
      );

      setTimeout(() => {
        setAnimationState("");
      }, 100);
    } else {
      setAnimationState("adding");
      const product = { id, title, image, price, oldPrice, rating, reviewsCount };
      addToWishlist(product);
      toast.promise(
        addToWishlist(product),
        {
          success: t("wishlist.itemAdded"),
          error: t("wishlist.errorAddingItem"),
          loading: t("wishlist.addingItem"),
        },
        { duration: 2000 }
      );

      setTimeout(() => {
        setAnimationState("");
      }, 800);
    }
  };

  const getWishlistButtonClasses = () => {
    let classes = " bg-white p-1 rounded-full shadow wishlist-button";

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
      {oldPrice && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          -{Math.floor(100 - (price / oldPrice) * 100)}%
        </div>
      )}

      <div className="absolute top-2 right-2 flex flex-col gap-2 z-5">
        {wish ? (
          <button onClick={() => handleRemoveFromWishlist(id)} className=" bg-white p-1 rounded-full shadow stroke-black hover:stroke-red-500 transition-stroke duration-100">
            <Trash2 size="24" className="stroke-inherit" />
          </button>
        ) : (
          <button onClick={handleWishlistToggle} className={getWishlistButtonClasses()}>
            <Heart size="24" fill={isInWishlist(id) ? "currentColor" : "none"} className="heart-icon" />
          </button>
        )}
      </div>

      <div className="h-[250px] w-[100%] overflow-hidden relative rounded-sm">
        <div ref={ref} className="rounded-sm h-[250px] overflow-hidden bg-[#F5F5F5] relative">
          <Link to={`/products/${id}`}>
            <div className={`absolute inset-0 flex items-center mb-4 justify-center h-[250px] transition-opacity duration-300 ${imgLoaded && inView && !imgError ? 'opacity-0' : 'opacity-100'}`}>
              <ImageOff size="68" color="#aaa" />
            </div>
          </Link>

          {inView && !imgError && (
            <Link to={`/products/${id}`}>
              <div className="rounded-sm h-[250px] mb-4 overflow-hidden flex items-center justify-center ">
                <img
                  loading="lazy"
                  src={image}
                  alt={title}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                  className={`object-contain w-[80%] h-[75%] transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>
            </Link>
          )}

        </div>
        <button
          onClick={handleAddToCart}
          className={`add-to-card w-full py-2 bg-black text-white text-sm hover:opacity-90 transition ${wish && "on-wish-list -translate-y-[36px]"}`}
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
    </div>
  );
}
import { useState } from "react";
import { ImageOff, Eye, Heart, Trash2 } from "lucide-react";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function ProductCard({ id, title, image, price, oldPrice, rating, wish = false, reviewsCount, loading = false }) {
  const [imgError, setImgError] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="product-card rounded-md relative min-w-[270px] min-h-[350px] [direction:ltr]">
      {loading ? (
        <div>
          <Skeleton variant="rectangular" width={220} height={160} />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
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
              <>
                <button className="cursor-pointer bg-white p-1 rounded-full shadow">
                  <Heart size="24" />
                </button>
                <button className="cursor-pointer bg-white p-1 rounded-full shadow">
                  <Eye size='24' />
                </button>
              </>
            )}
          </div>

          <div className="rounded-sm h-[250px] overflow-hidden bg-[#F5F5F5]">
            {imgError ? (
              <Link to={`product/${id}`}>
                <div className="flex items-center mb-4 justify-center h-[250px]">
                  <ImageOff size="68" color="#aaa" />
                </div>
              </Link>
            ) : (
              <Link to={`product/${id}`}>
                <div className="rounded-sm h-[250px] mb-4 overflow-hidden flex items-center justify-center ">
                  <img src={image} alt={title} onError={() => setImgError(true)} className="object-contain w-[80%] h-[75%]" loading="lazy" />
                </div>
              </Link>

            )}
            <button className={`add-to-card w-full py-2 bg-black text-white text-sm hover:opacity-90 transition ${wish && "on-wish-list -translate-y-[52px]"}`}>
              {t("common.addToCart")}
            </button>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-800 line-clamp-2 mb-1">
              <Link to={`product/${id}`}>{title}</Link>
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

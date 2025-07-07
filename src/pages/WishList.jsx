import Button from "@/components/common/Button";
import { useTranslation } from "react-i18next";
import SectionHeader from "@/components/common/SectionHeader";
import ProductCard from "@/components/common/ProductCard";
import Container from "@/routes/Container";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { Link } from "react-router";
import Breadcrumbs from "@/components/common/Breadcrumbs ";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/services/apis";
import VirtualProductCard from "@/components/common/VirtualProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function WishList() {
  const { t } = useTranslation();
  const { items: wishlistItems, getWishlistCount, moveAllToCart } = useWishlist();
  const { addItem: addToCart } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then((data) => {
        setAllProducts(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Products you may like
  const forYou = allProducts
    .filter(product => !wishlistItems.some(wishItem => wishItem.id === product.id))
    .slice(0, 4);

  const handleMoveAllToBag = () => {
    if (wishlistItems.length === 0) {
      toast.info(t("wishlist.emptyWishlist"));
      return;
    }

    toast.promise(
      moveAllToCart(addToCart),
      {
        success: t("wishlist.movedAllToCart"),
        error: t("wishlist.errorMovingItems"),
        loading: t("wishlist.movingItems"),
      },
      { duration: 2000 }
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Breadcrumbs />
      <div className="my-8">
        <div className="flex justify-between items-center mb-15">
          <h2 className="text-xl">
            {t("wishlist.title")} ({getWishlistCount()})
          </h2>
          <Button
            className="bg-transparent border-1 border-[#0000004D] !text-black"
            onClick={handleMoveAllToBag}
            disabled={wishlistItems.length === 0}
          >
            {t("common.moveAllToBag")}
          </Button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-4">
              <Heart size="64" className="mx-auto text-gray-300" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {t("wishlist.empty")}
            </h3>
            <p className="text-gray-500 mb-6">
              {t("wishlist.emptyDescription")}
            </p>
            <Button>
              <Link to="/">
                {t("common.continueShopping")}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlistItems.map((product) => (
              <VirtualProductCard
                wish={true}
                key={product.id}
                showAsWishlistItem={true}
                id={product.id}
                image={product.image || product.img || null}
                title={product.title}
                price={product.price}
                oldPrice={product.oldPrice || null}
                rating={product.rating || 0}
                reviewsCount={product.reviewsCount || 0}
              />
            ))}
          </div>
        )}

        {forYou.length > 0 && (
          <div className="mt-15">
            <div className="flex justify-between items-start mb-6">
              <SectionHeader title={t("wishlist.justForYou")} />
              <Link to="/products">
                <Button className="bg-transparent border-1 border-[#0000004D] !text-black">
                  {t("common.viewAll")}
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {forYou.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.img || product.image || null}
                  title={product.title}
                  price={product.price}
                  oldPrice={product.oldPrice || null}
                  rating={product.rating || 0}
                  reviewsCount={product.reviewsCount || 0}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

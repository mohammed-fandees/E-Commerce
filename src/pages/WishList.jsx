import Button from "@/components/common/Button";
import ProductsSwiper from "@/components/common/ProductsSwiper";
import data from "../data/products.json";
import { useTranslation } from "react-i18next";
import SectionHeader from "@/components/common/SectionHeader";
import ProductCard from "@/components/common/ProductCard";
import Container from "@/routes/Container";

export default function WishList() {
  const { t } = useTranslation();
  const wishes = data.products.slice(0, 6);
  const forYou = data.products.slice(6, 10);

  return (
    <Container>
      <div className="my-20">
        <div className="flex justify-between items-center mb-15">
          <h2 className="text-xl">{t("wishlist.title")} (5)</h2>
          <Button className="bg-transparent border-1 border-[#0000004D] !text-black">{t("common.moveAllToBag")}</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishes?.map((product, i) => (
            <ProductCard
              key={i}
              wish={true}
              id={product.id}
              image={product.img || null}
              title={product.title}
              price={product.price}
              oldPrice={product.oldPrice || null}
              rating={product.rating || 0}
              reviewsCount={product.reviewsCount || 0}
            />
          ))}
        </div>
        <div className="mt-15">
          <div className="flex justify-between items-start">
            <SectionHeader title={t("wishlist.title2")} />
            <Button className="bg-transparent border-1 border-[#0000004D] !text-black">{t("common.viewAll")}</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {forYou?.map((product, i) => (
              <ProductCard
                key={i}
                id={product.id}
                image={product.img || null}
                title={product.title}
                price={product.price}
                oldPrice={product.oldPrice || null}
                rating={product.rating || 0}
                reviewsCount={product.reviewsCount || 0}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
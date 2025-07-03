import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchProducts } from "@/services/apis";
import Breadcrumbs from "@/components/common/Breadcrumbs ";
import SectionHeader from "../components/common/SectionHeader";
import VirtualProductCard from "../components/common/VirtualProductCard";
import Container from "@/routes/Container";
import { useTranslation } from "react-i18next";

export default function CategoryProducts() {
  const { t } = useTranslation();
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts((data || []).filter((p) => p.category === category));
    });
  }, [category]);

  return (
    <Container>
      <Breadcrumbs />
      <SectionHeader title={t(`categories.${category}`)} description={t("categoryProducts.browseDescription", { category: t(`categories.${category}`) })} />
      {products?.length === 0 && <p className="text-gray-500">{t("categoryProducts.noProducts")}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <VirtualProductCard
            key={product.id}
            id={product.id}
            image={product.img || null}
            title={product.title}
            price={product.price}
            oldPrice={product.old_price || product.oldPrice || null}
            rating={product.rating || 0}
            reviewsCount={product.reviews_count || product.reviewsCount || 0}
          />
        ))}
      </div>
    </Container>
  );
}

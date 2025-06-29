import Breadcrumbs from '@/components/common/Breadcrumbs '
import Container from '@/routes/Container'
import React from 'react'
import data from '@/data/products.json';
import { CATEGORY_LABELS } from '@/data/categoryLabels';
import SectionHeader from '@/components/common/SectionHeader';
import { useTranslation } from 'react-i18next';
import ProductsSwiper from '@/components/common/ProductsSwiper';

export default function Products() {
  const products = data.products;
  const { t } = useTranslation();
  return (
    <Container>
      <Breadcrumbs />
      <div className="pt-8">
        {Object.keys(CATEGORY_LABELS).map((category) => (
          <div key={category} className="mb-8">
            <SectionHeader title={t(CATEGORY_LABELS[category])} />
            <ProductsSwiper products={products.filter((product) => product.category === category)} />
          </div>
        ))}
      </div>
    </Container>
  )
}

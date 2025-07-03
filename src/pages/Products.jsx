import Breadcrumbs from '@/components/common/Breadcrumbs '
import Container from '@/routes/Container'
import React, { useEffect, useState } from 'react'
import { fetchProducts } from '@/services/apis';
import { CATEGORY_LABELS } from '@/data/categoryLabels';
import SectionHeader from '@/components/common/SectionHeader';
import { useTranslation } from 'react-i18next';
import ProductsSwiper from '@/components/common/ProductsSwiper';

export default function Products() {
  const [products, setProducts] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data || []);
    });
  }, []);

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

import { useTranslation } from 'react-i18next';
import ProductCard from '@/components/common/ProductCard';
import SectionHeader from '../common/SectionHeader';

const RelatedProducts = ({ products }) => {
  const { t } = useTranslation();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <SectionHeader title={t("product.relatedItems")} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {products.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard
              id={product.id}
              title={product.title}
              image={product.img}
              price={product.price}
              oldPrice={product.oldPrice}
              rating={product.rating}
              reviewsCount={product.reviewsCount}
            />
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <button
          onClick={() => window.location.href = '/products'}
          className="bg-[#db4444] hover:bg-red-700 text-white px-12 py-4 rounded font-medium transition-all duration-200 border-0 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
        >
          {t('product.viewAllProducts')}
        </button>
      </div>
    </div>
  );
};

export default RelatedProducts;
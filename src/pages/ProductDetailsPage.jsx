import { useTranslation } from 'react-i18next';
import Container from '@/routes/Container';
import Breadcrumbs from '@/components/common/Breadcrumbs ';
import { useProductDetails } from '@/hooks/useProductDetails';
import ImageGallery from '@/components/ProductDetails/ImageGallery';
import ProductInfo from '@/components/ProductDetails/ProductInfo';
import RelatedProducts from '@/components/ProductDetails/RelatedProducts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProductDetailsPage() {
  const { t } = useTranslation();
  const {
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
    setImageLoading
  } = useProductDetails();

  if (loading) {
    return (
      <Container>
        <div className="min-h-screen p-4 md:p-8">
          <Breadcrumbs />
          <div className="flex justify-center items-center min-h-[500px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <div className="min-h-screen p-4 md:p-8">
          <Breadcrumbs />
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl text-gray-400">📦</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {t('product.notFound.title')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('product.notFound.message')}
            </p>
            <button 
              onClick={() => window.history.back()}
              className="bg-[#db4444] text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
            >
              {t('product.notFound.goBack')}
            </button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen">
        <Breadcrumbs />
        
        <div className="pt-4 sm:pt-8 pb-8 sm:pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 sm:mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                <ImageGallery
                  product={product}
                  selectedImage={selectedImage}
                  onImageSelect={handleImageSelect}
                  imageLoading={imageLoading}
                  onImageLoad={() => setImageLoading(false)}
                  discountPercentage={discountPercentage}
                />

                <ProductInfo
                  product={product}
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                  quantity={quantity}
                  isWishlistItem={isWishlistItem}
                  discountPercentage={discountPercentage}
                  onColorSelect={handleColorSelect}
                  onSizeSelect={handleSizeSelect}
                  onQuantityChange={handleQuantityChange}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  onAddToWishlist={handleAddToWishlist}
                />
              </div>
            </div>

            <RelatedProducts products={relatedProducts} />
          </div>
        </div>
      </div>
    </Container>
  );
}
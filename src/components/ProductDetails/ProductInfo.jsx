import { useTranslation } from 'react-i18next';
import { Heart, Minus, Plus, Truck, RotateCcw, Shield } from 'lucide-react';
import Button from '@/components/common/Button';

const ProductInfo = ({
  product,
  selectedColor,
  selectedSize,
  quantity,
  isWishlistItem,
  discountPercentage,
  onColorSelect,
  onSizeSelect,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onAddToWishlist
}) => {
  const { t } = useTranslation();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="flex flex-col md:ps-8">
      <h1 className="text-2xl md:text-4xl font-semibold text-gray-800 leading-tight">
        {product.title}
      </h1>

      <div className="pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviewsCount} {t('product.reviews')})
          </span>
          <span className="text-gray-300">|</span>
          <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
            {product.inStock ? t('product.inStock') : t('product.outOfStock')}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="pb-4">
        <div className="flex items-center space-x-4">
          <span className="text-2xl md:text-4xl font-normal text-gray-800">
            ${product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="text-base md:text-xl text-gray-400 line-through">
              ${product.oldPrice.toFixed(2)}
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-[#db4444] text-white px-3 py-1 rounded text-sm font-semibold">
              -{discountPercentage}%
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <p className="text-gray-500 leading-relaxed text-sm md:text-base">
          {product.description}
        </p>
      </div>

      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-lg font-medium text-gray-800">{t('product.colors')}:</h3>
          <div className="flex gap-3 flex-wrap">
            {product.colors.map((color, index) => (
              <button
                key={index}
                onClick={() => onColorSelect(color)}
                disabled={!color.available}
                className={`
                  relative w-5 h-5 border-2 border-gray-200 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center
                  hover:border-[#db4444] hover:scale-110
                  ${selectedColor?.name === color.name ? 'border-[#db4444]' : ''}
                  ${!color.available ? 'opacity-30 cursor-not-allowed hover:scale-100 hover:border-gray-200' : ''}
                `}
                title={color.name}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color.value }}
                />
                {selectedColor?.name === color.name && (
                  <div className="absolute text-white text-[0.55rem] font-bold">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-lg font-medium text-gray-800">{t('product.size')}:</h3>
          <div className="flex gap-3 flex-wrap">
            {product.sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => onSizeSelect(size)}
                disabled={!size.available}
                className={`
                  px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 cursor-pointer transition-all duration-200 text-sm font-medium min-w-[48px] text-center
                  hover:border-[#db4444] hover:text-[#db4444]
                  ${selectedSize?.name === size.name ? '!bg-[#db4444] !border-[#db4444] !text-white' : ''}
                  ${!size.available ? 'opacity-30 cursor-not-allowed bg-gray-100 hover:border-gray-300 hover:text-gray-700' : ''}
                `}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
        {/* Quantity Selector */}
        <div className="flex items-center border border-gray-300 rounded overflow-hidden w-fit">
          <button
            onClick={() => onQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="px-3 py-3 bg-white border-0 cursor-pointer transition-colors duration-200 flex items-center justify-center min-w-[44px] h-[50px]
             hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed focus:bg-[#db4444] focus:text-white"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-3 border-l border-r border-gray-300 bg-white font-medium min-w-[60px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            disabled={quantity >= (product.stockCount || 99)}
            className="px-3 py-3 bg-white cursor-pointer transition-colors duration-200 flex items-center justify-center min-w-[44px] h-[50px]
            hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed focus:bg-[#db4444] focus:text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 items-center flex-1">
          <Button onClick={onBuyNow} disabled={!product.inStock} className="flex-1 !px-2">
            {t('product.buyNow')}
          </Button>
          <Button onClick={onAddToCart} disabled={!product.inStock} className="flex-1 !px-2">
            {t('common.addToCart')}
          </Button>
          
          <button onClick={onAddToWishlist} title={t('product.addToWishlist')}
            className={`
              w-12 h-12 border border-gray-300 rounded bg-white text-gray-500 cursor-pointer transition-all duration-200 flex items-center justify-center flex-shrink-0
              hover:border-[#db4444] hover:text-[#db4444] hover:-translate-y-0.5
              ${isWishlistItem ? 'bg-[#db4444] border-[#db4444]' : ''}
            `}
          >
            <Heart className={`h-5 w-5 ${isWishlistItem ? 'fill-[#db4444] stroke-[#db4444]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 mb-8">
        <div className="flex items-start gap-4 py-4 border-b border-gray-200 first:pt-0 last:border-b-0 last:pb-0">
          <div className="w-10 h-10 bg-[#db4444] text-white rounded-full flex items-center justify-center flex-shrink-0">
            <Truck className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-800 mb-1">{t('product.freeDelivery')}</h4>
            <p className="text-xs text-gray-500 leading-snug">{t('product.freeDeliveryDesc')}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 py-4 border-b border-gray-200 first:pt-0 last:border-b-0 last:pb-0">
          <div className="w-10 h-10 bg-[#db4444] text-white rounded-full flex items-center justify-center flex-shrink-0">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-800 mb-1">{t('product.returnDelivery')}</h4>
            <p className="text-xs text-gray-500 leading-snug">{t('product.returnDeliveryDesc')}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 py-4 border-b border-gray-200 first:pt-0 last:border-b-0 last:pb-0">
          <div className="w-10 h-10 bg-[#db4444] text-white rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-800 mb-1">{t('product.warranty')}</h4>
            <p className="text-xs text-gray-500 leading-snug">{t('product.warrantyDesc')}</p>
          </div>
        </div>
      </div>

      {/* Product Details */}
      {product.specifications && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('product.specifications')}</h3>
          <div className="grid gap-3">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <span className="font-medium text-gray-700 text-sm">{key}:</span>
                <span className="text-gray-500 text-sm text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
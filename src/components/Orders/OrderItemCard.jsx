import { useTranslation } from 'react-i18next';
import { RotateCcw, Star, MessageCircle } from 'lucide-react';

const OrderItemCard = ({ item }) => {
  const { t } = useTranslation();

  const handleReorderItem = () => {
    // Add single item to cart
    try {
      const currentCart = JSON.parse(localStorage.getItem('cart') || '{"items": []}');
      const newItem = {
        id: item.id,
        name: item.name,
        img: item.image,
        price: item.price,
        quantity: 1
      };
      
      const existingItemIndex = currentCart.items.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        currentCart.items[existingItemIndex].quantity += 1;
      } else {
        currentCart.items.push(newItem);
      }
      
      localStorage.setItem('cart', JSON.stringify(currentCart));
      // Could trigger a toast notification here
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <div className="order-item-card">
      {/* Product Image */}
      <div className="flex-shrink-0 mx-auto sm:mx-0">
        <img
          src={item.image}
          alt={item.name}
          className="order-item-image"
          onError={(e) => {
            e.target.src = '/placeholder-product.jpg';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        {/* Product Name */}
        <h5 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 mb-1">
          {item.name}
        </h5>

        {/* Price and Quantity */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2 space-y-1 sm:space-y-0">
          <span className="text-base sm:text-lg font-semibold text-gray-900">
            ${item.price}
          </span>
          <span className="text-xs sm:text-sm text-gray-600">
            {t('orders.item.quantity')}: {item.quantity}
          </span>
          <span className="text-xs sm:text-sm font-medium text-gray-900">
            {t('orders.item.total')}: ${item.total.toFixed(2)}
          </span>
        </div>

        {/* Product Actions */}
        <div className="order-item-actions mt-3">
          <button
            onClick={handleReorderItem}
            className="buy-again-button inline-flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-yellow-400 hover:bg-yellow-500 text-black rounded-md font-medium transition-colors touch-target"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{t('orders.item.buyAgain')}</span>
          </button>

          <button className="inline-flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 hover:bg-gray-50 rounded-md transition-colors touch-target">
            <Star className="h-3 w-3" />
            <span>{t('orders.item.writeReview')}</span>
          </button>

          <button className="inline-flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors touch-target">
            <MessageCircle className="h-3 w-3" />
            <span>{t('orders.item.viewProduct')}</span>
          </button>
        </div>
      </div>

      {/* Item Status/Delivery Info */}
      <div className="flex-shrink-0 text-center sm:text-right mt-2 sm:mt-0">
        <div className="text-xs sm:text-sm text-gray-600 mb-1">
          {t('orders.item.delivered')}
        </div>
        <div className="text-xs text-gray-500">
          {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
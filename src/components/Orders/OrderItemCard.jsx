import { useTranslation } from 'react-i18next';
import { RotateCcw, Star, MessageCircle } from 'lucide-react';
import Button from '../common/Button';
import { Link } from 'react-router';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

const OrderItemCard = ({ item }) => {
  const { t } = useTranslation();
  const { addItem } = useCart()
  const handleReorderItem = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          addItem({
            id: item.product_id || item.id,
            name: item.name || item.title,
            image: item.image || item.img,
            price: item.price,
            quantity: 1
          });
          setTimeout(resolve, 600); // simulate async add
        } catch (err) {
          reject(err);
        }
      }),
      {
        loading: t('cart.updating'),
        success: t('orders.reorderSuccess'),
        error: t('cart.error')
      }
    );

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
            {t('orders.item.total')}: ${(item.quantity * item.price)?.toFixed(2)}
          </span>
        </div>

        {/* Product Actions */}
        <div className="order-item-actions mt-3">
          <Button
            onClick={handleReorderItem}
            className="cursor-pointer buy-again-button inline-flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-yellow-400 hover:bg-yellow-500 text-black rounded-md font-medium transition-colors touch-target"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{t('orders.item.buyAgain')}</span>
          </Button>
          <Link to={`/products/${item.product_id}`}>
            <Button className="inline-flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-md transition-colors touch-target">
              <Star className="h-3 w-3" />
              <span>{t('orders.item.writeReview')}</span>
            </Button>

          </Link>
          <Link to={`/products/${item.product_id}`}>
            <button className="cursor-pointer inline-flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors touch-target">
              <MessageCircle className="h-3 w-3" />
              <span>{t('orders.item.viewProduct')}</span>
            </button>
          </Link>
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
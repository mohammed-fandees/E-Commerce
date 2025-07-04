import { useTranslation } from 'react-i18next';
import { Package, ShoppingBag, Heart } from 'lucide-react';
import Button from '@/components/common/Button';

const OrdersEmpty = () => {
  const { t } = useTranslation();

  const handleStartShopping = () => {
    window.location.href = '/';
  };

  const handleViewWishlist = () => {
    window.location.href = '/wishlist';
  };

  const handleViewCart = () => {
    window.location.href = '/cart';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      {/* Main Empty State */}
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Package className="h-12 w-12 text-gray-400" />
        </div>

        {/* Title and Description */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          {t('orders.empty.title')}
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {t('orders.empty.description')}
        </p>

        {/* Primary Action */}
        <Button
          onClick={handleStartShopping}
          className="w-full mb-4 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3"
        >
          {t('orders.empty.startShopping')}
        </Button>

        {/* Secondary Actions */}
        <div className="space-y-3">
          <button
            onClick={handleViewWishlist}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors "
          >
            <Heart className="h-4 w-4" />
            <span>{t('orders.empty.viewWishlist')}</span>
          </button>

          <button
            onClick={handleViewCart}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors "
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{t('orders.empty.viewCart')}</span>
          </button>
        </div>
      </div>

      {/* Additional Help Section */}
      <div className="mt-12 pt-8 border-t border-gray-200 max-w-2xl mx-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('orders.empty.helpTitle')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">🛍️</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">
              {t('orders.empty.step1Title')}
            </h4>
            <p>{t('orders.empty.step1Desc')}</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">💳</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">
              {t('orders.empty.step2Title')}
            </h4>
            <p>{t('orders.empty.step2Desc')}</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">📦</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">
              {t('orders.empty.step3Title')}
            </h4>
            <p>{t('orders.empty.step3Desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersEmpty;
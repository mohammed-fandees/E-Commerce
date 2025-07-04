import { useTranslation } from 'react-i18next';
import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  X,
  Calendar,
  CreditCard,
  MapPin,
  FileText,
  Download
} from 'lucide-react';
import Button from '@/components/common/Button';
import OrderStatusBadge from './OrderStatusBadge';
import OrderItemCard from './OrderItemCard';
import { downloadInvoice } from '@/utils/exportUtils';
import { toast } from 'sonner';
import { fetchOrderItems, getOrderTotalQuantity } from '@/services/ordersApi';
import { useEffect, useState } from 'react';

const OrderCard = ({ 
  order, 
  isExpanded, 
  onToggleExpanded,
  onStatusChange,
  onCancel,
  onRemove, 
}) => {
  const { t } = useTranslation();
  const canCancel = order.status === 'pending';
  const [orderQuantity, setOrderQuantity] = useState(0);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const getItems = async () => {
      const items = await fetchOrderItems(order.id)
      setOrderItems(items);
    }

    getItems();
  }, [order.id])
  
  useEffect(() => {
    const quantity = async () => await getOrderTotalQuantity(order.id)
    setOrderQuantity(quantity());
  }, [order.id])

  const handleDownloadInvoice = async () => {
    try {
      downloadInvoice(order, {
        companyName: 'Your E-Commerce Store',
        companyAddress: '123 Business Street, City, State 12345',
        companyPhone: '(555) 123-4567',
        companyEmail: 'support@yourstore.com'
      });
      toast.success(t('orders.invoice.generated'));
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error(t('orders.invoice.error'));
    }
  };

  return (
    <div className="order-card bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="order-card-header">
          {/* Left Section - Order Info */}
          <div className="flex-1 min-w-0">
            <div className="order-info-section">
              {/* Order Number */}
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">{t('orders.card.orderNumber')}</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{order.orderNumber}</p>
              </div>
              
              {/* Order Date */}
              <div className="flex items-start space-x-2 min-w-0">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0 mt-[2px]" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">{t('orders.card.orderDate')}</p>
                  <p className="text-xs sm:text-sm text-gray-900 truncate">{new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
              
              {/* Order Total */}
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">{t('orders.card.total')}</p>
                <p className="font-semibold text-base sm:text-lg text-gray-900">${order.total}</p>
              </div>
            </div>
          </div>

          {/* Right Section - Status and Actions */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4 mt-4 sm:mt-0">
            <OrderStatusBadge status={order.status} />
            
            {/* Quick Actions */}
            <div className="order-actions">
              <Button onClick={handleDownloadInvoice} className="btn-responsive touch-target">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">{t('orders.actions.invoice')}</span>
              </Button>
              
              {/* Expand Button */}
              <Button onClick={onToggleExpanded} className="btn-responsive touch-target">
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('orders.actions.collapse')}</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('orders.actions.details')}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Order Summary Bar */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="order-summary-bar text-xs sm:text-sm text-gray-600">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="flex items-center space-x-1">
                <Package className="h-4 w-4 flex-shrink-0" />
                <span>{orderQuantity} {t('orders.card.items')}</span>
              </span>
              <span className="flex items-center space-x-1">
                <CreditCard className="h-4 w-4 flex-shrink-0" />
                <span className="capitalize">{order.payment_method}</span>
              </span>
            </div>
            
            {/* Delivery Address */}
            <div className="flex items-center space-x-1 mt-2 sm:mt-0">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{order.billing?.townCity || t('orders.card.addressNotSet')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Order Items */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4 text-sm sm:text-base">
              {t('orders.card.orderItems')} ({orderQuantity})
            </h4>
            <div className="order-items-section">
              {orderItems?.map((item, index) => (
                <OrderItemCard key={index} item={item} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="billing-section">
            {/* Billing Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
                {t('orders.card.billingInfo')}
              </h5>
              <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                <p><strong>{t('orders.card.name')}:</strong> {order.billing?.firstName}</p>
                <p><strong>{t('orders.card.address')}:</strong> {order.billing?.streetAddress}</p>
                <p><strong>{t('orders.card.city')}:</strong> {order.billing?.townCity}</p>
                <p><strong>{t('orders.card.phone')}:</strong> {order.billing?.phoneNumber}</p>
                <p className="break-all"><strong>{t('orders.card.email')}:</strong> {order.billing?.emailAddress}</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
                {t('orders.card.priceBreakdown')}
              </h5>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('orders.card.subtotal')}:</span>
                  <span>${order?.subtotal?.toFixed(2)}</span>
                </div>
                {order?.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('orders.card.discount')}:</span>
                    <span>-${order?.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('orders.card.shipping')}:</span>
                  <span>
                    {order?.shipping === 0
                      ? t('orders.card.free')
                      : `${order?.shipping?.toFixed(2)}`
                    }
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-sm sm:text-lg pt-2 border-t border-gray-200">
                  <span>{t('orders.card.total')}:</span>
                  <span>${order?.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Actions */}
          <div className="action-buttons-container pt-4 border-t border-gray-200">
            {canCancel && (
              <Button onClick={onCancel} className="btn-responsive  touch-target">
                <X className="h-4 w-4" />
                <span>{t('orders.actions.cancel')}</span>
              </Button>
            )}
            
            <Button onClick={() => onRemove()} className="btn-responsive touch-target">
              <X className="h-4 w-4" />
              <span>{t('orders.actions.remove')}</span>
            </Button>

            <Button
              onClick={handleDownloadInvoice}
              className="btn-responsive touch-target"
            >
              <Download className="h-4 w-4" />
              <span>{t('orders.actions.downloadInvoice')}</span>
            </Button>

            {order.status === 'pending' && (
              <Button
                onClick={() => onStatusChange('completed')}
                className="btn-responsive bg-green-600 hover:bg-green-700 text-white touch-target"
              >
                {t('orders.actions.markCompleted')}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
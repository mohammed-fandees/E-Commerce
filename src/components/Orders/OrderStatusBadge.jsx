import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle, XCircle, Package } from 'lucide-react';

const OrderStatusBadge = ({ status, size = 'default' }) => {
  const { t } = useTranslation();

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          label: t('orders.status.pending'),
          icon: Clock,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          dotColor: 'bg-yellow-400'
        };
      case 'completed':
        return {
          label: t('orders.status.completed'),
          icon: CheckCircle,
          className: 'bg-green-100 text-green-800 border-green-200',
          dotColor: 'bg-green-400'
        };
      case 'cancelled':
        return {
          label: t('orders.status.cancelled'),
          icon: XCircle,
          className: 'bg-red-100 text-red-800 border-red-200',
          dotColor: 'bg-red-400'
        };
      default:
        return {
          label: t('orders.status.unknown'),
          icon: Package,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          dotColor: 'bg-gray-400'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-1 text-xs' 
    : 'px-3 py-1 text-sm';

  return (
    <span className={`
      inline-flex items-center space-x-1 rounded-full border font-medium
      ${config.className} ${sizeClasses}
    `}>
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      
      <Icon className="h-3 w-3" />
      
      <span>{config.label}</span>
    </span>
  );
};

export default OrderStatusBadge;
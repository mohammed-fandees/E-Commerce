import { useTranslation } from 'react-i18next';
import { Package, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';

const OrdersStats = ({ statistics }) => {
  const { t } = useTranslation();

  const stats = [
    {
      id: 'total',
      label: t('orders.stats.total'),
      value: statistics.total || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'pending',
      label: t('orders.stats.pending'),
      value: statistics.pending || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'completed',
      label: t('orders.stats.completed'),
      value: statistics.completed || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'cancelled',
      label: t('orders.stats.cancelled'),
      value: statistics.cancelled || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 'totalValue',
      label: t('orders.stats.totalSpent'),
      value: `${(statistics.totalValue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className={`stats-card p-3 sm:p-4 rounded-lg border ${stat.bgColor} ${stat.borderColor} transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  {stat.label}
                </p>
                <p className={`text-xl sm:text-2xl font-bold ${stat.color} mt-1 break-words`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-full ${stat.bgColor} flex-shrink-0 ml-3`}>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
              </div>
            </div>
            
            {/* Progress bar for visual appeal */}
            {stat.id !== 'totalValue' && statistics.total > 0 && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`progress-bar h-1 rounded-full bg-current ${stat.color}`}
                    style={{ 
                      width: `${Math.min((stat.value / statistics.total * 100), 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrdersStats;
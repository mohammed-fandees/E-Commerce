import { useTranslation } from 'react-i18next';
import OrderCard from './OrderCard';
import { Package } from 'lucide-react';

const OrdersList = ({ 
  orders, 
  expandedOrders, 
  onToggleExpanded,
  onReorder,
  onStatusChange,
  onCancel,
  onRemove,
  onTrack,
  noResultsMessage 
}) => {
  const { t } = useTranslation();

  if (noResultsMessage) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('orders.noResults.title')}
        </h3>
        <p className="text-gray-600 mb-4">
          {t('orders.noResults.message')}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {t('orders.noResults.refresh')}
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {t('orders.list.title')} ({orders.length})
        </h2>
        
        {/* Sort Options */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {t('orders.list.sortBy')}:
          </span>
          <select className="border border-gray-300 rounded px-3 py-1 text-sm">
            <option value="date-desc">{t('orders.list.sort.newest')}</option>
            <option value="date-asc">{t('orders.list.sort.oldest')}</option>
            <option value="total-desc">{t('orders.list.sort.highest')}</option>
            <option value="total-asc">{t('orders.list.sort.lowest')}</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            isExpanded={expandedOrders.has(order.id)}
            onToggleExpanded={() => onToggleExpanded(order.id)}
            onReorder={() => onReorder(order)}
            onStatusChange={(status) => onStatusChange(order.id, status)}
            onCancel={() => onCancel(order.id)}
            onTrack={() => onTrack(order)}
          />
        ))}
      </div>

      {/* Load More / Pagination could go here */}
      {orders.length >= 10 && (
        <div className="text-center pt-8">
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            {t('orders.list.loadMore')}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
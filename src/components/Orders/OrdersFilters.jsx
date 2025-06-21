import { useTranslation } from 'react-i18next';
import { X, Filter } from 'lucide-react';
import Button from '@/components/common/Button';

const OrdersFilters = ({ 
  statusFilter, 
  dateFilter, 
  onStatusChange, 
  onDateChange, 
  onClearFilters,
  hasActiveFilters 
}) => {
  const { t } = useTranslation();

  const statusOptions = [
    { value: 'all', label: t('orders.filters.status.all') },
    { value: 'pending', label: t('orders.filters.status.pending') },
    { value: 'completed', label: t('orders.filters.status.completed') },
    { value: 'cancelled', label: t('orders.filters.status.cancelled') }
  ];

  const dateOptions = [
    { value: 'all', label: t('orders.filters.date.all') },
    { value: 'week', label: t('orders.filters.date.week') },
    { value: 'month', label: t('orders.filters.date.month') },
    { value: '3months', label: t('orders.filters.date.threeMonths') },
    { value: 'year', label: t('orders.filters.date.year') }
  ];

  return (
    <div className="filters-container">
      <div className="filters-content">
        {/* Filter Icon and Title */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700 text-sm sm:text-base">
            {t('orders.filters.title')}
          </span>
        </div>

        {/* Filter Controls */}
        <div className="filter-controls">
          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
            <label className="text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">
              {t('orders.filters.status.label')}:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="filter-select border border-gray-300 rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focusable"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
            <label className="text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">
              {t('orders.filters.date.label')}:
            </label>
            <select
              value={dateFilter}
              onChange={(e) => onDateChange(e.target.value)}
              className="filter-select border border-gray-300 rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focusable"
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button onClick={onClearFilters} className="btn-responsive touch-target">
              <X className="h-4 w-4" />
              <span>{t('orders.filters.clear')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">
              {t('orders.filters.active')}:
            </span>
            {statusFilter !== 'all' && (
              <span className="filter-tag inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {statusOptions.find(opt => opt.value === statusFilter)?.label}
              </span>
            )}
            {dateFilter !== 'all' && (
              <span className="filter-tag inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                {dateOptions.find(opt => opt.value === dateFilter)?.label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersFilters;
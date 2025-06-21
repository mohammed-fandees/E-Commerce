import { useTranslation } from 'react-i18next';
import Container from '@/routes/Container';
import Breadcrumbs from '@/components/common/Breadcrumbs ';
import { useOrders } from '@/hooks/useOrders';
import OrdersHeader from '@/components/Orders/OrdersHeader';
import OrdersFilters from '@/components/Orders/OrdersFilters';
import OrdersStats from '@/components/Orders/OrdersStats';
import OrdersList from '@/components/Orders/OrdersList';
import OrdersEmpty from '@/components/Orders/OrdersEmpty';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Orders() {
  const { t } = useTranslation();
  const {
    // State
    orders,
    allOrders,
    loading,
    searchQuery,
    statusFilter,
    dateFilter,
    expandedOrders,
    statistics,
    
    // Actions
    setSearchQuery,
    setStatusFilter,
    setDateFilter,
    toggleOrderExpanded,
    reorderItems,
    changeOrderStatus,
    cancelOrder,
    removeOrder,
    trackOrder,
    clearFilters
  } = useOrders();

  if (loading) {
    return (
      <Container>
        <div className="orders-container">
          <Breadcrumbs />
          <div className="flex justify-center items-center min-h-[500px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="orders-container">
        <Breadcrumbs />
        
        <div className="pt-4 sm:pt-8 pb-8 sm:pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <OrdersHeader 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalOrders={allOrders.length}
            />

            {/* Orders Content */}
            {allOrders.length === 0 ? (
              <OrdersEmpty />
            ) : (
              <>
                {/* Filters and Stats */}
                <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
                  <OrdersFilters
                    statusFilter={statusFilter}
                    dateFilter={dateFilter}
                    onStatusChange={setStatusFilter}
                    onDateChange={setDateFilter}
                    onClearFilters={clearFilters}
                    hasActiveFilters={searchQuery || statusFilter !== 'all' || dateFilter !== 'all'}
                  />
                  
                  <OrdersStats statistics={statistics} />
                </div>

                {/* Orders List */}
                <OrdersList
                  orders={orders}
                  expandedOrders={expandedOrders}
                  onToggleExpanded={toggleOrderExpanded}
                  onReorder={reorderItems}
                  onStatusChange={changeOrderStatus}
                  onCancel={cancelOrder}
                  onRemove={removeOrder}
                  onTrack={trackOrder}
                  noResultsMessage={orders.length === 0 && allOrders.length > 0}
                />
              </>
            )}

            {/* Help Section */}
            <div className="help-section">
              <div className="help-content">
                <div className="text-blue-500 text-xl sm:text-2xl flex-shrink-0">
                  💡
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">
                    {t('orders.help.title')}
                  </h3>
                  <p className="text-sm sm:text-base text-blue-800 mb-3">
                    {t('orders.help.description')}
                  </p>
                  <div className="help-grid text-xs sm:text-sm text-blue-700">
                    <div>
                      <strong>{t('orders.help.trackingTitle')}:</strong>
                      <p>{t('orders.help.trackingDesc')}</p>
                    </div>
                    <div>
                      <strong>{t('orders.help.returnsTitle')}:</strong>
                      <p>{t('orders.help.returnsDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
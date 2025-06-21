import { useTranslation } from 'react-i18next';
import Breadcrumbs from '@/components/common/Breadcrumbs ';
import Container from '@/routes/Container';
import BillingForm from '@/components/Checkout/BillingForm';
import OrderSummary from '@/components/Checkout/OrderSummary';
import { useCheckout } from '@/hooks/useCheckout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Lock } from 'lucide-react';

export default function CheckOut() {
  const { t } = useTranslation();
  const {
    // State from cart
    items,
    subtotal,
    total,
    shipping,
    discount,
    coupon,
    
    // Local state
    billingData,
    paymentMethod,
    couponCode,
    saveInfo,
    loading,
    
    // Actions
    updateBillingData,
    setPaymentMethod,
    setCouponCode,
    setSaveInfo,
    applyCoupon,
    removeCoupon,
    placeOrder
  } = useCheckout();

  // Loading state for the entire checkout process
  if (loading && items.length === 0) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Breadcrumbs />
      
      <div className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6">
              <BillingForm billingData={billingData} onUpdateBillingData={updateBillingData} saveInfo={saveInfo} onSaveInfoChange={setSaveInfo} />
            </div>

            <div className="lg:pl-8">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {t('checkout.orderSummary')}
                </h2>
                
                <OrderSummary
                  items={items}
                  subtotal={subtotal}
                  discount={discount}
                  shipping={shipping}
                  total={total}
                  couponCode={couponCode}
                  setCouponCode={setCouponCode}
                  applyCoupon={applyCoupon}
                  removeCoupon={removeCoupon}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  onPlaceOrder={placeOrder}
                  loading={loading}
                  coupon={coupon}
                />
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500">
                <Lock />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  {t('checkout.security.title')}
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  {t('checkout.security.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
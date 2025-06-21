import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';
import OrderItem from './OrderItem';
import PriceSummary from './PriceSummary';
import CouponSection from './CouponSection';
import PaymentMethods from './PaymentMethods';

const OrderSummary = ({
  items,
  subtotal,
  discount,
  shipping,
  total,
  couponCode,
  setCouponCode,
  applyCoupon,
  removeCoupon,
  paymentMethod,
  setPaymentMethod,
  onPlaceOrder,
  loading,
  coupon
}) => {
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-600 text-center">
          {t('checkout.emptyCart')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>

      <PriceSummary subtotal={subtotal} discount={discount} shipping={shipping} total={total} />

      <PaymentMethods selectedMethod={paymentMethod} onMethodChange={setPaymentMethod} />

      <CouponSection
        couponCode={couponCode}
        onCouponCodeChange={setCouponCode}
        onApplyCoupon={applyCoupon}
        onRemoveCoupon={removeCoupon}
        discount={discount}
        coupon={coupon}
        loading={loading}
      />


      <Button onClick={onPlaceOrder} className="w-full">
        {loading ? t('common.loading') : t('checkout.placeOrder')}
      </Button>
    </div>
  );
};

export default OrderSummary;
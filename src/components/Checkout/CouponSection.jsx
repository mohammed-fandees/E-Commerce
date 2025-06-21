import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';
import FormField from '../Account/FormField';

const CouponSection = ({ couponCode, onCouponCodeChange, onApplyCoupon, onRemoveCoupon,discount,coupon,loading }) => {
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyCoupon();
  };

  const handleRemoveCoupon = () => {
    onRemoveCoupon();
    onCouponCodeChange(''); 
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      {!coupon && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-2 flex-col sm:flex-row gap-4">
            <input type="text" placeholder={t('checkout.coupon.placeholder')} value={couponCode}
              onChange={(e) => onCouponCodeChange(e.target.value)} className="flex-1 w-full p-3 bg-[#F5F5F5] rounded-md focus:outline-none border focus:border-[#db4444] transition-colors" disabled={loading} />
            <Button type="submit">
              {loading ? t('common.loading') : t('checkout.coupon.apply')}
            </Button>
          </div>
        </form>
      )}
      
      {coupon && discount > 0 && (
        <div className="space-y-3 relative">
          <div className="flex lg:items-center lg:flex-row gap-2 justify-between flex-col items-start p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-medium">
                ✓ {t('checkout.coupon.applied')}
              </span>
            </div>
            <div className="flex items-center space-x-3 justify-between lg:justify-start w-full lg:w-fit">
              <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">
                {coupon.code} ({coupon.percentage}% off)
              </span>
              <span className="text-green-600 font-semibold">
                -${discount.toFixed(2)}
              </span>
            </div>
              <Button onClick={handleRemoveCoupon} className="absolute !p-1 w-6 h-6 flex justify-center items-center !rounded-full -top-[10px] -start-[10px]">
                x
              </Button>
          </div>

          <div className="text-center">
            <button onClick={() => handleRemoveCoupon()} className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer">
              {t('checkout.coupon.changeCoupon')}
            </button>
          </div>
        </div>
      )}

      {!coupon && (
        <div className="mt-3">
          <p className="text-xs text-gray-500">
            {t('checkout.coupon.validCoupons')}
          </p>
        </div>
      )}
    </div>
  );
};

export default CouponSection;
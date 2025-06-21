import { useTranslation } from 'react-i18next';

const PriceSummary = ({ subtotal, discount, shipping, total }) => {
  const { t } = useTranslation();

  const summaryItems = [
    {
      label: t('checkout.summary.subtotal'),
      value: `${subtotal.toFixed(2)}`,
      className: 'text-gray-600'
    },
    ...(discount > 0 ? [{
      label: t('checkout.summary.discount'),
      value: `-${discount.toFixed(2)}`,
      className: 'text-green-600'
    }] : []),
    {
      label: t('checkout.summary.shipping'),
      value: shipping === 0 ? t('checkout.summary.free') : `${shipping.toFixed(2)}`,
      className: 'text-gray-600'
    }
  ];

  return (
    <div className="border-t border-gray-200 pt-4 space-y-3">
      {summaryItems.map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className={`text-sm ${item.className}`}>
            {item.label}:
          </span>
          <span className={`text-sm font-medium ${item.className}`}>
            {item.value}
          </span>
        </div>
      ))}
      
      <div className="border-t border-gray-200 pt-3">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-gray-900">
            {t('checkout.summary.total')}:
          </span>
          <span className="text-lg font-bold text-gray-900">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceSummary;
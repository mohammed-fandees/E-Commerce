import { useTranslation } from 'react-i18next';

const PaymentMethods = ({ selectedMethod, onMethodChange }) => {
  const { t } = useTranslation();

  const paymentMethods = [
    {
      id: 'bank',
      label: t('checkout.payment.bank'),
    },
    {
      id: 'cash',
      label: t('checkout.payment.cashOnDelivery'),
    }
  ];

  const cardLogos = [
    { name: 'Visa', src: '/assets/visa.png', alt: 'Visa' },
    { name: 'Mastercard', src: '/assets/master-card.png', alt: 'Mastercard' },
    { name: 'bKash', src: '/assets/bKash.png', alt: 'bKash' },
    { name: 'What?', src: '/assets/what.png', alt: 'what' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        {t('checkout.payment.title')}
      </h3>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className="flex items-center space-x-3  group justify-between"
          >
            <div className='flex items-center gap-2'>
              <input type="radio" name="paymentMethod" value={method.id} checked={selectedMethod === method.id}
                onChange={(e) => onMethodChange(e.target.value)} className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {method.label}
              </span>
            </div>
            {method.label === 'Bank' && (
              <div className="flex space-x-2 gap-2">
                {cardLogos.map((card) => (
                  <div key={card.name}>
                    <img src={card.src} alt={card.alt} className="w-[42px] h-[26px] object-contain" />
                  </div>
                ))}
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
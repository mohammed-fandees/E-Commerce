import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';

const PaymentMethodCard = ({ paymentMethod, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const getCardIcon = (cardType) => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳'
    };
    return icons[cardType] || '💳';
  };

  const formatCardNumber = (lastFour) => {
    return `**** **** **** ${lastFour}`;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-2xl">{getCardIcon(paymentMethod.cardType)}</span>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{paymentMethod.cardType.toUpperCase()}</span>
              {paymentMethod.isDefault && (
                <span className="bg-[#db4444] text-white text-xs px-2 py-1 rounded-full">
                  {t('account.default')}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm">{formatCardNumber(paymentMethod.lastFour)}</p>
            <p className="text-gray-500 text-xs">
              {t('account.expires')} {paymentMethod.expiryDate}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(paymentMethod)} className="text-xs">
            {t('common.edit')}
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(paymentMethod.id)} className="text-xs bg-red-500 hover:bg-red-600 text-white">
            {t('common.delete')}
          </Button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          {paymentMethod.billingAddress.street}, {paymentMethod.billingAddress.city}, {paymentMethod.billingAddress.country}
        </p>
      </div>
    </div>
  );
};

export default PaymentMethodCard;
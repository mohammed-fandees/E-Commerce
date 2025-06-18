import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';
import FormField from './FormField';
import PaymentMethodCard from './PaymentMethodCard';
import Checkbox from '../common/Checkbox';

const PaymentForm = ({
  paymentMethods,
  currentPaymentData,
  errors,
  isLoading,
  isEditing,
  handleChange,
  handleSubmit,
  handleEdit,
  handleDelete,
  resetForm,
  isActive = true
}) => {
  const { t } = useTranslation();

  const cardTypes = [
    { value: 'visa', label: 'Visa' },
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'amex', label: 'American Express' },
    { value: 'discover', label: 'Discover' }
  ];

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'EG', label: 'Egypt' },
  ];

  const cardFields = [
    { name: 'cardNumber', label: t('account.cardNumber'), placeholder: '1234 5678 9012 3456', maxLength: 19 },
    { name: 'expiryDate', label: t('account.expiryDate'), placeholder: 'MM/YY', maxLength: 5 },
    { name: 'cvv', label: t('account.cvv'), placeholder: '123', maxLength: 4 },
  ];

  const billingFields = [
    { name: 'street', label: t('account.streetAddress') },
    { name: 'city', label: t('account.city') },
    { name: 'state', label: t('account.state') },
    { name: 'postalCode', label: t('account.postalCode') },
  ];


  if (!isActive) return null;

  return (
    <div>
      <h2 className="text-xl font-medium text-[#db4444] mb-6 hidden lg:block">
        {t('account.paymentOptions')}
      </h2>

      {/* Existing Payment Methods */}
      {paymentMethods.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">{t('account.savedPaymentMethods')}</h3>
          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <PaymentMethodCard key={method.id} paymentMethod={method} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Payment Method Form */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium mb-4">
          {isEditing ? t('account.editPaymentMethod') : t('account.addPaymentMethod')}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField name="cardholderName" label={t('account.cardholderName')} type="text" value={currentPaymentData.cardholderName} error={errors.cardholderName} onChange={handleChange} />

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t('account.cardType')}
              </label>
              <select name="cardType" value={currentPaymentData.cardType} onChange={handleChange}
                className="w-full p-3 bg-[#F5F5F5] rounded-md focus:outline-none border border-gray-300 focus:border-[#db4444] transition-colors"
              >
                {cardTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cardFields.map(({ name, label, placeholder, maxLength }) => (
              <FormField key={name} name={name} label={label} type="text" value={currentPaymentData[name]} error={errors[name]} onChange={handleChange} placeholder={placeholder} maxLength={maxLength} />
            ))}
          </div>

          {/* Billing Address */}
          <div>
            <h4 className="text-md font-medium mb-4">{t('account.billingAddress')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {billingFields.map(({ name, label }) => (
                <FormField key={name} name={`billingAddress.${name}`} label={label} type="text" value={currentPaymentData.billingAddress[name]} error={errors[`billingAddress.${name}`]} onChange={handleChange} />
              ))}

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {t('account.country')}
                </label>
                <select name="billingAddress.country" value={currentPaymentData.billingAddress.country} onChange={handleChange}
                  className={`w-full p-3 bg-[#F5F5F5] rounded-md focus:outline-none border ${errors['billingAddress.country'] ? 'border-[#db4444]' : 'border-gray-300'
                    } focus:border-[#db4444] transition-colors`}
                >
                  <option value="">{t('account.selectCountry')}</option>
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                {errors['billingAddress.country'] && (
                  <p className="text-[#db4444] text-sm mt-1">{errors['billingAddress.country']}</p>
                )}
              </div>
            </div>
          </div>

          <Checkbox name="isDefault" checked={currentPaymentData.isDefault} onChange={handleChange} label={t("account.setAsDefault")} />

          <div className="flex justify-end gap-4 pt-4 flex-col-reverse sm:flex-row">
            <Button type="button" variant="secondary" className="bg-gray-200 !text-gray-700 hover:bg-gray-300" onClick={resetForm}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}>
              {isLoading ? t('common.saving') : isEditing ? t('account.updatePaymentMethod') : t('account.addPaymentMethod')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
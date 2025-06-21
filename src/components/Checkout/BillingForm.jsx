import { useTranslation } from 'react-i18next';
import FormField from '@/components/Account/FormField';
import Checkbox from '@/components/common/Checkbox';

const BillingForm = ({ billingData, onUpdateBillingData, saveInfo, onSaveInfoChange }) => {
  const { t } = useTranslation();

  const handleInputChange = (field) => (e) => {
    onUpdateBillingData(field, e.target.value);
  };

  const billingFields = [
    {
      id: 'firstName',
      label: t('checkout.billing.firstName'),
      value: billingData.firstName,
      required: true,
      placeholder: t('checkout.billing.firstNamePlaceholder')
    },
    {
      id: 'companyName',
      label: t('checkout.billing.companyName'),
      value: billingData.companyName,
      required: false,
      placeholder: t('checkout.billing.companyNamePlaceholder')
    },
    {
      id: 'streetAddress',
      label: t('checkout.billing.streetAddress'),
      value: billingData.streetAddress,
      required: true,
      placeholder: t('checkout.billing.streetAddressPlaceholder')
    },
    {
      id: 'apartment',
      label: t('checkout.billing.apartment'),
      value: billingData.apartment,
      required: false,
      placeholder: t('checkout.billing.apartmentPlaceholder')
    },
    {
      id: 'townCity',
      label: t('checkout.billing.townCity'),
      value: billingData.townCity,
      required: true,
      placeholder: t('checkout.billing.townCityPlaceholder')
    },
    {
      id: 'phoneNumber',
      label: t('checkout.billing.phoneNumber'),
      value: billingData.phoneNumber,
      required: true,
      type: 'tel',
      placeholder: t('checkout.billing.phoneNumberPlaceholder')
    },
    {
      id: 'emailAddress',
      label: t('checkout.billing.emailAddress'),
      value: billingData.emailAddress,
      required: true,
      type: 'email',
      placeholder: t('checkout.billing.emailAddressPlaceholder')
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {t('checkout.billing.title')}
      </h2>
      
      <div className="space-y-4">
        {billingFields.map((field) => (
          <FormField key={field.id} id={field.id} label={field.label} value={field.value} onChange={handleInputChange(field.id)}
           required={field.required} type={field.type || 'text'} placeholder={field.placeholder} className="w-full" />
        ))}
      </div>

      <Checkbox id="saveInfo" checked={saveInfo} onChange={(e) => onSaveInfoChange(e.target.checked)} label={t('checkout.billing.saveInfo')} className="text-sm" />
    </div>
  );
};

export default BillingForm;
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';
import FormField from './FormField';

const PasswordForm = ({ passwordData, errors, isLoading, handleChange, handleSubmit, isActive = true }) => {
  const { t } = useTranslation();

  const passwordFields = [
    { name: 'currentPassword', label: t('account.currentPassword'), type: 'password' },
    { name: 'newPassword', label: t('account.newPassword'), type: 'password' },
    { name: 'confirmNewPassword', label: t('account.confirmNewPassword'), type: 'password' },
  ];

  if (!isActive) return null;

  return (
    <div>
      <h2 className="text-xl font-medium text-[#db4444] mb-6 hidden lg:block">
        {t('account.changePassword')}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        {passwordFields.map((field) => (
          <FormField key={field.name} {...field} value={passwordData[field.name]} error={errors[field.name]} onChange={handleChange} placeholder={field.label} />
        ))}

        <div className="flex justify-end gap-4 mt-4 flex-col-reverse sm:flex-row">
          <Button type="button" variant="secondary" className="bg-gray-200 !text-gray-700 hover:bg-gray-300" >
            {t('common.cancel')}
          </Button>
          <Button type="submit"  disabled={isLoading} className={isLoading ? 'opacity-50 cursor-not-allowed' : ''} >
            {isLoading ? t('common.saving') : t('account.changePassword')}
          </Button>
        </div>
      </form>
    </div>
  );
};
 
export default PasswordForm;
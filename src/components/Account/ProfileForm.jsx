import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';
import FormField from './FormField';

const ProfileForm = ({ profileData, errors, isLoading, handleChange, handleSubmit, isActive = true }) => {
  const { t } = useTranslation();

  const profileFields = [
    { name: 'firstName', label: t('account.firstName'), type: 'text' },
    { name: 'lastName', label: t('account.lastName'), type: 'text' },
    { name: 'email', label: t('account.email'), type: 'email' },
    { name: 'address', label: t('account.address'), type: 'text' },
  ];

  if (!isActive) return null;

  return (
    <div>
      <h2 className="text-xl font-medium text-[#db4444] mb-6 hidden lg:block">
        {t('account.editProfile')}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileFields.map((field) => (
          <FormField key={field.name} {...field} value={profileData[field.name]} error={errors[field.name]} onChange={handleChange} />
        ))}

        <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4 flex-col-reverse sm:flex-row">
          <Button type="button" variant="secondary" className="bg-gray-200 !text-gray-700 hover:bg-gray-300">
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={isLoading} className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}>
            {isLoading ? t('common.saving') : t('common.saveChanges')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
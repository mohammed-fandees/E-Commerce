import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { changePassword } from '@/services/changePassword';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current Password is required.' }),
  newPassword: z.string().min(6, { message: 'New Password must be at least 6 characters.' }),
  confirmNewPassword: z.string().min(1, { message: 'Confirm New Password is required.' }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'New password and confirmation do not match.',
  path: ['confirmNewPassword'],
});

export const usePasswordForm = () => {
  const { t } = useTranslation();
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      passwordSchema.parse(passwordData);
      setErrors({});
      
      // Call the password change service
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      toast.success(t('account.passwordChanged'));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err) {
      if (err.errors) {
        const newErrors = {};
        err.errors.forEach((error) => {
          if (error.path) {
            newErrors[error.path[0]] = t(`validation.${error.path[0]}.${error.code}`, error.message);
          }
        });
        setErrors(newErrors);
      } else {
        toast.error(err.message || t('account.passwordChangeError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { passwordData, errors, isLoading, handleChange, handleSubmit };
}
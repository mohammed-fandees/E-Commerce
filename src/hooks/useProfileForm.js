import { useState, useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'First Name is required.' }),
  lastName: z.string().min(1, { message: 'Last Name is required.' }),
  email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' }),
  address: z.string().min(1, { message: 'Address is required.' }),
});

export const useProfileForm = (user) => {
  const { t } = useTranslation();
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '', address: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      setProfileData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      profileSchema.parse(profileData);
      setErrors({});
      
      // Here you would call your profile update service
      // await updateProfile(profileData);
      
      toast.success(t('account.profileUpdated'));
    } catch (err) {
      if (err.errors) {
        const newErrors = {};
        err.errors.forEach((error) => {
          if (error.path) {
            newErrors[error.path[0]] = t(`validation.${error.path[0]}.${error.code}`, error.message);
          }
        });
        setErrors(newErrors);
        toast.error(t('account.profileUpdateError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { profileData, errors, isLoading, handleChange, handleSubmit };
};

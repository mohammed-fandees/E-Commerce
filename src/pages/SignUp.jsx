import React, { useState } from 'react';
import { z } from 'zod';
import Wrapper from "../routes/Wrapper";
import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';
import supabase from '@/services/supabase/supabaseClient';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const signupFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Valid email is required.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function Signup() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      signupFormSchema.parse(formData);
      setErrors({});
      setIsSubmitting(true);

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { name: formData.name } },
      });

      if (error) {
        toast.error(t('auth.signup.failed'));
      } else {
        toast.success(t('auth.signup.success'));
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      if (err.errors) {
        const newErrors = {};
        err.errors.forEach((error) => {
          if (error.path) newErrors[error.path[0]] = error.message;
        });
        setErrors(newErrors);
        toast.error(t('auth.signup.fixErrors'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    if (error) toast.error(t('auth.signup.failed'));
  };

  return (
    <Wrapper prevent="user">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-15 items-center">
        <div className="hidden lg:flex justify-center max-h-[750px]">
          <img loading="lazy" src="/assets/auth-page-img.jpg" alt="Signup illustration" className="w-full h-full rounded-e shadow-md object-cover" />
        </div>

        <div className="w-full max-w-[500px] p-4 rounded-lg mx-auto">
          <h1 className="text-4xl font-bold mb-2 inter">{t('auth.signup.title')}</h1>
          <p className="mb-6">{t('auth.signup.subtitle')}</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input type="text" name="name" placeholder={t('auth.signup.name')} value={formData.name} onChange={handleChange} className={`w-full p-3 border-b ${errors.name ? 'border-[#db4444]' : 'border-gray-300'} focus:outline-none focus:border-[#db4444]`} />
              {errors.name && <p className="text-[#db4444] text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <input type="email" name="email" placeholder={t('auth.signup.email')} value={formData.email} onChange={handleChange}
                className={`w-full p-3 border-b ${errors.email ? 'border-[#db4444]' : 'border-gray-300'} focus:outline-none focus:border-[#db4444]`}
              />
              {errors.email && <p className="text-[#db4444] text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mb-6 relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder={t('auth.signup.password')} value={formData.password} onChange={handleChange}
                className={`w-full p-3 border-b ${errors.password ? 'border-[#db4444]' : 'border-gray-300'} focus:outline-none focus:border-[#db4444] pr-10`}
              />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500  outline-0">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-[#db4444] text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex flex-col gap-4 mb-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('auth.signup.creating') : t('auth.signup.button')}
              </Button>
              <button type="button" onClick={handleGoogleSignup} className="px-12 py-4 rounded-sm text-black border border-[#B2B2B2] hover:bg-gray-100  flex gap-3 justify-center">
                <img loading="lazy" src="/assets/Icon-Google.png" alt="google" />
                {t('auth.signup.google')}
              </button>
            </div>
          </form>

          <p className="text-sm text-center">
            {t('auth.signup.alreadyAccount')}
            <a href="/login" className="text-[#db4444] font-medium hover:underline">{t('auth.signup.login')}</a>
          </p>
        </div>
      </div>
    </Wrapper>
  );
}

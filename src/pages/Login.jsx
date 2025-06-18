import React, { useState } from 'react';
import { z } from 'zod';
import Wrapper from "../routes/Wrapper";
import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';
import supabase from '@/services/supabase/supabaseClient';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';

const loginFormSchema = z.object({
  emailOrPhone: z.string().min(1, { message: 'Email or Phone Number is required.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function Login() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
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
      loginFormSchema.parse(formData);
      setErrors({});
      setIsSubmitting(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: formData.emailOrPhone,
        password: formData.password,
      });

      if (error) {
        toast.error(t('auth.login.failed'));
      } else {
        toast.success(t('auth.login.success'))
        setFormData({ emailOrPhone: '', password: '' });
      }
    } catch (err) {
      if (err.errors) {
        const newErrors = {};
        err.errors.forEach((error) => {
          if (error.path) newErrors[error.path[0]] = error.message;
        });
        setErrors(newErrors);
        toast.error(t('auth.login.fixErrors'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin }, });
    if (error) toast.error(t('auth.signup.failed'));
  };


  return (
    <Wrapper prevent="user">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-15 items-center">
        <div className="hidden lg:flex justify-center max-h-[750px]">
          <img
            src="/assets/auth-page-img.jpg"
            alt="Login illustration"
            className="w-full h-full rounded-e shadow-md object-cover"
          />
        </div>

        <div className="w-full max-w-[500px] p-4 rounded-lg mx-auto">
          <h1 className="text-4xl font-bold mb-2 inter">{t('auth.login.title')}</h1>
          <p className="mb-6">{t('auth.login.subtitle')}</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="emailOrPhone" className="sr-only">{t('auth.login.emailOrPhone')}</label>
              <input type="text" id="emailOrPhone" name="emailOrPhone" placeholder={t('auth.login.emailOrPhone')} value={formData.emailOrPhone} onChange={handleChange}
                className={`w-full p-3 border-b ${errors.emailOrPhone ? 'border-[#db4444]' : 'border-gray-300'} focus:outline-none focus:border-[#db4444]`}
              />
              {errors.emailOrPhone && <p className="text-[#db4444] text-sm mt-1">{errors.emailOrPhone}</p>}
            </div>

            <div className="mb-6 relative">
              <label htmlFor="password" className="sr-only">{t('auth.login.password')}</label>
              <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder={t('auth.login.password')} value={formData.password} onChange={handleChange}
                className={`w-full p-3 border-b ${errors.password ? 'border-[#db4444]' : 'border-gray-300'} focus:outline-none focus:border-[#db4444] pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer outline-0"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-[#db4444] text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="mb-4">
              <a href="#" className="text-gray-600 hover:text-[#db4444] text-sm transition duration-300">
                {t('auth.login.forgot')}
              </a>
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('auth.login.loggingIn') : t('auth.login.button')}
              </Button>
              <button type="button" onClick={handleGoogleLogin} className="px-12 py-4 rounded-sm text-black border border-[#B2B2B2] hover:bg-gray-100 cursor-pointer flex gap-3 justify-center">
                <img src="/assets/Icon-Google.png" alt="google" />
                {t('auth.login.google')}
              </button>
            </div>
          </form>
          <p className="text-sm text-center">
            {t('auth.login.haveNoAccount')}
            <Link to="/signup" className="text-[#db4444] font-medium hover:underline">{t('auth.login.signup')}</Link>
          </p>
        </div>
      </div>
    </Wrapper>
  );
}

import React, { useState } from 'react';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import { toast } from 'sonner';

export default function Form() {
  const { t } = useTranslation();

  const formSchema = z.object({
    name: z.string().min(1, { message: t('contact.form.errors.name') }),
    email: z.string().min(1, { message: t('contact.form.errors.email_required') }).email({ message: t('contact.form.errors.email_invalid') }),
    phone: z.string().min(1, { message: t('contact.form.errors.phone_required') }).regex(/^\+?\d{10,15}$/, { message: t('contact.form.errors.phone_invalid') }),
    message: z.string().min(1, { message: t('contact.form.errors.message') }),
  });

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});

  const fields = [
    { name: 'name', type: 'text', placeholder: t('contact.form.name') },
    { name: 'email', type: 'email', placeholder: t('contact.form.email') },
    { name: 'phone', type: 'tel', placeholder: t('contact.form.phone') },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.promise(
      new Promise((resolve, reject) => {
        try {
          formSchema.parse(formData);
          setErrors({});
          setFormData({ name: '', email: '', phone: '', message: '' });
          setTimeout(() => resolve(), 1500);
        } catch (err) {
          const newErrors = {};
          err.errors.forEach(({ path, message }) => {
            if (path) newErrors[path[0]] = message;
          });
          setErrors(newErrors);
          reject();
        }
      }),
      {
        loading: t('contact.form.pending'),
        success: t('contact.form.success'),
        error: t('contact.form.error')
      }
    );
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {fields.map(({ name, type, placeholder }) => (
          <div key={name}>
            <label htmlFor={name} className="sr-only">{placeholder}</label>
            <input type={type} id={name} name={name} placeholder={placeholder} value={formData[name]} onChange={handleChange}
              className={`w-full p-3 bg-[#F5F5F5] ${errors[name] && 'border border-red-500'} rounded-md focus:outline-none`}
            />
            {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="sr-only">{t('contact.form.message')}</label>
        <textarea id="message" name="message" placeholder={t('contact.form.message')} rows="6" value={formData.message} onChange={handleChange}
          className={`w-full p-3 bg-[#F5F5F5] ${errors.message && 'border border-red-500'} rounded-md focus:outline-none resize-y`}
        />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit">{t('contact.form.send')}</Button>
      </div>
    </form>
  );
}

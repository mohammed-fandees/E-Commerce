import { useState, useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const paymentMethodSchema = z.object({
  cardholderName: z.string().min(1, { message: 'Cardholder name is required.' }),
  cardNumber: z.string()
    .min(1, { message: 'Card number is required.' })
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, { message: 'Invalid card number format.' }),
  expiryDate: z.string()
    .min(1, { message: 'Expiry date is required.' })
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Invalid expiry date format (MM/YY).' }),
  cvv: z.string()
    .min(3, { message: 'CVV must be at least 3 digits.' })
    .max(4, { message: 'CVV must be at most 4 digits.' })
    .regex(/^\d+$/, { message: 'CVV must contain only numbers.' }),
  cardType: z.string().min(1, { message: 'Card type is required.' }),
  isDefault: z.boolean().optional(),
  billingAddress: z.object({
    street: z.string().min(1, { message: 'Street address is required.' }),
    city: z.string().min(1, { message: 'City is required.' }),
    state: z.string().min(1, { message: 'State is required.' }),
    postalCode: z.string().min(1, { message: 'Postal code is required.' }),
    country: z.string().min(1, { message: 'Country is required.' }),
  })
});

export const usePaymentForm = (user) => {
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [currentPaymentData, setCurrentPaymentData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardType: 'visa',
    isDefault: false,
    billingAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // Load saved payment methods from user data or API
    if (user?.paymentMethods) {
      setPaymentMethods(user.paymentMethods);
    }
  }, [user]);

  const detectCardType = (cardNumber) => {
    const visaRegex = /^4/;
    const mastercardRegex = /^5[1-5]/;
    const amexRegex = /^3[47]/;
    const discoverRegex = /^6(?:011|5)/;

    if (visaRegex.test(cardNumber)) return 'visa';
    if (mastercardRegex.test(cardNumber)) return 'mastercard';
    if (amexRegex.test(cardNumber)) return 'amex';
    if (discoverRegex.test(cardNumber)) return 'discover';
    return 'visa';
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      const cardType = detectCardType(formattedValue.replace(/\s/g, ''));
      setCurrentPaymentData(prev => ({ 
        ...prev, 
        cardNumber: formattedValue,
        cardType 
      }));
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
      setCurrentPaymentData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
      setCurrentPaymentData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name.startsWith('billingAddress.')) {
      const field = name.split('.')[1];
      setCurrentPaymentData(prev => ({
        ...prev,
        billingAddress: { ...prev.billingAddress, [field]: value }
      }));
    } else {
      const newValue = type === 'checkbox' ? checked : value;
      setCurrentPaymentData(prev => ({ ...prev, [name]: newValue }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      paymentMethodSchema.parse(currentPaymentData);
      setErrors({});

      // If setting as default, remove default from other cards
      let updatedMethods = [...paymentMethods];
      if (currentPaymentData.isDefault) {
        updatedMethods = updatedMethods.map(method => ({ ...method, isDefault: false }));
      }

      if (isEditing) {
        // Update existing payment method
        const index = updatedMethods.findIndex(method => method.id === editingId);
        if (index !== -1) {
          updatedMethods[index] = { ...currentPaymentData, id: editingId };
        }
      } else {
        // Add new payment method
        const newMethod = {
          ...currentPaymentData,
          id: Date.now().toString(),
          lastFour: currentPaymentData.cardNumber.slice(-4)
        };
        updatedMethods.push(newMethod);
      }

      setPaymentMethods(updatedMethods);
      
      // Here you would call your API to save payment methods
      // await savePaymentMethods(updatedMethods);
      
      toast.success(t(isEditing ? 'account.paymentUpdated' : 'account.paymentAdded'));
      resetForm();
    } catch (err) {
      if (err.errors) {
        const newErrors = {};
        err.errors.forEach((error) => {
          const path = error.path.join('.');
          newErrors[path] = t(`validation.${path}.${error.code}`, error.message);
        });
        setErrors(newErrors);
        toast.error(t('account.paymentSaveError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (paymentMethod) => {
    setCurrentPaymentData(paymentMethod);
    setIsEditing(true);
    setEditingId(paymentMethod.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('account.confirmDeletePayment'))) {
      const updatedMethods = paymentMethods.filter(method => method.id !== id);
      setPaymentMethods(updatedMethods);
      
      // Here you would call your API to delete the payment method
      // await deletePaymentMethod(id);
      
      toast.success(t('account.paymentDeleted'));
    }
  };

  const resetForm = () => {
    setCurrentPaymentData({
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardType: 'visa',
      isDefault: false,
      billingAddress: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    });
    setIsEditing(false);
    setEditingId(null);
    setErrors({});
  };

  return {
    paymentMethods,
    currentPaymentData,
    errors,
    isLoading,
    isEditing,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm
  };
};
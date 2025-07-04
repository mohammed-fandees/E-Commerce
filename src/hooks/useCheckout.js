// import { saveOrderToLocalStorage } from '@/utils/orderUtils';
import { useState } from "react";
import { useCart } from "./useCart";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useCheckout = () => {
  const { t } = useTranslation();
  const {
    items,
    subtotal,
    total,
    shipping,
    discount,
    coupon,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [loading, setLoading] = useState(false);

  const [billingData, setBillingData] = useState({
    firstName: "",
    companyName: "",
    streetAddress: "",
    apartment: "",
    townCity: "",
    phoneNumber: "",
    emailAddress: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [couponCode, setCouponCode] = useState(coupon?.code || "");
  const [saveInfo, setSaveInfo] = useState(false);

  const updateBillingData = (field, value) => {
    setBillingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateBillingData = () => {
    const requiredFields = [
      "firstName",
      "streetAddress",
      "townCity",
      "phoneNumber",
      "emailAddress",
    ];
    const missingFields = requiredFields.filter(
      (field) => !billingData[field].trim()
    );

    if (missingFields.length > 0) {
      toast.error(t("checkout.errors.missingFields"));
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(billingData.emailAddress)) {
      toast.error(t("checkout.errors.invalidEmail"));
      return false;
    }

    return true;
  };

  const applyCouponCode = async () => {
    if (!couponCode.trim()) {
      toast.error(t("checkout.errors.emptyCoupon"));
      return;
    }

    setLoading(true);

    try {
      const validCoupons = {
        SAVE10: { code: "SAVE10", percentage: 10 },
        SAVE20: { code: "SAVE20", percentage: 20 },
        WELCOME: { code: "WELCOME", percentage: 15 },
        FIRST20: { code: "FIRST20", percentage: 20 },
      };

      const selectedCoupon = validCoupons[couponCode.toUpperCase()];

      if (selectedCoupon) {
        applyCoupon(selectedCoupon);
        toast.success(
          t("checkout.couponApplied", { code: couponCode.toUpperCase() })
        );
      } else {
        toast.error(t("checkout.errors.invalidCoupon"));
      }
    } catch (error) {
      toast.error(t("checkout.errors.couponError"));
      console.log("Checkout Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (!validateBillingData()) return;
    if (items.length === 0) {
      toast.error(t("checkout.errors.emptyCart"));
      return;
    }
    setLoading(true);
    try {
      // توليد رقم طلب فريد
      const orderNumber = `ORD-${Date.now()}`;
      // تجهيز عناصر الطلب بالحقول الصحيحة
      const orderItems = items.map((item) => ({
        id: item.id,
        title: item.name || item.title,
        img: item.img || item.image,
        price: item.price,
        quantity: item.quantity,
      }));
      // تجهيز بيانات الطلب
      const orderData = {
        orderNumber,
        billing: billingData,
        paymentMethod,
        subtotal,
        discount,
        shipping,
        total,
        coupon: coupon ? { ...coupon } : null,
        saveInfo,
      };
      // استدعاء دالة إنشاء الطلب في Supabase
      await import("@/services/ordersApi").then(({ createOrder }) =>
        createOrder(orderData, orderItems)
      );
      clearCart();
      toast.success(t("checkout.orderSuccess"));
    } catch (error) {
      toast.error(t("checkout.errors.orderFailed"));
      console.error("Order placement error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    // State from cart
    items,
    subtotal,
    total,
    shipping,
    discount: discount || 0,
    coupon,

    // Local state
    billingData,
    paymentMethod,
    couponCode,
    saveInfo,
    loading,

    // Actions
    updateBillingData,
    setPaymentMethod,
    setCouponCode,
    setSaveInfo,
    applyCoupon: applyCouponCode,
    removeCoupon,
    placeOrder,
    validateBillingData,
  };
};

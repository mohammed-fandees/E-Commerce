import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Breadcrumbs from "@/components/common/Breadcrumbs ";
import Container from "@/routes/Container";
import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/Cart/CartItem';
import EmptyCart from '@/components/Cart/EmptyCart';
import { toast } from 'sonner';
import Button from '@/components/common/Button';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCartItem from '@/components/Cart/MobileCartItem';

export default function Cart() {
  const { t } = useTranslation();
  const { items: cartItems, updateQuantity, removeItem, subtotal, total, applyCoupon, shipping, coupon } = useCart();
  const [couponCode, setCouponCode] = useState(coupon?.code || '');
  const isMobile = useIsMobile()

  useEffect(() => {
    setCouponCode(coupon?.code || '');
  }, [coupon?.code]);

  const handleQuantityChange = (id, newQuantity) => updateQuantity(id, newQuantity);
  const handleReturnToShop = () => window.location.href = '/';
  const handleProceedToCheckout = () => window.location.href = '/checkout';
  
  const handleClearCart = () => {
    cartItems.forEach(item => removeItem(item.id));
    toast.success(t("cart.cartCleared"));
  }

  const handleRemoveItem = (id) => {
    removeItem(id)
    toast.success(t("cart.itemRemoved"))
  };

  const handleApplyCoupon = () => {
    console.log("applied")
    if (couponCode.trim()) {
      const validCoupons = {
        'SAVE10': { code: 'SAVE10', percentage: 10 },
        'SAVE20': { code: 'SAVE20', percentage: 20 }
      };

      const coupon = validCoupons[couponCode.toUpperCase()];
      if (coupon) {
        applyCoupon(coupon);
        toast.promise(
          new Promise((resolve) => {
            setTimeout(() => resolve(), 1000);
          }),
          {
            loading: t("cart.updating"),
            success: t("cart.couponApplied", { code: coupon.percentage }),
            error: t("cart.couponError")
          }
        );

      } else {
        toast.success(t("cart.invalidCoupon"));
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container>
        <div className="pt-8 lg:pt-18">
          <Breadcrumbs />
          <EmptyCart onReturnToShop={handleReturnToShop} />
        </div>
      </Container>
    );
  }


  const formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return '0.00';
    return value.toFixed(2);
  };


  return (
    <Container>
      <Breadcrumbs />
      <div className="pb-20">
        <div className="mt-8 bg-white rounded space-y-6">
          {!isMobile && (
            <div className="grid grid-cols-4 gap-4  px-4 py-6 [box-shadow:0px_1px_13px_0px_#0000001A]">
              <span className="text-start font-medium ps-4">{t("cart.product")}</span>
              <span className="text-center font-medium">{t("cart.price")}</span>
              <span className="text-center font-medium">{t("cart.quantity")}</span>
              <span className="text-end font-medium pe-4">{t("cart.subtotal")}</span>
            </div>
          )}

          <div className="space-y-6">
            {cartItems.map(item => (
              isMobile ? <MobileCartItem key={item.id} {...item} onQuantityChange={handleQuantityChange} onRemove={handleRemoveItem} /> :
                <CartItem key={item.id} {...item} onQuantityChange={handleQuantityChange} onRemove={handleRemoveItem} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row justify-between items-center mt-6">
          <button onClick={handleReturnToShop}
            className="w-100 sm:w-fit  px-12 py-4 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {t("cart.returnToShop")}
          </button>
          <button onClick={handleClearCart}
            className="w-100 sm:w-fit  px-12 py-4 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {t("cart.clearCart")}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20 items-start">
          <div className="flex flex-col sm:flex-row gap-4">
            <input type="text" placeholder={t("cart.couponCodePlaceholder")} value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 px-4 py-4 border border-gray-300 rounded text-sm outline-none focus:border-red-500"
            />
            <Button onClick={handleApplyCoupon}>{t("cart.applyCoupon")}</Button>
          </div>

          <div className="border border-gray-300 rounded p-6">
            <h3 className="text-xl font-medium mb-6">{t("cart.cartTotal")}</h3>

            <div className="space-y-4 mb-5">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm">{t("cart.subtotal")}:</span>
                <span className="text-sm font-medium">${formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm">{t("cart.shipping")}:</span>
                <span className="text-sm font-medium">{shipping ? `$${shipping}` : t("cart.free")}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">{t("cart.total")}:</span>
                <span className="text-sm font-medium">${formatCurrency(total)}</span>
              </div>
            </div>

            <Button onClick={handleProceedToCheckout} className="w-full">{t("cart.proceedToCheckout")}</Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
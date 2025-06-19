import { useTranslation } from "react-i18next";
import Button from "@/components/common/Button";

export default function EmptyCart({ onReturnToShop }) {
  const { t } = useTranslation();

  return (
    <div className="text-center py-16">
      <div className="mb-8">
        <div className="w-44 h-44 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-8xl text-gray-400">🛒</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{t('cart.emptyCartTitle')}</h2>
        <p className="text-gray-600 max-w-md mx-auto">{t('cart.emptyCartMessage')}</p>
      </div>
      <Button onClick={onReturnToShop}>{t('cart.returnToShop')}</Button>
    </div>
  );
};

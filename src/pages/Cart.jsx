import Breadcrumbs from "@/components/common/Breadcrumbs ";
import Button from "@/components/common/Button";
import Container from "@/routes/Container";
import { useTranslation } from "react-i18next";

const EmptyCart = ({ onReturnToShop }) => {
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

export default function Cart() {
  return (
    <Container>
      <div className="pt-8 lg:pt:18">
        <Breadcrumbs />
        <EmptyCart />
      </div>
    </Container>
  );
}

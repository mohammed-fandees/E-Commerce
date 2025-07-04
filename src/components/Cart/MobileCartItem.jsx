import { useTranslation } from "react-i18next";

export default function MobileCartItem({ id, img, name, price, quantity, onQuantityChange, onRemove }) {
  const { t } = useTranslation();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      onQuantityChange(id, newQuantity);
    }
  };

  return (
    <div className="cart-item bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <img src={img} alt={name} className="w-20 h-20 object-contain bg-gray-50 rounded border" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
            {name}
          </h3>
          <div className="mb-3">
            <span className="text-lg font-bold text-gray-900">
              $ {price.toLocaleString()}
            </span>
          </div>

          <div className="mb-3">
            <span className="text-sm text-green-700 font-medium">{t("cart.inStock")}</span>
          </div>

          <div className="flex items-center justify-between">

            <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-gray-50">
              <button onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}
                className=" w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg font-medium">−</span>
              </button>

              <div className="w-12 h-8 flex items-center justify-center bg-white border-x border-gray-300">
                <span className="text-sm font-medium">{quantity}</span>
              </div>

              <button onClick={() => handleQuantityChange(quantity + 1)}
                className=" w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg font-medium">+</span>
              </button>
            </div>


            <div className="flex items-center gap-2 text-sm">
              <button onClick={() => onRemove(id)} className="text-[#db4444]  hover:underline font-medium">
                {t("common.delete")}
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-[#db4444]  hover:underline font-medium">
                {t("cart.saveForLater")}
              </button>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t("cart.subtotal")}:</span>
              <span className="text-lg font-bold text-gray-900">
                $ {(price * quantity).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
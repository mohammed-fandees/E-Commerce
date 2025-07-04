export default function CartItem({ id, img, name, price, quantity, onQuantityChange, onRemove }) {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      onQuantityChange(id, newQuantity);
    }
  };

  return (
    <div className="cart-item bg-white rounded shadow p-4 [box-shadow:0px_1px_13px_0px_#0000001A]">
      <div className="flex flex-col sm:grid sm:grid-cols-4 sm:gap-4 sm:items-center">
        <div className="flex items-center gap-4 mb-4 sm:mb-0 ps-4">
          <div className="img relative">
            <img src={img} alt={name} className="w-[70px] h-[70px] object-contain" />
            <button onClick={() => onRemove(id)}
              className="remove-cart-item hidden  absolute top-0 -left-2 items-center justify-center bg-[#db4444] text-white w-6 h-6 rounded-full text-xl" title="Remove">
              ×
            </button>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">{name}</span>
          </div>
        </div>

        <div className="sm:col-span-1 mb-4 sm:mb-0 text-center">
          <span className="text-sm font-medium">${price}</span>
        </div>

        <div className="sm:col-span-1 mb-4 sm:mb-0 flex justify-center">
          <div className="flex items-center border border-gray-300 rounded w-fit sm:mt-2">
            <input type="text" value={quantity.toString().padStart(2, '0')} onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-10 text-center text-sm py-2 outline-none"
            />
            <div className="flex flex-col">
              <button onClick={() => handleQuantityChange(quantity + 1)} className=" px-2 py-1 text-xs hover:bg-gray-100">▲</button>
              <button onClick={() => handleQuantityChange(quantity - 1)} className=" px-2 py-1 text-xs hover:bg-gray-100">▼</button>
            </div>
          </div>
        </div>

        <div className="pe-4 sm:col-span-1 text-sm font-medium flex justify-end items-end">
          ${price * quantity}
        </div>
      </div>
    </div>
  );
}

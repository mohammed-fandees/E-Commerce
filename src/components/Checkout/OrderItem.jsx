const OrderItem = ({ item }) => {
  
  const itemTotal = item.price * item.quantity;
  const itemName = item.name || item.title;
  const itemImage = item.img || item.image;

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img src={itemImage} alt={itemName} className="w-12 h-12 object-cover rounded" onError={(e) => { e.target.src = '/placeholder-product.png'; }} />
          {item.quantity > 1 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {item.quantity}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
            {itemName}
          </h4>
          <p className="text-sm text-gray-500">
            ${item.price} × {item.quantity}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">
          ${itemTotal.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderItem;
import React from "react";

const SearchResultRow = ({ product, categoryLabel, searchQuery, onClick, isLast }) => {
  if (!product) {
    return null;
  }

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? <span key={index} className="bg-yellow-200 font-semibold">{part}</span> : part
    );
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xs ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
    ));
  };

  const handleClick = () => {
    if (onClick && product.id) {
      onClick();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!isLast ? 'border-b border-gray-100' : ''} focus:outline-none focus:bg-gray-50`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Select ${product.title || 'product'}`}
    >
      {/* Product Image */}
      <img
        src={product.img || product.image}
        alt={product.title || 'Product image'}
        className="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0 bg-white"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
        }}
      />
      
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900 mb-1 leading-tight">
          {highlightText(product.title || 'Untitled Product', searchQuery)}
        </div>
        
        {/* Rating and Category */}
        <div className="flex items-center gap-2 mb-1">
          {product.rating && (
            <div className="flex items-center">
              {renderStars(product.rating)}
              {product.reviews && (
                <span className="ml-1 text-xs text-gray-600">({product.reviews})</span>
              )}
            </div>
          )}
          {product.rating && categoryLabel && (
            <span className="text-xs text-gray-400">•</span>
          )}
          {categoryLabel && (
            <span className="text-xs text-gray-600">{categoryLabel}</span>
          )}
        </div>
        
        {/* Price */}
        {product.price && (
          <div className="text-lg font-bold text-[#db4444]">
            ${typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultRow;
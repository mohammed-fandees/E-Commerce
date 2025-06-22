import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const ImageGallery = ({ product, selectedImage, onImageSelect, imageLoading, onImageLoad, discountPercentage }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const images = product.images || [product.img];

  const handleImageError = (e) => {
    e.target.src = '/placeholder-product.png';
  };

  const handlePrevImage = () => {
    const prevIndex = selectedImage > 0 ? selectedImage - 1 : images.length - 1;
    onImageSelect(prevIndex);
  };

  const handleNextImage = () => {
    const nextIndex = selectedImage < images.length - 1 ? selectedImage + 1 : 0;
    onImageSelect(nextIndex);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="order-2 md:order-1  md:flex-shrink-0">
          <div className="flex md:flex-col gap-2 overflow-x-auto  md:overflow-y-auto md:max-h-[500px] pb-2 md:pb-0">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onImageSelect(index)}
                className={`
                  flex-shrink-0 w-20 h-20 border-2 border-transparent rounded-lg overflow-hidden cursor-pointer transition-all duration-200 bg-gray-50
                  hover:border-[#db4444] 
                  ${index === selectedImage ? 'border-[#db4444]' : ''}
                `}
              >
                <img
                  src={image}
                  alt={`${product.title} view ${index + 1}`}
                  className="w-full h-full object-contain"
                  onError={handleImageError}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Image */}
      <div className="order-1 md:order-2 flex-1">
        <div className="relative bg-gray-50 rounded-lg overflow-hidden group">
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-4 left-4 bg-[#db4444] text-white text-sm font-bold px-3 py-1 rounded z-2">
              -{discountPercentage}%
            </div>
          )}

          {/* Zoom Button */}
          <button 
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full transition-colors z-10 opacity-0 group-hover:opacity-100"
          >
            <ZoomIn className="h-5 w-5 text-gray-700" />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors z-10 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors z-10 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div 
            className={`
              relative w-full h-[300px] md:h-[500px] overflow-hidden transition-all duration-300
              ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}
            `}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
          >
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#db4444]"></div>
              </div>
            )}
            <img
              src={images[selectedImage]}
              alt={product.title}
              className={`
                w-full h-full object-contain transition-transform duration-300 bg-gray-50
                ${isZoomed ? 'scale-200' : ''}
              `}
              style={isZoomed ? {
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
              } : {}}
              onLoad={onImageLoad}
              onError={handleImageError}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
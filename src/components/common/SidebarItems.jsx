import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from "../ui/navigation-menu";
import { Link } from "react-router";
import data from "../../data/products.json";
import { ImageOff } from "lucide-react";

const getRandomProducts = (products, count = 3) => {
  if (!products || products.length === 0) return [];
  const shuffled = [...products];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export default function SidebarItems({ items }) {
  const { t } = useTranslation();
  const [openMenus, setOpenMenus] = useState({});
  const [hoveredProducts, setHoveredProducts] = useState({});
  const [imgStatuses, setImgStatuses] = useState({});

  const handleMenuOpen = useCallback((itemIndex, subIndex, sub) => {
    const menuKey = `${itemIndex}-${subIndex}`;
    const allProducts = data.products?.filter(
      (product) => product.category === sub
    ) || [];
    const randomProducts = getRandomProducts(allProducts, 3);
    setOpenMenus(prev => ({
      ...prev,
      [menuKey]: randomProducts
    }));
    setHoveredProducts(prev => ({ ...prev, [menuKey]: null }));
    setImgStatuses(prev => ({ ...prev, [menuKey]: "loading" }));
  }, []);

  const handleProductHover = useCallback((menuKey, productIndex) => {
    if (productIndex !== null) {
      setHoveredProducts(prev => ({ ...prev, [menuKey]: productIndex }));
    }
  }, []);

  const handleImageLoad = useCallback((menuKey) => {
    setImgStatuses(prev => ({ ...prev, [menuKey]: "loaded" }));
  }, []);

  const handleImageError = useCallback((menuKey) => {
    setImgStatuses(prev => ({ ...prev, [menuKey]: "error" }));
  }, []);

  return (
    items?.map((item, itemIndex) => (
      <NavigationMenuItem key={itemIndex}>
        <NavigationMenuTrigger subs={item.subs}>
          {t(item.trigger)}
        </NavigationMenuTrigger>
        {item?.subs?.length > 0 && item.subs.map((sub, subIndex) => {
          const menuKey = `${itemIndex}-${subIndex}`;
          const randomProducts = useMemo(() => {
            if (openMenus[menuKey]) {
              return openMenus[menuKey];
            }
            const allProducts = data.products?.filter(
              (product) => product.category === sub
            ) || [];
            return getRandomProducts(allProducts, 3);
          }, [openMenus[menuKey], sub]);

          const hoveredIdx = hoveredProducts[menuKey];
          const imgStatus = imgStatuses[menuKey] || "loading";
          const mainProduct = hoveredIdx !== null && randomProducts[hoveredIdx]
            ? randomProducts[hoveredIdx]
            : randomProducts[0];

          return (
            <NavigationMenuContent 
              key={subIndex}
              onMouseEnter={() => handleMenuOpen(itemIndex, subIndex, sub)}
              className="border border-red-200/60 shadow-xl rounded-xl bg-white/95 backdrop-blur-sm"
            >
              <ul className="grid gap-3 p-4 md:w-[450px] lg:w-[550px] lg:grid-cols-[1fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="group relative overflow-hidden bg-gradient-to-br from-rose-50 to-red-50 border border-red-200/60 flex h-full w-full flex-col rounded-xl no-underline outline-none select-none hover:shadow-lg hover:border-red-300/80 transition-all duration-300 hover:scale-[1.02]"
                      href={mainProduct?.id ? `/products/${mainProduct.id}` : '#'}
                    >
                      <div className="flex items-center justify-center w-full h-40 bg-white/90 backdrop-blur-sm rounded-t-xl relative overflow-hidden border-b border-red-100/50">
                        {mainProduct?.img && imgStatus !== "error" ? (
                          <img
                            src={mainProduct.img}
                            alt={mainProduct.name}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                            onLoad={() => handleImageLoad(menuKey)}
                            onError={() => handleImageError(menuKey)}
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-50/50 to-rose-50/50">
                            <div className="w-16 h-16 rounded-full bg-red-100/80 flex items-center justify-center mb-2">
                              <ImageOff className="w-8 h-8 text-red-400" />
                            </div>
                            <span className="text-xs text-red-500/70 font-medium">No Image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-red-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      {mainProduct && (
                        <div className="p-4 bg-white/95 backdrop-blur-sm flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-base font-semibold leading-tight mb-2 text-slate-800 group-hover:text-slate-900">
                              {mainProduct.name}
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                              {mainProduct.description || mainProduct.name}
                            </p>
                          </div>
                          {mainProduct.price && (
                            <div className="mt-3 pt-3 border-t border-red-200/40">
                              <span className="text-lg font-bold text-[#db4444]">
                                ${mainProduct.price}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </a>
                  </NavigationMenuLink>
                </li>
                <div className="space-y-2">
                  {randomProducts.length === 0 && (
                    <div className="text-red-500/70 text-sm py-8 text-center bg-red-50/50 rounded-lg border border-red-200/40">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                        <ImageOff className="w-6 h-6 text-red-400" />
                      </div>
                      {t('No products found.')}
                    </div>
                  )}
                  {randomProducts.map((product, prodIdx) => {
                    const isActive = hoveredIdx === prodIdx;
                    return (
                      <ListItem
                        key={`${menuKey}-${product.id || product.name}-${prodIdx}`}
                        href={`/products/${product.id || product.name}`}
                        title={product.name}
                        price={product.price}
                        isActive={isActive}
                        onMouseEnter={() => handleProductHover(menuKey, prodIdx)}
                      >
                        {product.description || product.name}
                      </ListItem>
                    );
                  })}
                </div>
              </ul>
            </NavigationMenuContent>
          );
        })}
      </NavigationMenuItem>
    ))
  );
}

function ListItem({
  title,
  children,
  href,
  price,
  isActive,
  ...props
}) {
  return (
    <div {...props}>
      <NavigationMenuLink asChild>
        <Link 
          to={href}
          className={`group block select-none rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 border-2 ${
            isActive 
              ? 'bg-gradient-to-r from-red-50 to-rose-50 border-[#db4444]/40 shadow-md scale-[1.02] shadow-red-200/50' 
              : 'bg-white/80 hover:bg-red-50/30 border-red-200/40 hover:border-[#db4444]/60 hover:shadow-md hover:shadow-red-200/30'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className={`text-sm leading-tight font-semibold transition-colors ${
              isActive ? 'text-[#db4444]' : 'text-slate-800 group-hover:text-[#db4444]'
            }`}>
              {title}
            </div>
            {price && (
              <span className={`text-sm font-bold ml-2 transition-colors ${
                isActive ? 'text-[#db4444]' : 'text-slate-600 group-hover:text-[#db4444]'
              }`}>
                ${price}
              </span>
            )}
          </div>
          <p className={`line-clamp-2 text-sm leading-relaxed transition-colors ${
            isActive ? 'text-slate-700' : 'text-slate-600 group-hover:text-slate-700'
          }`}>
            {children}
          </p>
          <div className={`mt-3 h-1 rounded-full transition-all duration-300 ${
            isActive ? 'bg-gradient-to-r from-[#db4444] to-red-500' : 'bg-red-200/40 group-hover:bg-[#db4444]/60'
          }`} />
        </Link>
      </NavigationMenuLink>
    </div>
  );
}

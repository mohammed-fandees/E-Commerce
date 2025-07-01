import React from 'react';
import { useTranslation } from 'react-i18next';
import { CATEGORY_LABELS } from '@/data/categoryLabels';
import {
  Smartphone, Monitor, Camera, Gamepad, Watch, Headphones,
  ShoppingBag, Glasses, Shirt, Gem, Bike, Car, Utensils,
  Sofa, Droplet, Sun, ShoppingCart, Tablet, Heart, Footprints,
} from 'lucide-react';
import { Link } from 'react-router';
import { Skeleton } from '@mui/material';

export const iconMap = {
  beauty: <Heart size={50} />,
  // fragrances: <Perfume size={50} />,
  furniture: <Sofa size={50} />,
  groceries: <ShoppingCart size={50} />,
  "home-decoration": <Sun size={50} />,
  "kitchen-accessories": <Utensils size={50} />,
  laptops: <Monitor size={50} />,
  "mens-shirts": <Shirt size={50} />,
  "mens-shoes": <Footprints size={50} />,
  "mens-watches": <Watch size={50} />,
  "mobile-accessories": <Headphones size={50} />,
  motorcycle: <Bike size={50} />,
  "skin-care": <Droplet size={50} />,
  smartphones: <Smartphone size={50} />,
  "sports-accessories": <Gamepad size={50} />,
  sunglasses: <Glasses size={50} />,
  tablets: <Tablet size={50} />,
  tops: <Shirt size={50} />,
  vehicle: <Car size={50} />,
  "womens-bags": <ShoppingBag size={50} />,
  "womens-dresses": <ShoppingBag size={50} />,
  "womens-jewellery": <Gem size={50} />,
  "womens-shoes": <Footprints size={50} />,
  "womens-watches": <Watch size={50} />,
  cameras: <Camera size={50} />,
};

export default function CategoriesGrid({ loading, searchTerm = '', sortBy = 'name', viewMode = 'grid', t, limit }) {
  // t is passed from parent for i18n, fallback to hook if not provided
  const { t: tHook } = useTranslation();
  const translate = t || tHook;
  const items = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    icon: iconMap[key] || <ShoppingBag size={50} />, label: translate(label), key, originalLabel: label
  }));

  // Filter
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.label.localeCompare(b.label);
      case 'popular':
        return Math.random() - 0.5; // Replace with real logic
      case 'newest':
        return Math.random() - 0.5; // Replace with real logic
      case 'count':
        return Math.random() - 0.5; // Replace with real logic
      default:
        return 0;
    }
  });

  const displayItems = typeof limit === 'number' ? sortedItems.slice(0, limit) : sortedItems;
  const gridClass = viewMode === 'grid'
    ? 'grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-6'
    : 'grid grid-cols-1 gap-4';

  return (
    <ul className={`${gridClass} mb-12`}>
      {loading
        ? Array.from({ length: limit || 6 }).map((_, i) => (
          <li key={i}>
            <div className={`border-1 border-[#0000004D] p-4 rounded-sm flex gap-3 items-center justify-center ${viewMode === 'grid' ? 'flex-col h-36' : 'flex-row h-20'} w-full`}>
              <Skeleton variant="circular" width={50} height={50} />
              <Skeleton variant="text" width={80} />
            </div>
          </li>
        ))
        : displayItems.map((item) => (
          <li key={item.key}>
            <Link
              to={`/categories/${item.key}`}
              className={`border-1 hover:border-0 hover:bg-[#DB4444] hover:text-white transition-[background-color, color, border-color] duration-200 border-[#0000004D] p-4 rounded-sm cursor-pointer flex gap-3 items-center shrink-0 w-full hover:shadow-lg ${viewMode === 'grid'
                  ? 'flex-col justify-center h-36'
                  : 'flex-row justify-start h-20'
                }`}
            >
              <div className={viewMode === 'list' ? 'flex-shrink-0' : ''}>
                {React.cloneElement(item.icon, { size: viewMode === 'list' ? 40 : 50 })}
              </div>
              <span className={`${viewMode === 'list' ? 'text-left flex-1' : 'text-center'} font-medium`}>
                {item.label}
              </span>
            </Link>
          </li>
        ))}
    </ul>
  );
}

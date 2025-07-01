import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { iconMap } from "@/components/common/CategoriesGrid";

const FeaturedCategories = ({ t }) => {
  const featuredCategories = [
    { id: 1, name: t("categories.featured_items.electronics"), key: "smartphones", count: 245, trending: true, gradient: "from-blue-500 to-purple-600" },
    { id: 2, name: t("categories.featured_items.fashion"), key: "womens-dresses", count: 189, trending: true, gradient: "from-pink-500 to-rose-600" },
    { id: 3, name: t("categories.featured_items.home"), key: "furniture", count: 167, trending: false, gradient: "from-green-500 to-teal-600" },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t("categories.featured")}</h2>
        <div className="flex items-center text-sm text-gray-600">
          <TrendingUp className="w-4 h-4 me-1 text-[#db4444]" />
          {t("categories.trending_now")}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredCategories.map((category) => (
          <Link key={category.id} to={`/categories/${category.key}`} className="relative group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg h-48">
              <div className={`w-full h-full bg-gradient-to-br ${category.gradient} group-hover:scale-105 transition-transform duration-300 flex items-center justify-center`}>
                {iconMap[category.key] && React.cloneElement(iconMap[category.key], { size: 80, className: "text-white opacity-20" })}
              </div>
              <div className="absolute inset-0 bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
              {category.trending && (
                <div className="absolute top-3 right-3 bg-[#db4444] text-white px-2 py-1 rounded-full text-xs font-medium">
                  {t("categories.trending")}
                </div>
              )}
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                <p className="text-sm opacity-90">{category.count} {t("categories.items")}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCategories;

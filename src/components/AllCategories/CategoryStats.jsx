import React from "react";
import { Skeleton } from "@mui/material";
import { Grid, Star, TrendingUp } from "lucide-react";
import data from "@/data/products.json";

const CategoryStats = ({ t, totalCategories, loading }) => {
  const stats = [
    { label: t("categories.stats.total_categories"), value: loading ? <Skeleton width={50} className='mx-auto' /> : totalCategories.toString(), icon: Grid },
    { label: t("categories.stats.total_products"), value: loading ? <Skeleton width={50} className='mx-auto' /> : data.products.length, icon: Star },
    { label: t("categories.stats.new_this_week"), value: loading ? <Skeleton width={50} className='mx-auto' /> : "15", icon: TrendingUp },
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#db4444] bg-opacity-10 rounded-lg mb-4">
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryStats;

import React from "react";

const PopularTags = ({ t, onTagClick }) => {
  const tags = [
    { name: t("tags.electronics"), count: 89, key: "smartphones" },
    { name: t("tags.fashion"), count: 67, key: "womens-dresses" },
    { name: t("tags.home_garden"), count: 54, key: "furniture" },
    { name: t("tags.sports"), count: 43, key: "sports-accessories" },
    { name: t("tags.beauty"), count: 38, key: "beauty" },
    { name: t("tags.automotive"), count: 28, key: "vehicle" },
    { name: t("tags.accessories"), count: 25, key: "mobile-accessories" },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{t("categories.popular_tags")}</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <button
            key={index}
            onClick={() => onTagClick(tag.key)}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-[#db4444] hover:text-white transition-colors duration-200 cursor-pointer"
          >
            {tag.name}
            <span className="ms-1 text-xs opacity-75">({tag.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;

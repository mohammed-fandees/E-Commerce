import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const SearchInput = ({ className = "", inputClassName = "", isRTL = false, ...props }) => {
  const { t } = useTranslation();
  return (
    <div className={`search flex ${isRTL ? "flex-row-reverse" : ""} bg-[#F5F5F5] rounded-md overflow-hidden items-center pr-4 ${className}`}>
      <input
        type="text"
        placeholder={t("header.searchPlaceholder")}
        className={`px-4 py-2 bg-[#F5F5F5] outline-0 ${inputClassName}`}
        {...props}
      />
      {props.onSearchClick ? (
        <button className="cursor-pointer p-1 hover:bg-gray-200 rounded" aria-label="Search" onClick={props.onSearchClick}>
          <Search className="w-5 h-5" />
        </button>
      ) : (
        <Search />
      )}
    </div>
  );
};

export default SearchInput;

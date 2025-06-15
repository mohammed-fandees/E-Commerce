import { Heart, Search, ShoppingCart, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage } from "../../utils/change-lang";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";


export default function MobileHeader() {
  const { t } = useTranslation();
  const isRTL = getCurrentLanguage() == "ar";
  const isMobile = useIsMobile();
  const { isOpened, setIsOpened } = useState(false);

  return (
    <header className="p-4 max-h-[120px]  border-b-1 border-[rgba(0, 0, 0, 1)] sticky top-0 bg-white z-10">
      <div className="flex justify-between items-center container mx-auto lg:px-4 max-w-[1440px]">
        <div className="flex gap-3">
          {isMobile && <button className="cursor-pointer" onClick={() => setIsOpened(!isOpened)}><Menu /></button>}
          <h1 className="text-2xl font-bold">{t("header.title")}</h1>
        </div>
        <div className="flex space-x-6 items-center">
          <Link to="/wishlist"><Heart className="cursor-pointer" /></Link>
          <Link to="/cart"><ShoppingCart className="cursor-pointer" /></Link>
        </div>
      </div>
      <div className="flex items-center space-x-6 mt-5">
        <div className={`search flex ${isRTL && "flex-row-reverse"} bg-[#F5F5F5] rounded-md overflow-hidden items-center pr-4 w-full`}>
          <input type="text" placeholder={t("header.searchPlaceholder")} className="px-4 py-2 bg-[#F5F5F5] outline-0 w-full" />
          <button className="cursor-pointer"><Search /></button>
        </div>
      </div>
    </header>
  );
}
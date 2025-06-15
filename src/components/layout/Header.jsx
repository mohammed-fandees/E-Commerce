import { Heart, Search, ShoppingCart } from "lucide-react";
import Navbar from "./common/Navbar";
import Account from "./common/Account";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage } from "../../utils/change-lang";
import { Link } from "react-router-dom";


export default function Header({ navLinks }) {
  const { t } = useTranslation();
  const isRTL = getCurrentLanguage() == "ar";

  return (
    <header className="p-4 max-h-[70px] mt-6 border-b-1 border-[rgba(0, 0, 0, 1)] sticky top-0 bg-white z-10">
      <div className="flex justify-between items-center container mx-auto px-4 max-w-[1440px]">
        <h1 className="text-2xl font-bold">{t("header.title")}</h1>
        <Navbar links={navLinks} />
        <div className="flex items-center space-x-6">
          <div className={`search flex ${isRTL && "flex-row-reverse"} bg-[#F5F5F5] rounded-md overflow-hidden items-center pr-4`}>
            <input type="text" placeholder={t("header.searchPlaceholder")} className="px-4 py-2 bg-[#F5F5F5] outline-0" />
            <Search />
          </div>
          <Link to="/wishlist"><Heart className="cursor-pointer" /></Link>
          <Link to="/cart"><ShoppingCart className="cursor-pointer" /></Link>
          <Account />
        </div>
      </div>
    </header>
  );
}
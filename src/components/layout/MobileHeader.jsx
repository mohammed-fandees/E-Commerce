import { Heart, Search, ShoppingCart, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage } from "../../utils/change-lang";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import MobileSidebar from "./MobileSidebar";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";

export default function MobileHeader({ navLinks }) {
  const { t } = useTranslation();
  const isRTL = getCurrentLanguage() === "ar";
  const isMobile = useIsMobile();
  const [isOpened, setIsOpened] = useState(false);
  const { getWishlistCount } = useWishlist();
  const { itemCount } = useCart();
  const handleSidebarToggle = () => setIsOpened(!isOpened);
  const handleSidebarClose = () => setIsOpened(false);

  return (
    <>
      <header className="p-4 max-h-[120px] border-b-1 border-[rgba(0, 0, 0, 1)] sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center container mx-auto lg:px-4 max-w-[1440px]">
          <div className="flex gap-3 items-center">
            {isMobile && (
              <button className="cursor-pointer p-1 hover:bg-gray-100 rounded" onClick={handleSidebarToggle} aria-label="Toggle menu" >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-2xl font-bold">{t("header.title")}</h1>
          </div>

          <div className={`flex space-x-6 items-center ${isRTL && 'flex-row-reverse space-x-reverse'}`}>
            <Link to="/wishlist" className="relative">
              {getWishlistCount() ?
                <p className="absolute text-sm bg-[#db4444] w-fit p-1 h-4 rounded-full text-white flex items-center justify-center -top-1 -end-1">{getWishlistCount()}</p>
                : ""}
              <Heart className="cursor-pointer" />
            </Link>
            <Link to="/cart" className="relative">
              {itemCount ?
                <p className="absolute text-sm bg-[#db4444] w-fit p-1 h-4 rounded-full text-white flex items-center justify-center -top-1 -end-1">{itemCount}</p>
                : ""}
              <ShoppingCart className="cursor-pointer" />
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-6 mt-5">
          <div className={`search flex ${isRTL && "flex-row-reverse"} bg-[#F5F5F5] rounded-md overflow-hidden items-center pr-4 w-full`}>
            <input type="text" placeholder={t("header.searchPlaceholder")} className="px-4 py-2 bg-[#F5F5F5] outline-0 w-full" />
            <button className="cursor-pointer p-1 hover:bg-gray-200 rounded" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileSidebar isOpen={isOpened} onClose={handleSidebarClose} navLinks={navLinks} />
    </>
  );
}
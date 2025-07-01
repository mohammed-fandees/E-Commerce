import { Heart, ShoppingCart } from "lucide-react";
import SearchInput from "../common/SearchInput";
import Navbar from "./common/Navbar";
import Account from "./common/Account";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage } from "../../utils/change-lang";
import { Link } from "react-router-dom";
import Container from "@/routes/Container";
import { useContext } from "react";
import { SessionContext } from "@/store/SessionContext";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";


export default function Header({ navLinks }) {
  const { t } = useTranslation();
  const isRTL = getCurrentLanguage() == "ar";
  const { session } = useContext(SessionContext);
  const { itemCount } = useCart();
  const { getWishlistCount } = useWishlist();

  return (
    <header className="p-4 max-h-[70px] mt-6 border-b-1 border-[rgba(0, 0, 0, 1)] sticky top-0 bg-white z-10">
      <Container>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("header.title")}</h1>
          <Navbar links={navLinks} />
          <div className="flex items-center space-x-6">
            <SearchInput isRTL={isRTL} />
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
            {session && <Account />}
          </div>
        </div>
      </Container>
    </header>
  );
}
import { Heart, Search, ShoppingCart } from "lucide-react";
import Navbar from "./common/Navbar";
import Account from "./common/Account";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage } from "../../utils/change-lang";
import { Link } from "react-router-dom";
import Container from "@/routes/Container";
import { useContext } from "react";
import { SessionContext } from "@/store/SessionContext";
import { useCart } from "@/hooks/useCart";


export default function Header({ navLinks }) {
  const { t } = useTranslation();
  const isRTL = getCurrentLanguage() == "ar";
  const { session } = useContext(SessionContext);
  const { itemCount } = useCart();

  return (
    <header className="p-4 max-h-[70px] mt-6 border-b-1 border-[rgba(0, 0, 0, 1)] sticky top-0 bg-white z-10">
      <Container>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("header.title")}</h1>
          <Navbar links={navLinks} />
          <div className="flex items-center space-x-6">
            <div className={`search flex ${isRTL && "flex-row-reverse"} bg-[#F5F5F5] rounded-md overflow-hidden items-center pr-4`}>
              <input type="text" placeholder={t("header.searchPlaceholder")} className="px-4 py-2 bg-[#F5F5F5] outline-0" />
              <Search />
            </div>
            <Link to="/wishlist"><Heart className="cursor-pointer" /></Link>
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
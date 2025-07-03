import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CATEGORY_LABELS } from "@/data/categoryLabels";
import { useProductTitle } from '@/hooks/useProductTitle';

export default function Breadcrumbs() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const pathnames = location.pathname.split("/").filter((x) => x);

  // Detect if last part is a product id (number) after /products
  let productId = null;
  if (pathnames.length >= 2 && pathnames[pathnames.length - 2] === "products" && /^\d+$/.test(pathnames[pathnames.length - 1])) {
    productId = pathnames[pathnames.length - 1];
  }
  const productTitle = useProductTitle(productId);

  const translationMap = {
    about: "pages.about",
    account: "pages.account",
    cart: "pages.cart",
    checkout: "pages.checkout",
    home: "pages.home",
    wishlist: "pages.wishlist",
    contact: "pages.contact",
    login: "pages.login",
    signup: "pages.signup",
    dashboard: "pages.dashboard",
    profile: "pages.profile",
    settings: "pages.settings",
    orders: "pages.orders",
    products: "pages.products",
    category: "pages.category",
    categories: "pages.categories",
    ...CATEGORY_LABELS
  };

  return (
    <nav className="text-sm text-gray-600 pb-4 pt-18" dir={i18n.dir()}>
      <ol className="flex items-center space-x-1 rtl:space-x-reverse">
        <li>
          <Link to="/" className="hover:underline text-gray-500">{t("pages.home")}</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          let translatedName = t(translationMap[name]) || decodeURIComponent(name);
          // If this is the product id, show product title
          if (productId && name === productId && productTitle) {
            translatedName = productTitle;
          }
          return (
            <li key={name} className="flex items-center space-x-1 rtl:space-x-reverse">
              <span className="mx-1">{isRTL ? "\\" : "/"}</span>
              {isLast ? (
                <span className="text-black font-medium">{translatedName}</span>
              ) : (
                <Link to={routeTo} className="hover:underline text-gray-500">{translatedName}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

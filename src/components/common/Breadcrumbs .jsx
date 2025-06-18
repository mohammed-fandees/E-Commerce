import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Breadcrumbs() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const pathnames = location.pathname.split("/").filter((x) => x);

  const translationMap = {
    about: t("pages.about"),
    account: t("pages.account"),
    cart: t("pages.cart"),
    checkout: t("pages.checkout"),
    home: t("pages.home"),
    wishlist: t("pages.wishlist"),
    contact: t("pages.contact"),
    login: t("pages.login"),
    signup: t("pages.signup"),
    dashboard: t("pages.dashboard"),
    profile: t("pages.profile"),
    settings: t("pages.settings"),
  };

  return (
    <nav className="text-sm text-gray-600 my-4" dir={i18n.dir()}>
      <ol className="flex items-center space-x-1 rtl:space-x-reverse">
        <li>
          <Link to="/" className="hover:underline text-gray-500">{t("pages.home")}</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const translatedName = translationMap[name] || decodeURIComponent(name);

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

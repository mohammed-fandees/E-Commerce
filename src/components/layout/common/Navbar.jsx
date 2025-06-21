import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ links }) {
  const { t } = useTranslation();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav>
      <ul className="flex space-x-8">
        {links?.map((link, index) => (
          <li key={index}>
            <Link to={link.path}
              className={`transition-colors duration-200 px-3 py-1 rounded-md ${isActive(link.path) ? "bg-red-100 text-red-600 font-semibold" : "hover:bg-red-50 text-gray-700"}`}
            >
              {t(link.label)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

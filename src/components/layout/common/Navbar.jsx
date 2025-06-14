import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Navbar({ links }) {
  const { t } = useTranslation();

  return (
    <nav>
      <ul className="flex space-x-8">
        {links?.map((link, index) => (
          <li key={index}><Link to={link.path} className="hover:underline">{t(link.label)}</Link></li>
        ))}
      </ul>
    </nav>
  )
}

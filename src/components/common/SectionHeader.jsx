import { useTranslation } from "react-i18next"
import Button from "./Button";
import Navigation from "./Navigation";
import { getCurrentLanguage } from "@/utils/change-lang";
import { Link } from "react-router";
export default function SectionHeader({ title, description, action, customBtn, children }) {
  const { t } = useTranslation();
  const isRTL = getCurrentLanguage() == "ar";
  return (
    <div className="mb-10 relative">
      {title && (
        <div className="flex gap-3 h-10 items-center mb-4">
          <div className="bg-[#DB4444] w-5 h-10 rounded-sm"></div>
          <span className="text-[#DB4444] font-semibold">{title}</span>
        </div>
      )}
      <div className="flex justify-between">
        <div className="flex gap-25 items-center">
          <h2 className="font-semibold text-2xl sm:text-4xl">{description}</h2>
          {children}
        </div>
        {action == "navigation" ? (
          <div className={`flex gap-2 ${isRTL && "flex-row-reverse"}`}>
            <Navigation />
          </div>
        ) : action == "view" ? (
          <Link to="/products">
            <Button className={customBtn}>{t("common.viewAll")}</Button>
          </Link>
        ) : ""}
      </div>
    </div>
  )
}

import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DropdownMenuItems from "./common/DropdownMenuItems";
import { changeLanguage, getCurrentLanguage } from "../../utils/change-lang";
import { useIsMobile } from "@/hooks/use-mobile";
import Container from "@/routes/Container";

export default function Banner() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const isRTL = getCurrentLanguage() == "ar";

  const items = [
    { text: "banner.menu.en", func: function () { changeLanguage("en") } },
    { text: "banner.menu.ar", func: function () { changeLanguage("ar") } },
  ];

  return (
    <div className="bg-black text-white">
      <Container>
        <div className="max-w-[1280px] h-12 flex items-center justify-center">
          <h2 className="w-[100%] text-center space-x-4 text-sm md:text-[16px]">
            <span>{t("banner.text")}</span>
            <Link to="/wishlist" className="underline font-[600]">
              {t("common.shopNow")}
            </Link>
          </h2>
          {!isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex gap-2  outline-0">
                {isRTL ? t("banner.menu.ar") : t("banner.menu.en")}
                <ChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuItems items={items} />
            </DropdownMenu>
          )}
        </div>
      </Container>
    </div>
  )
}
import { getCurrentLanguage } from "@/utils/change-lang";
import { DropdownMenuContent, DropdownMenuItem } from "../../ui/dropdown-menu";
import { useTranslation } from 'react-i18next';

export default function DropdownMenuItems({ items, iconsMap }) {
  const { t } = useTranslation();
  const isRTL = getCurrentLanguage() == "ar";

  return (
    <DropdownMenuContent className="space-y-1.5">
      {items?.map((item, index) => {
        const IconComponent = iconsMap && iconsMap[item.icon];
        return (
          <DropdownMenuItem key={index} onClick={() => {
            item.func && item.func()
          }} className={isRTL && "flex-row-reverse"}>
            {item?.icon && <IconComponent />}
            {t(item.text)}
          </DropdownMenuItem>
        )
      })}
    </DropdownMenuContent>
  );
}
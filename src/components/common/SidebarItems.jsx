import { useTranslation } from "react-i18next";
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from "../ui/navigation-menu";

export default function SidebarItems({ items }) {
  const { t } = useTranslation();
  return (
    items?.map((item, index) => {
      return (
        <NavigationMenuItem key={index}>
          <NavigationMenuTrigger subs={item.subs}>{t(item.trigger)}</NavigationMenuTrigger>
          {item?.subs?.length > 0 && item.subs.map((sub, index) => (
            <NavigationMenuContent key={index}>
              <NavigationMenuLink>{sub}</NavigationMenuLink>
            </NavigationMenuContent>
          ))}
        </NavigationMenuItem>
      )
    })
  );
}
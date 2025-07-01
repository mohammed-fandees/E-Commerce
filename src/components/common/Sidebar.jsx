
import { NavigationMenu, NavigationMenuList } from "../ui/navigation-menu";
import SidebarItems from "./SidebarItems";

export default function Sidebar({ className }) {  
  const items = [
    {trigger: "sidebar.one", subs: ["womens-dresses"]},
    {trigger: "sidebar.two", subs: ["mens-shirts"]},
    {trigger: "sidebar.three", subs: ["smartphones"]},
    {trigger: "sidebar.four", subs: ["furniture"]},
    {trigger: "sidebar.five", subs: ["sunglasses"]},
    {trigger: "sidebar.six", subs: ["sports-accessories"]},
    {trigger: "sidebar.seven", subs: ["laptops"]},
    {trigger: "sidebar.eight", subs: ["groceries"]},
    {trigger: "sidebar.nine", subs: ["beauty"]},
  ];
  return (
    <aside className={`bg-white max-w-[250px] border-e-1 ${className}`}>
      <NavigationMenu>
        <NavigationMenuList>
          <SidebarItems items={items} />
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
}
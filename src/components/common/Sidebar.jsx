
import { NavigationMenu, NavigationMenuList } from "../ui/navigation-menu";
import SidebarItems from "./SidebarItems";

export default function Sidebar({ className }) {  
  const items = [
    {trigger: "sidebar.one", subs: [1, 2]},
    {trigger: "sidebar.two", subs: [1, 2]},
    {trigger: "sidebar.three"},
    {trigger: "sidebar.four"},
    {trigger: "sidebar.five"},
    {trigger: "sidebar.six"},
    {trigger: "sidebar.seven"},
    {trigger: "sidebar.eight"},
    {trigger: "sidebar.nine"},
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
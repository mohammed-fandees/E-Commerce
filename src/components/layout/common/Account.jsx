import { User } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import DropdownMenuItems from "./DropdownMenuItems";
import { User as UserIcon, ShoppingBag, CircleX, Star, LogOut } from "lucide-react";
import supabase from "../../../services/supabase/supabaseClient";
import { useNavigate } from "react-router";


export default function Account() {

  const Navigate = useNavigate();

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error);
    }
  }

  const items = [
    { text: "header.menu.manage", icon: "User", func: function () { Navigate("/account") } },
    { text: "header.menu.order", icon: "ShoppingBag", func: function () { console.log("HI from function") } },
    { text: "header.menu.cancellations", icon: "CircleX", func: function () { console.log("HI from function") } },
    { text: "header.menu.reviews", icon: "Star", func: function () { console.log("HI from function") } },
    { text: "header.menu.logout", icon: "LogOut", func: signOut },
  ];  

  const iconsMap = { User, ShoppingBag, CircleX, Star, LogOut };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-2 cursor-pointer outline-0">
        <div className="rounded-full  p-1 cursor-pointer" onClick={open}>
          <UserIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuItems items={items} iconsMap={iconsMap} />
    </DropdownMenu>
  );
}
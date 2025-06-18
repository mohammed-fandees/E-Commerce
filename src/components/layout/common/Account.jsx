import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import DropdownMenuItems from "./DropdownMenuItems";
import { User as UserIcon, ShoppingBag, CircleX, Star, LogOut } from "lucide-react";
import supabase from "@/services/supabase/supabaseClient";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export default function Account() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const { t } = useTranslation();

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Sign out failed. Please try again.");
      throw new Error(error.message);
    } else {
      toast.success(t("auth.signout"));
      navigate("/");
    }
  }

  const items = [
    { text: "header.menu.manage", icon: "User", func: () => navigate("/account") },
    { text: "header.menu.order", icon: "ShoppingBag", func: () => console.log("HI from function") },
    { text: "header.menu.cancellations", icon: "CircleX", func: () => console.log("HI from function") },
    { text: "header.menu.reviews", icon: "Star", func: () => console.log("HI from function") },
    { text: "header.menu.logout", icon: "LogOut", func: signOut },
  ];

  const iconsMap = { User, ShoppingBag, CircleX, Star, LogOut };

  useEffect(() => {
    const fetchUserAvatar = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (!error && user) {
        const avatarUrl = user.user_metadata?.avatar_url || null;
        setAvatar(avatarUrl);
      }
    };

    fetchUserAvatar();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-2 cursor-pointer outline-0">
        <div className="rounded-full w-10 h-10 flex justify-center items-center overflow-hidden border p-[2px] bg-white">
          {avatar ? (
            <img loading="lazy" src={avatar} alt="User Avatar" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <UserIcon />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuItems items={items} iconsMap={iconsMap} />
    </DropdownMenu>
  );
}

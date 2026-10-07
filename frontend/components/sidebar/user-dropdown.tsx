"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuButton } from "../ui/sidebar";
import { ChevronDown, LogOut } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import LoadingSpinner from "../loading-spinner";
import axios from "axios";
import { useRouter } from "next/navigation";

const UserDropdown = () => {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  const handleLogout = async () => {
    await axios.delete("/api/auth/logout");
    router.push("/auth/signin");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<SidebarMenuButton />}>
        {loading ? <LoadingSpinner /> : (user?.username ?? "User")}

        <ChevronDown className="ml-auto" />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;

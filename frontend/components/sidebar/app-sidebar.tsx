import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { Fish, Map, PersonStanding } from "lucide-react";
import UserDropdown from "./user-dropdown";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={"/"}>
          <SidebarMenuButton>
            <Fish /> <span>Fish Bud</span>
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={"/map"}>
              {" "}
              <SidebarMenuButton>
                <Map />
                <span>Map</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href={"/profile"}>
              {" "}
              <SidebarMenuButton>
                <PersonStanding />
                <span>Profile</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserDropdown />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

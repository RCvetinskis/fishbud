import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import {
  ChartColumn,
  ChartNoAxesColumn,
  Cloudy,
  Fish,
  Map,
  PersonStanding,
  TentTree,
  TrendingUp,
} from "lucide-react";
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
            <SidebarMenuButton>
              <ChartColumn />
              <span>Statistics</span>
            </SidebarMenuButton>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton href={"/statistics"}>
                  <ChartNoAxesColumn />
                  Stats
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              <SidebarMenuSubItem>
                <SidebarMenuSubButton href={"/statistics/weather_statistics"}>
                  <Cloudy />
                  Weather Stats
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              <SidebarMenuSubItem>
                <SidebarMenuSubButton href={"/statistics/top_catches"}>
                  <TrendingUp />
                  Top Catches
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              <SidebarMenuSubItem>
                <SidebarMenuSubButton href={"/statistics/top_fishing_trips"}>
                  <TentTree />
                  Top Fishing Trips
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href={"/profile"}>
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

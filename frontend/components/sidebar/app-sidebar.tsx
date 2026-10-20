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
  FishingHook,
  Map,
  PersonStanding,
  TentTree,
  TrendingUp,
} from "lucide-react";
import UserDropdown from "./user-dropdown";

export function AppSidebar() {
  const menuItems = [
    {
      label: "Map",
      icon: <Map />,
      href: "/map",
    },
    {
      label: "Statistics",
      icon: <ChartColumn />,
      subItems: [
        {
          label: "Stats",
          icon: <ChartNoAxesColumn className="sidebar-icon" />,
          href: "/statistics",
        },
        {
          label: "Weather Stats",
          icon: <Cloudy className="sidebar-icon" />,
          href: "/statistics/weather_statistics",
        },
        {
          label: "Top Catches",
          icon: <TrendingUp className="sidebar-icon" />,
          href: "/statistics/top_catches",
        },
        {
          label: "Top Fishing Trips",
          icon: <TentTree className="sidebar-icon" />,
          href: "/statistics/top_fishing_trips",
        },
        {
          label: "Lure Statistics",
          icon: <FishingHook className="sidebar-icon" />,
          href: "/statistics/lure_statistics",
        },
      ],
    },
    {
      label: "Profile",
      icon: <PersonStanding className="sidebar-icon" />,
      href: "/profile",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenuButton render={<Link href="/" />}>
          <Fish />
          <span>Fish Bud</span>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              {item.href ? (
                <SidebarMenuButton render={<Link href={item.href} />}>
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton>
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              )}

              {item.subItems && (
                <SidebarMenuSub>
                  {item.subItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.href}>
                      <SidebarMenuSubButton
                        render={<Link href={subItem.href} />}
                      >
                        {subItem.icon}
                        <span>{subItem.label}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
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

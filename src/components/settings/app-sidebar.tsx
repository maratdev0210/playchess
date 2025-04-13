import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { SETTINGS } from "../../types/settings";
import { Settings } from "lucide-react";

interface ISidebarData {
  username: string;
  //setSettingsInterface: React.Dispatch<React.SetStateAction<number>>;
}

export function AppSidebar({ username }: ISidebarData) {
  return (
    <Sidebar className="top-16 !h-[calc(100svh-32)]">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex justify-between text-sm leading-tight">
                <span className="truncate font-semibold">
                  <Settings />
                </span>
                <span className="truncate text-lg font-semibold px-2">
                  {username}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {SETTINGS.map((option, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="text-lg">
              {option.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {option.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <span className="cursor-pointer">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

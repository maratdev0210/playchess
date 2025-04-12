"use client";

import getFriendsList from "@/app/actions/getFriendsList";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Settings, UsersRound } from "lucide-react";
import { useAppSelector } from "@/lib/state/hooks";
import { selectSessionData } from "@/lib/state/features/session/sessionSlice";
import { Plus, Minus } from "lucide-react";

export function AppSidebar({ id }: { id: number }) {
  const [friendsList, setFriendsList] = useState<number[] | undefined>([]);
  const sessionData = useAppSelector(selectSessionData);

  useEffect(() => {
    const retrieveFriendsList = async () => {
      console.log(sessionData);
      const result = await getFriendsList(id);

      setFriendsList(result);
    };

    retrieveFriendsList();
  }, []);

  return (
    <Sidebar className="top-16 !h-[calc(100svh-32)]">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Playchess</span>
                  <span className="truncate text-xs">Live server</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    Settings
                    <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                    <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    Friends
                    <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                    <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {friendsList?.length ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {friendsList.map((friend, index) => {
                        return (
                          <SidebarMenuSubItem key={index}>
                            <SidebarMenuSubButton asChild>
                              <span className="text-sm">{friend}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

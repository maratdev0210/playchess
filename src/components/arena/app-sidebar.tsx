"use client";

import getFriendsList from "@/app/actions/getFriendsList";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Settings, UsersRound, Swords } from "lucide-react";
import { Plus, Minus } from "lucide-react";
import getFriendsListByName from "@/app/actions/getFriendsListByName";
import Link from "next/link";
import { socket } from "../../socket";

// define the type returned by calling the getFriendsListName function
interface IFriendsList {
  username: string;
}

// object representing the invitation for the game
// { to: request to the user with whom you want to play}
interface Invitation {
  from: number;
  to: string;
}

export function AppSidebar({ id }: { id: number }) {
  const [friendsListName, setFriendslistName] = useState<
    IFriendsList[] | undefined
  >([]);

  useEffect(() => {
    const retrieveFriendsList = async () => {
      const friendsListById = await getFriendsList(id);
      const friendsListByName = await getFriendsListByName(friendsListById);

      setFriendslistName(friendsListByName);
    };

    retrieveFriendsList();
  }, []);

  const handleClick = (friendName: string) => {
    console.log("clicked");
    const invitation: Invitation = {
      from: id,
      to: friendName,
    };
    socket.emit("invitation", invitation);
  };

  socket.on("replyToInvitation", (reply) => {
    console.log("Reply to invitation: " + reply);
  });

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
                    <Settings />
                    <Link href="/profile/settings">Settings</Link>
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
                    <UsersRound />
                    Friends
                    <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                    <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {friendsListName?.length ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {friendsListName.map((friend, index) => {
                        return (
                          <SidebarMenuSubItem key={index}>
                            <SidebarMenuSubButton asChild>
                              <div className="flex justify-between">
                                <Link href={`/arena/${friend.username}`}>
                                  <span className="text-sm cursor-pointer hover:text-blue-500 hover:transition hover:duration-300">
                                    {friend.username}
                                  </span>
                                </Link>
                                <Swords
                                  onClick={() => handleClick(friend.username)}
                                  className="cursor-pointer"
                                />
                              </div>
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

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
import { Settings, UsersRound, Swords, LogOut } from "lucide-react";
import { Plus, Minus } from "lucide-react";
import getFriendsListByName from "@/app/actions/getFriendsListByName";
import Link from "next/link";
import { socket } from "../../socket";
import {
  selectPlayersData,
  setInvitedPlayerData,
  setInviterPlayerData,
} from "@/lib/state/features/players/playersSlice";
import { useAppDispatch } from "@/lib/state/hooks";
import { useAppSelector } from "@/lib/state/hooks";
import getUserData from "@/app/actions/getUserData";
import { logout } from "@/app/actions/auth";

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
  const [friendsList, setFriendsList] = useState<number[] | undefined>([]);
  const [invitationReply, setInvitationReply] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const playersData = useAppSelector(selectPlayersData);

  useEffect(() => {
    const retrieveFriendsList = async () => {
      const friendsListById = await getFriendsList(id);
      const friendsListByName = await getFriendsListByName(friendsListById);
      const inviterPlayer = await getUserData(id);

      setFriendslistName(friendsListByName);
      setFriendsList(friendsListById);

      dispatch(
        setInviterPlayerData({ id: id, username: inviterPlayer.username })
      );
    };

    retrieveFriendsList();
  }, []);

  // socket disconnection after receiving the user's response
  useEffect(() => {
    if (invitationReply !== null) {
      if (invitationReply === "accepted") {
        console.log("new game starting..");
        console.log(playersData);
      }
    }

    return () => {
      socket.disconnect();
    };
  }, [invitationReply]);

  const handleLogout = async () => {
    const result = await logout();
    console.log(result);
  };

  const handleInvitationClick = (friendName: string, friendId: number) => {
    console.log("clicked");
    dispatch(setInvitedPlayerData({ id: friendId, username: friendName }));
    const invitation: Invitation = {
      from: id,
      to: friendName,
    };
    socket.emit("invitation", invitation);
  };

  socket.on("replyToInvitation", (reply) => {
    setInvitationReply(reply);
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
                                  onClick={() =>
                                    handleInvitationClick(
                                      friend.username,
                                      friendsList[index]
                                    )
                                  }
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
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton onClick={() => handleLogout()}>
                    <LogOut className="hover:cursor-pointer" />
                    <span className="hover:cursor-pointer">Log out</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

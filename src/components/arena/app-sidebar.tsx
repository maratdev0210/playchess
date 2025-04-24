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
  setInvitedPlayerData,
} from "@/lib/state/features/players/playersSlice";
import { useAppDispatch } from "@/lib/state/hooks";
import getUserData from "@/app/actions/getUserData";
import { logout } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import gamesCount from "@/app/actions/gamesCount";
import createGame from "@/app/actions/createGame";
import Invitation from "@/app/ui/arena/Invitation";

// define the type returned by calling the getFriendsListName function
interface IFriendsList {
  username: string;
}

// object representing the invitation for the game
// { to: request to the user with whom you want to play}
interface IInvitation {
  from: string | null;
  to: string;
  time: number;
}

export function AppSidebar({ id }: { id: number }) {
  const [friendsListName, setFriendslistName] = useState<
    IFriendsList[] | undefined
  >([]);
  const [friendsList, setFriendsList] = useState<number[] | undefined>([]);
  const [invitationReply, setInvitationReply] = useState<string | null>(null);
  const [inviterUsername, setInviterUsername] = useState<string>("");
  const [invitedPlayerId, setInvitedPlayerId] = useState<number>(0);
  const [invitedPlayerUsername, setInvitedPlayerUsername] =
    useState<string>("");
  const dispatch = useAppDispatch();
  const [isInvitationOpen, setIsInvitationOpen] = useState<boolean>(false);
  const [opponent, setOpponent] = useState<string>(""); // who do we invite for a game
  const [opponentId, setOpponentId] = useState<number>(0);
  const [timeControl, setTimeControl] = useState<number>(0);
  const [isInvited, setIsInvited] = useState<boolean>(false);

  useEffect(() => {
    const retrieveFriendsList = async () => {
      const friendsListById = await getFriendsList(id);
      const friendsListByName = await getFriendsListByName(friendsListById);
      const inviterPlayer = await getUserData(id);

      setFriendslistName(friendsListByName);
      setFriendsList(friendsListById);
      setInviterUsername(inviterPlayer.username);
    };

    retrieveFriendsList();
  }, []);

  useEffect(() => {
    const createNewGame = async () => {
      if (invitationReply !== null) {
        if (invitationReply === "accepted") {
          dispatch(
            setInvitedPlayerData({
              id: invitedPlayerId,
              username: invitedPlayerUsername,
            })
          );
          const gameId = await gamesCount();
          const newGame = await createGame(
            inviterUsername,
            invitedPlayerUsername,
            timeControl,
            String(gameId)
          );
          console.log(newGame);
          redirect(`/play/${String(gameId)}`);
        }
      }
    };

    createNewGame();
  }, [invitationReply]);

  const handleLogout = async () => {
    await logout();
  };

  const handleInvitationClick = (friendName: string, friendId: number) => {
    setOpponent(friendName);
    setOpponentId(friendId);
    setIsInvitationOpen(true);
  };

  useEffect(() => {
    socket.on("replyToInvitation", (reply) => {
      setInvitationReply(reply.answer);
    });
  });

  useEffect(() => {
    if (isInvited) {
      const inviteFriend = async () => {
        setInvitedPlayerId(opponentId);
        setInvitedPlayerUsername(opponent);

        const invitation: IInvitation = {
          from: inviterUsername,
          to: opponent,
          time: timeControl,
        };
        socket.emit("invitation", invitation);
      };
      setIsInvited(false);

      inviteFriend();
    }
  }, [isInvited]);

  return (
    <>
      <Invitation
        isOpen={isInvitationOpen}
        setIsOpen={setIsInvitationOpen}
        opponent={opponent}
        setTimeControl={setTimeControl}
        setIsInvited={setIsInvited}
      />

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
    </>
  );
}

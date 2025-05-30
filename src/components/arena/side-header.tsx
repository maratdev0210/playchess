"use client";

import { SidebarIcon, Mail, Check, X } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";
import { ReactNode } from "react";
import { socket } from "../../socket";
import getUserData from "@/app/actions/getUserData";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/lib/state/hooks";
import {
  setInvitedPlayerData,
  setInviterPlayerData,
} from "@/lib/state/features/players/playersSlice";
import { redirect } from "next/navigation";
import gamesCount from "@/app/actions/gamesCount";

interface InvitationData {
  from: string;
  to: string;
}

export function SideHeader({
  children,
  id,
}: {
  children: ReactNode;
  id: number;
}) {
  const { toggleSidebar } = useSidebar();
  const [invitation, setInvitation] = useState<InvitationData>([]);
  const [isInvited, setIsInvited] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on("invitation", (invitation) => {
      setInvitation(invitation);
      setIsInvited(true);
      console.log(id);
      console.log(username);
      dispatch(
        setInvitedPlayerData({
          id: id,
          username: username,
        })
      );
      dispatch(
        setInviterPlayerData({
          id: 0,
          username: invitation.from,
        })
      );
    });
  }, []);

  useEffect(() => {
    const retrieveUserData = async () => {
      const result = await getUserData(id);
      setUsername(result.username);
    };

    retrieveUserData();
  });

  const acceptInvite = async () => {
    socket.emit("replyToInvitation", {
      to: invitation.from,
      answer: "accepted",
    });
    const gameId = await gamesCount();
    redirect(`/play/${String(gameId)}`);
  };

  const declineInvite = () => {
    socket.emit("replyToInvitation", {
      to: invitation.from,
      answer: "declined",
    });
  };

  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex justify-between h-16 w-full items-center gap-2 px-4">
        <div className="flex items-center gap-2">
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <SidebarIcon />
          </Button>
          <Separator orientation="vertical" className="mr-2 h-4" />
          {children}
        </div>
        <div className="mr-8">
          <DropdownMenu>
            <DropdownMenuTrigger className="relative">
              {isInvited && (
                <span className="absolute rounded-full border-4 border-red-500 inline-block z-100 translate-x-full"></span>
              )}
              <Mail className="cursor-pointer hover:transition hover:scale-105 hover:duration-300" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                {isInvited ? (
                  <div className="flex flex-col gap-1">
                    <span>
                      {invitation.from} has invited you to play a game
                    </span>
                    <div className="flex gap-2 justify-start">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={acceptInvite}
                      >
                        <Check className="size-6 text-green-600 cursor-pointer hover:transition hover:duration-300 hover:scale-105 hover:saturate-125" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={declineInvite}
                      >
                        <X className="size-6 text-red-600 cursor-pointer hover:duration-300 hover:transition hover:scale-105 hover:saturate-125" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <span>You don't have any new notifications</span>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

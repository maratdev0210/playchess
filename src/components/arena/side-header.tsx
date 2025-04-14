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

export function SideHeader({ children }: { children: ReactNode }) {
  const { toggleSidebar } = useSidebar();
  const [inviterId, setInviterId] = useState<number | null>(null);
  const [inviterUsername, setInviterUsername] = useState<string | null>(null);
  const [isInvited, setIsInvited] = useState<boolean>(false);

  useEffect(() => {
    const retrieveInviterData = async () => {
      if (inviterId !== null) {
        const result = await getUserData(inviterId); // retrieve the username of the person who has invited you for a game
        setInviterUsername(result.username);
      }
    };

    retrieveInviterData();
  });

  useEffect(() => {
    socket.on("invitation", (invitation) => {
      setInviterId(invitation.from);
      setIsInvited(true);
      console.log("You were invited by: " + invitation.from);
    });
  });

  const acceptInvite = () => {
    socket.emit("replyToInvitation", "accepted");
  };

  const declineInvite = () => {
    socket.emit("replyToInvitation", "declined");
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
                      {inviterUsername} has invited you to play a game
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

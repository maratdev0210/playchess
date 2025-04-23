// Invitation modal
// contains the time control in which you want to play

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import TimeControl from "./TimeControl";
import React from "react";

interface IInvitation {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  opponent: string;
  setTimeControl: React.Dispatch<React.SetStateAction<number>>;
  setIsInvited: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Invitation({
  isOpen,
  setIsOpen,
  opponent,
  setTimeControl,
  setIsInvited,
}: IInvitation) {

  const handleInvitation = () => {
    setIsOpen(false);
    setIsInvited(true);
  }
 
  return (
    <>
      <div>
        <div className="absolute -translate-y-1/2 -translate-x-1/2 top-1/3 left-1/2">
          <Popover open={isOpen} onOpenChange={() => !isOpen}>
            <PopoverTrigger></PopoverTrigger>
            <PopoverContent className="h-80 w-120 flex justify-between flex-col">
              <div>
                Invite <span className="font-semibold">{opponent}</span> for a
                game!
                <div className="mt-8">
                  <TimeControl setTimeControl={setTimeControl} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  className="bg-white text-black shadow-md cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleInvitation()}
                  className="bg-black text-white shadow-md cursor-pointer"
                >
                  Invite
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
}

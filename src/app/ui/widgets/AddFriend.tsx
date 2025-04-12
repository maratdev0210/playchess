"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Check } from "lucide-react";
import addFriend from "@/app/actions/addFriend";
import { useState } from "react";

interface IAddFriend {
  friendsList: number[] | undefined;
  userId: number;
  friendId: number;
}

export default function AddFriend({
  friendsList,
  userId,
  friendId,
}: IAddFriend) {
  const [isFriendAdded, setIsFriendAddded] = useState<boolean>(false);

  const handleAddFriend = () => {
    addFriend(userId, friendId);
    setIsFriendAddded(true);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {friendsList?.includes(friendId) || isFriendAdded ? (
              <span className="text-neutral-500 text-sm">Friend</span>
            ) : (
              <Plus
                onClick={() => handleAddFriend()}
                className="text-blue-500 cursor-pointer"
              />
            )}
          </TooltipTrigger>
          <TooltipContent>
            {friendsList?.includes(friendId) || isFriendAdded ? (
              <span>You are friends!</span>
            ) : (
              <span className="hover:transition hover:duration-300 hover:scale-105">
                Add a friend
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

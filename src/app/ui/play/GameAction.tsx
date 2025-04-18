// Game action confirmation dialog
// Example: Confirm that you want to resign, or confirm that you want to offer a draw

"use client";

import { GAME_ACTIONS, IGameActionResponse } from "@/types/play";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

interface IGameActions {
  type: string; // draw or resign
  showGameAction: boolean;
  setShowGameAction: React.Dispatch<React.SetStateAction<boolean>>;
  setGameActionResponse: React.Dispatch<
    React.SetStateAction<IGameActionResponse | null>
  >; // did the player confirmed his actions or not?
  setGameActionType: React.Dispatch<React.SetStateAction<string>>;
}

export default function GameAction({
  type,
  showGameAction,
  setShowGameAction,
  setGameActionResponse,
  setGameActionType,
}: IGameActions) {
  const handleConfirm = () => {
    setGameActionResponse({ type: type, response: "confirmed" });
    setGameActionType("");
  };

  const handleDecline = () => {
    setGameActionResponse({ type: type, response: "declined" });
    setGameActionType("");
  };
  return (
    <>
      <AlertDialog
        open={showGameAction}
        onOpenChange={() => setShowGameAction(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{GAME_ACTIONS[type]}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <span onClick={handleDecline}>Decline</span>
            </AlertDialogCancel>
            <AlertDialogAction>
              <span onClick={handleConfirm}>Confirm</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

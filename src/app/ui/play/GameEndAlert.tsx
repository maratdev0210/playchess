"use client";

// Show the Message on game end

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

interface IGameEndAlert {
  text: string; // "E.g. White won by checkmate"
  showMessage: boolean;
  setShowMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GameEndAlert({
  text,
  showMessage,
  setShowMessage,
  setPlayAgain,
}: IGameEndAlert) {
  return (
    <>
      <AlertDialog
        open={showMessage}
        onOpenChange={() => setShowMessage(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <span onClick={() => setPlayAgain(true)}>Play again</span>
            </AlertDialogCancel>
            <AlertDialogAction>Go back</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

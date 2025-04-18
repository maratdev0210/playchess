// Manually show the game end alert
// based on players' actions

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface IManualGameEndAlert {
  text: string;
  showGameEndALert: boolean;
  setShowGameEndAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ManualGameEndAlert({
  text,
  showGameEndALert,
  setShowGameEndAlert,
}: IManualGameEndAlert) {
  return (
    <>
      <AlertDialog
        open={showGameEndALert}
        onOpenChange={() => setShowGameEndAlert(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Link href="/arena">
                <span>Go back to Arena</span>
              </Link>
            </AlertDialogCancel>
            <AlertDialogAction>
              <span>Review the game</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

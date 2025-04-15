// Client-side of chess game

"use client";

import { useAppSelector, useAppDispatch } from "@/lib/state/hooks";
import {
  selectPlayersData,
  setInvitedPlayerData,
  setInviterPlayerData,
} from "@/lib/state/features/players/playersSlice";
import getUserData from "@/app/actions/getUserData";
import createGame from "@/app/actions/createGame";
import { useEffect, useState } from "react";

export default function Play({ id }: { id: number }) {
  const playersData = useAppSelector(selectPlayersData);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  console.log(playersData);

  useEffect(() => {
    setLoading(true);
    const retreiverUserData = async () => {
      const result = await getUserData(id);
      if (result !== null) {
        if (playersData.inviter === null) {
          dispatch(
            setInviterPlayerData({
              id: id,
              username: result?.username,
            })
          );
        } else {
          dispatch(
            setInvitedPlayerData({
              id: id,
              username: result.username,
            })
          );
        }
      }
    };

    retreiverUserData();
    setLoading(false);
  }, []);

  useEffect(() => {
    const createNewGame = async () => {
      if (
        playersData.inviter !== null &&
        playersData.invited !== null &&
        !loading
      ) {
        const result = await createGame(
          playersData.inviter.username,
          playersData.invited.username
        );
        console.log("New game has been created");
        console.log(result);
      }
    };

    createNewGame();
  }, [loading]);

  console.log(playersData);

  return (
    <>
      <h1>Play component</h1>
    </>
  );
}

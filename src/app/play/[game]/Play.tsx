// Client-side of chess game

"use client";

import getUserData from "@/app/actions/getUserData";
import getGameData from "@/app/actions/getGameData";
import { useEffect, useState } from "react";

export default function Play({ gameId }: { gameId: string }) {
  useEffect(() => {
    const retrieveGameData = async () => {
      const gameData = await getGameData(gameId);
      console.log(gameData);
    };

    retrieveGameData();
  });
  return (
    <>
      <h1>Play component</h1>
    </>
  );
}

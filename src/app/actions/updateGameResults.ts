// update the game results after either the resignation by one of the players or a draw

"use server";

import prisma from "@/lib/prisma";

interface IGameEndResult {
  result: string; // '1/2-1/2' if draw, '1-0', or '0-1' depending on who won
  gameId: string;
}

export default async function updateGameEndResults(
  result: string,
  gameId: string
) {
  const updatedGameResults = await prisma.game.update({
    where: {
      gameId: gameId,
    },
    data: {
      isActive: false, // game is now only available for reviews
      result: result,
    },
  });

  return updatedGameResults;
}

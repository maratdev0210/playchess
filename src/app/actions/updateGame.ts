// update the game on board change

"use server";

import prisma from "@/lib/prisma";
import { JsonArray } from "@prisma/client/runtime/library";

export default async function updateGame(gameId: string, moves: JsonArray) {
  const updatedGame = prisma.game.update({
    where: {
      gameId: gameId,
    },
    data: {
      moves: moves,
    },
  });

  return updatedGame;
}

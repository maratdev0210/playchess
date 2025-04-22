// update the game clocks after each move

"use server";

import prisma from "@/lib/prisma";

// for which side to update the clock
export default async function updateClocks(gameId: string, side: string | null, time: number) {
  if (side === "w") {
    return prisma.game.update({
      where: {
        gameId: gameId,
      },
      data: {
        whiteTime: time,
      },
    });
  }

  // update the time for black
  return prisma.game.update({
    where: {
      gameId: gameId,
    },
    data: {
      blackTime: time,
    },
  });
}

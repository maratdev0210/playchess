"use server";

import prisma from "@/lib/prisma";

export default async function getGameData(gameId: string) {
  return await prisma.game.findUnique({
    where: {
      gameId: gameId,
    },
  });
}

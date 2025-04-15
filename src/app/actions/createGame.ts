// setting the inital game state

"use server";

import prisma from "@/lib/prisma";

export default async function createGame(white: string, black: string) {
  const newGame = await prisma.game.create({
    data: {
      white: white,
      black: black,
      moves: {},
      result: "",
      isActive: true,
    },
  });

  return newGame;
}

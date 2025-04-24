// setting the inital game state

"use server";

import prisma from "@/lib/prisma";

export default async function createGame(
  white: string,
  black: string,
  time: number,
  gameId: string
) {
  try {
    const newGame = await prisma.game.create({
      data: {
        white: white,
        black: black,
        gameId: gameId,
        moves: {},
        result: "",
        isActive: true,
        whiteTime: time,
        blackTime: time,
      },
    });

    return newGame;
  } catch (error) {
    console.log(error);
  }
}

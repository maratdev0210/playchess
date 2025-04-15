// keeps the track of how many games are stored in the table to generate a new game id

"use server";

import prisma from "@/lib/prisma";

export default async function gamesCount() {
  return (await prisma.game.count()) + 1;
}

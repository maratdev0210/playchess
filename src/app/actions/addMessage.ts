"use server";

import prisma from "@/lib/prisma";
import { JsonArray } from "@prisma/client/runtime/library";

export default async function addMessage(gameId: string, messages: JsonArray) {
  const addedMessages = prisma.game.update({
    where: {
      gameId: gameId,
    },
    data: {
      messages: messages,
    },
  });

  return addedMessages;
}

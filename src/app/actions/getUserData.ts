"use server";

import prisma from "@/lib/prisma";

export default async function getUserData(id: number) {
  const userData = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return userData;
}

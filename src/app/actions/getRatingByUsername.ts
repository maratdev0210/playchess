"use server";

import prisma from "@/lib/prisma";

export default async function getRatingByUsername(username: string) {
  return await prisma.user.findUnique({
    where: {
      username: username,
    },
    omit: {
      password: true,
    },
  });
}

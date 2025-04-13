// get list of friends of a given user
"use server";

import prisma from "@/lib/prisma";

export default async function getFriendsList(id: number) {
  const friendsList = await prisma.user.findUnique({
    where: {
      id: id,
    },
    omit: {
      password: true,
      username: true,
    },
  });

  return friendsList?.friends;
}

"use server";

import prisma from "@/lib/prisma";

export default async function getFriendsListByName(
  friendsList: number[] | undefined
) {
  if (friendsList === undefined) {
    return;
  }

  const friendsListName = await prisma.user.findMany({
    where: {
      id: { in: friendsList },
    },
    omit: {
      password: true,
      id: true,
      friends: true,
    },
  });

  return friendsListName;
}

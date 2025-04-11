// Adding friend functionality
"use server";

import prisma from "@/lib/prisma";

export default async function addFriend(userId: number, friendId: number) {
  if (userId === friendId) {
    return;
  }
  const userUpdate = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      friends: {
        push: friendId,
      },
    },
  });
  console.log(userUpdate);
  return userUpdate;
}

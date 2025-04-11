// Search functionality for finding the list of users by a given searh string
"use server";

import prisma from "@/lib/prisma";

export default async function searchByUsername(searchParams: string) {
  // e.g. searchParams = 'word' -> might return 'word2' 'wordword', etc.
  searchParams = searchParams.toLowerCase().trim();
  const result = await prisma.user.findMany({
    where: {
      username: {
        contains: searchParams,
      },
    },
    omit: {
      password: true,
    },
  });

  return result;
}

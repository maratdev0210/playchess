"use server";

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";

interface IFormData {
  username: string;
  password: string;
}

export async function signup(formData: IFormData) {
  const { username, password } = formData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return {
      message: "Username already exists!",
    };
  }
  const newUser = await prisma.user.create({
    data: { username, password: hashedPassword },
  });

  await createSession(newUser.id);
  return newUser;
}

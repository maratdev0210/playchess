"use server";

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

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

export async function login(formData: IFormData) {
  const { username, password } = formData;

  const userExist = await prisma.user.findUnique({
    where: { username },
  });

  if (!userExist) {
    return {
      message: "Incorrect username or password!",
    };
  }

  bcrypt.compare(password, userExist.password, (error, res) => {
    if (error) {
      console.error("Incorrect username or password!");
      return;
    }

    if (res) {
      return;
    } else {
      return {
        message: "Incorrect username or password!",
      };
    }
  });

  await createSession(userExist.id);
  return userExist;
}

export async function redirectLayer() {
  redirect("/");
}

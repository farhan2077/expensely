"use server";

import { cookies } from "next/headers";

import { lucia } from "@/libs/auth";
import { User } from "@/db/schema/users";
import { hashPassword, getUserByEmail } from "@/app/actions/auth";
import { Response } from "@/libs/types";

export async function verifyPassword(user: User, password: string) {
  const salt = user.salt;
  const savedPassword = user.hash;

  if (!salt || !savedPassword) {
    return false;
  }

  const hash = await hashPassword(password, salt);

  return user.hash == hash;
}

export async function signinUser(email: string, password: string) {
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return null;
  }

  const isPasswordCorrect = await verifyPassword(existingUser, password);

  if (!isPasswordCorrect) {
    return null;
  }

  return existingUser;
}

export async function signinAction(
  email: string,
  password: string
): Promise<Response> {
  try {
    const user = await signinUser(email, password);

    if (!user) {
      return {
        success: false,
        message: "User could not log in",
        data: null,
      };
    }

    const session = await lucia.createSession(user.id.toString(), {
      // email: user.email as string,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      message: "User logged in",
      data: user.id,
    };
  } catch (err) {
    return {
      success: false,
      message: "User could not log in",
      data: null,
    };
  }
}

"use server";

import { randomBytes } from "crypto";
import { cookies } from "next/headers";

import { db } from "@/db";
import { usersTable } from "@/db/schema/users";
import { lucia } from "@/libs/auth";
import { hashPassword, getUserByEmail } from "@/app/actions/auth";
import { Response } from "@/libs/types";

export async function createUser(
  name: string,
  email: string,
  password: string
) {
  const salt = randomBytes(128).toString("base64");
  const hash = await hashPassword(password, salt);

  const [user] = await db
    .insert(usersTable)
    .values({
      name: name,
      email: email,
      hash: hash,
      salt: salt,
    })
    .returning();

  return user;
}

export async function signupAction(
  name: string,
  email: string,
  password: string
): Promise<Response> {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
        data: null,
      };
    }

    const user = await createUser(name, email, password);
    if (!user) {
      return {
        success: false,
        message: "User could not be created",
        data: null,
      };
    }

    const session = await lucia.createSession(user.id.toString(), {
      // add other relevant fields mentioned in `lin/auth` DatabaseSessionAttributes type
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      message: "User created successfully",
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: "User could not be created",
      data: null,
    };
  }
}

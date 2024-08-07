"use server";

import { cache } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { pbkdf2 } from "crypto";
import { eq } from "drizzle-orm";
import { type Cookie } from "lucia";

import { db } from "@/db";
import { usersTable } from "@/db/schema/users";

import { lucia } from "@/libs/auth";

type ValidUser = {
  id: string;
};

type ValidSession = {
  id: string;
  userId: string;
  expiresAt: Date; // in Session expiresAt is of type number because DrizzleSQLiteAdapter requires so
  fresh: boolean;
};

type ValidatedSessionType =
  | { user: ValidUser; session: ValidSession }
  | { user: null; session: null };

const ITERATIONS = 100000;

export async function hashPassword(plainTextPassword: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    pbkdf2(
      plainTextPassword,
      salt,
      ITERATIONS,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      }
    );
  });
}

export async function getUserByEmail(email: string) {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });
  return user;
}

/**
 * Validates the current session by reading the session ID from cookies.
 * If the session ID is valid, retrieves the associated user and session information.
 * Returns null values if the session ID is invalid or the user/session cannot be validated.
 */
export const validateSession = cache(
  async (): Promise<ValidatedSessionType> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const { user, session } = await lucia.validateSession(sessionId);

    // 👇 IMPORTANT 👇
    try {
      if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {
      // nextjs throws error when attempting to set cookies when rendering page
    }
    // 👆 IMPORTANT 👆

    if (!session || !user) {
      return {
        user: null,
        session: null,
      };
    }

    return {
      user: user,
      session: session,
    };
  }
);

export async function signoutAction() {
  const { session } = await validateSession();
  if (!session) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie: Cookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect("/sign-in");
}

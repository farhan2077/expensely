"use server";

import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { resetTokensTable } from "@/db/schema";

const TOKEN_TTL = 1000 * 60 * 10; // 10 min

export async function generateRandomToken(length: number) {
  const buf = await new Promise<Buffer>((resolve, reject) => {
    randomBytes(Math.ceil(length / 2), (err, buf) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });

  return buf.toString("hex").slice(0, length);
}

export async function createPasswordResetToken(userId: string) {
  const token = await generateRandomToken(32);
  const expiresAt = new Date(Date.now() + TOKEN_TTL);

  await db
    .insert(resetTokensTable)
    .values({
      userId,
      token,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: resetTokensTable.id,
      set: {
        token,
        expiresAt,
      },
    });

  return token;
}

export async function getPasswordResetToken(token: string) {
  const existingToken = await db.query.resetTokensTable.findFirst({
    where: eq(resetTokensTable.token, token),
  });

  return existingToken;
}

export async function deletePasswordResetToken(token: string, trx = db) {
  await trx.delete(resetTokensTable).where(eq(resetTokensTable.token, token));
}

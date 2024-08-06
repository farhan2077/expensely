"use server";

import { getPasswordResetToken } from "@/app/actions/reset-token";
import { db } from "@/db";
import { resetTokensTable, sessionsTable, usersTable } from "@/db/schema";
import { Response } from "@/libs/types";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { hashPassword } from "@/app/actions/auth";

export async function changePassword(
  token: string,
  newPassword: string
): Promise<Response> {
  const existingToken = await getPasswordResetToken(token);

  if (!existingToken) {
    return {
      success: false,
      message: "Invalid reset token",
    };
  }

  const userId = existingToken.userId;

  try {
    return await db.transaction(async (tx) => {
      // delete password reset token
      await tx
        .delete(resetTokensTable)
        .where(eq(resetTokensTable.token, token));
      // update password
      const newSalt = randomBytes(128).toString("base64");
      const newHash = await hashPassword(newPassword, newSalt);
      await tx
        .update(usersTable)
        .set({
          hash: newHash,
          salt: newSalt,
        })
        .where(eq(usersTable.id, userId));
      // delete user sessions
      await tx.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
      return {
        success: true,
        message: "Password changed successfully",
      };
    });
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

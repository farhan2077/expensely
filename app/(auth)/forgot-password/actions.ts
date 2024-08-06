"use server";

import { getUserByEmail } from "@/app/actions/auth";
import { createPasswordResetToken } from "@/app/actions/reset-token";
import { sendEmail } from "@/libs/send-email";
import ResetPasswordEmail from "@/emails/reset-password";
import { Response } from "@/libs/types";

export async function getResetPasswordMail(email: string): Promise<Response> {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return {
        success: true,
        message: "Password reset mail sent successfully",
      };
    }

    const token = await createPasswordResetToken(user.id);

    // send mail using resend
    const data = await sendEmail(
      email,
      `Your password reset link for Expensely`,
      ResetPasswordEmail({
        userName: user.name,
        token: token,
      })
    );

    if (!data || !data.id) {
      return {
        success: true,
        message: "Password reset mail sent successfully",
      };
    }

    return {
      success: true,
      message: "Password reset mail sent",
    };
  } catch (error) {
    return {
      success: false,
      message: "There was an error",
    };
  }
}

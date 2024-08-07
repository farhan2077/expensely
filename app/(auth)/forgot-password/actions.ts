"use server";

import { APP_NAME } from "@/config";

import { getUserByEmail } from "@/app/actions/auth";
import { createPasswordResetToken } from "@/app/actions/reset-token";

import { sendEmail } from "@/libs/send-email";
import { Response } from "@/libs/types";

import ResetPasswordEmail from "@/emails/reset-password";

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
      `Your password reset link for ${APP_NAME}`,
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

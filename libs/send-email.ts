import { ReactNode } from "react";

import { Resend } from "resend";

import env from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(
  emailTo: string,
  subject: string,
  body: ReactNode
) {
  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: emailTo,
    subject,
    react: body,
  });

  if (error) {
    throw error;
  }

  return data;
}

import type { Metadata } from "next";
import Link from "next/link";

import { APP_NAME } from "@/config";

import { ResetPasswordForm } from "@/app/(auth)/reset-password/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
  description: `Reset password of your ${APP_NAME} account`,
};

function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const token = searchParams.token || "";

  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset password
          </h1>
          <p className="text-sm text-muted-foreground">
            Please enter your new password
          </p>
        </div>
        <ResetPasswordForm token={token} />
        <p className="text-center text-sm text-muted-foreground">
          Remember the password?{" "}
          <Link href="/sign-in" className="underline hover:text-primary">
            Log in
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;

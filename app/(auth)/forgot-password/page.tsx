import Link from "next/link";

import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/app/(auth)/forgot-password/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your expensely account",
};

function ForgotPasswordPage() {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Change password
          </h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ll send you an email to reset your password
          </p>
        </div>
        <ForgotPasswordForm />
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

export default ForgotPasswordPage;

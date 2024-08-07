import type { Metadata } from "next";
import Link from "next/link";

import { APP_NAME } from "@/config";

import { SigninForm } from "@/app/(auth)/sign-in/SigninForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to your ${APP_NAME} account`,
};

function SigninPage() {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Start using {APP_NAME}
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password below to sign in to your account
          </p>
        </div>
        <SigninForm />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline hover:text-primary">
            Create one
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default SigninPage;

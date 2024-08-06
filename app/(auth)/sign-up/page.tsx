import Link from "next/link";

import type { Metadata } from "next";

import { SignupForm } from "@/app/(auth)/sign-up/SignupForm";
import { APP_NAME } from "@/config";

export const metadata: Metadata = {
  title: "Sign up",
  description: `Create new account with ${APP_NAME}`,
};

function SignupPage() {
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
        <SignupForm />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline hover:text-primary">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

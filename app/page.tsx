import { Suspense } from "react";

import Link from "next/link";

import { APP_NAME } from "@/config";

import AnimatedElement from "@/components/AnimatedElement";
import { Icons } from "@/components/icons";
import LastCommitDate from "@/components/LastCommitDate";
import { Button } from "@/components/ui/button";

export default async function Page() {
  return (
    <main className="relative">
      <div className="flex min-h-dvh items-center justify-center">
        <div className="flex flex-col items-center">
          <AnimatedElement delay={false} direction="up">
            <div className="flex items-center">
              <Icons.logo className="mr-2 h-7 w-7" />
              <h1 className="text-3xl font-semibold tracking-tight">
                {APP_NAME}
              </h1>
            </div>
          </AnimatedElement>
          <AnimatedElement delay={true} direction="up">
            <div className="mt-8 flex w-full items-center justify-center gap-4">
              <Button asChild variant="outline">
                <Link href="/sign-up">Sign up</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </AnimatedElement>
        </div>
      </div>
      <AnimatedElement delay={true} direction="down">
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-muted-foreground">
          {/* <p>Currently under active development</p> */}
          <Suspense
            fallback={
              <div className="h-4 w-[200px] animate-pulse rounded bg-muted"></div>
            }
          >
            <LastCommitDate />
          </Suspense>
        </div>
      </AnimatedElement>
    </main>
  );
}

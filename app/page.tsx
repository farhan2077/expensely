import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LogoSvg } from "@/components/Icons";

export default function HomePage() {
  return (
    <main className="relative">
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <LogoSvg className="mr-2 h-7 w-7" />
            <h1 className="text-3xl font-semibold tracking-tight">Expensely</h1>
          </div>
          <div className="mt-8 flex w-full items-center justify-center gap-4">
            <Button asChild>
              <Link href="/sign-up">Sign up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-zinc-500">
        Currently under active development
      </p>
    </main>
  );
}

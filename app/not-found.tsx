import Link from "next/link";

import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mt-10 flex flex-col items-center justify-center gap-2">
      <p className="text-3xl">🥲</p>
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <Link
        href="/"
        className="flex items-center gap-1 text-sm font-medium text-primary underline"
      >
        <ArrowLeft className="h-4 w-4" /> <span>Return home</span>
      </Link>
    </main>
  );
}

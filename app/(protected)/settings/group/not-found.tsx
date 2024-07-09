import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mt-10 flex flex-col items-center justify-center gap-2">
      <p className="text-3xl">🥲</p>
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested group</p>
      <Link
        href="/settings"
        className="flex items-center gap-1 text-sm font-medium text-primary underline"
      >
        <ArrowLeft className="h-4 w-4" /> <span>Go back to settings</span>
      </Link>
    </main>
  );
}

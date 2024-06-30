import { Link } from "next-view-transitions";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-3xl tracking-tight">Not Found 🥲</h1>
      <Link
        href="/"
        className="font-medium text-primary underline underline-offset-4"
      >
        Return Home
      </Link>
    </main>
  );
}

"use client"; // Error components must be Client Components

import { useEffect } from "react";

import Error from "next/error";

import * as Sentry from "@sentry/nextjs";

// global-error.tsx is only enabled in production. In development, our error overlay will show instead.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="mb-4 text-3xl tracking-tight">
            Something went wrong 😩
          </h1>
          <button
            className="font-medium text-primary underline underline-offset-4"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}

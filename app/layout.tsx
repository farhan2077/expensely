import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "sonner";
import ProgressbarProvider from "@/components/Progressbar";
import Script from "next/script";

import { cn } from "@/libs/utils";
import {
  BASE_URL,
  SEO_TITLE,
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
} from "@/app/static";
import env from "@/env";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
  },
  title: {
    default: SEO_TITLE,
    template: `%s | ${SEO_TITLE}`,
  },
  description: SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  creator: SEO_TITLE,
  openGraph: {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    url: BASE_URL,
    siteName: SEO_TITLE,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: SEO_TITLE,
    card: "summary_large_image",
  },
  robots: {
    index: true, // tell search engine crawlers to index the content of the page, otherwise the page won't appear in search engine results pages (SERPs)
    follow: true, // instruct the crawler to follow and crawl the links on the page
    googleBot: {
      index: true, // tell Google's crawler to index the content of the page
      follow: true, // instruct google crawler to follow and crawl the links on the page
      "max-video-preview": -1, // disables video previews for the page
      "max-image-preview": "large", // maximum size for image previews to be "large"
      "max-snippet": -1, // no maximum length for text snippets shown in search results
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      {process.env.NODE_ENV === "production" ? (
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive" // https://nextjs.org/docs/app/api-reference/components/script#afterinteractive
        />
      ) : null}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProgressbarProvider>
            <Toaster richColors position="top-center" />
            {children}
          </ProgressbarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import {
  BASE_URL,
  SEO_TITLE,
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
} from "@/app/static";

import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
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
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}

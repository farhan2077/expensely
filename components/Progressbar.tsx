"use client";

import type { ReactNode } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { BRAND_COLOR } from "@/app/static";

const ProgressbarProvider = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <>
      {children}
      <ProgressBar
        delay={150}
        height="3px"
        color={BRAND_COLOR}
        options={{ showSpinner: false }}
        shallowRouting={true}
      />
    </>
  );
};

export default ProgressbarProvider;

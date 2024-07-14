"use client";

import { cn } from "@/libs/utils";
import { useEffect, useState, type ReactNode } from "react";

export default function AnimatedElement({
  children,
  delay,
  direction,
}: Readonly<{
  children: ReactNode;
  delay?: boolean;
  direction: "up" | "down";
}>) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={cn("transform transition-all duration-500 ease-out", {
        "translate-y-0 opacity-100": isLoaded,
        "translate-y-3 opacity-0": !isLoaded && direction === "up",
        "-translate-y-1 opacity-0": !isLoaded && direction === "down",
        "delay-0": !delay,
        "delay-200": delay,
      })}
    >
      {children}
    </div>
  );
}

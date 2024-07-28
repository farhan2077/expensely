"use client";

import { cn } from "@/libs/utils";
import { useEffect, useRef, useState, type ReactNode } from "react";

export default function AnimatedElement({
  children,
  delay,
  direction,
}: Readonly<{
  children: ReactNode;
  delay?: boolean;
  direction: "up" | "down";
}>) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const callbackFunc = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const currentRef = ref.current; // access the DOM element
    const options = {
      root: null, // the observer will use the viewport of the document as the container to observe the target element
      rootMargin: "0px", // no extra margin is added; the intersection area is exactly the same as the root's bounding box
      threshold: 1.0, // the callback will be executed only when 100% of the target is visible within the root
    };

    const observer = new IntersectionObserver(callbackFunc, options);

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.observe(currentRef);
      }
    };
  }, [ref]);

  return (
    <div
      ref={ref}
      className={cn("transform transition-all duration-500 ease-out", {
        "translate-y-0 opacity-100": isVisible,
        "translate-y-3 opacity-0": !isVisible && direction === "up",
        "-translate-y-1 opacity-0": !isVisible && direction === "down",
        "delay-0": !delay,
        "delay-200": delay,
      })}
    >
      {children}
    </div>
  );
}

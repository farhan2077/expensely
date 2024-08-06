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
  const timeoutRef = useRef(null);

  const callbackFunc = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;

    if (entry.isIntersecting) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // small delay to ensure will-change is applied before the animation
      setTimeout(() => setIsVisible(true), 20);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    const currentRef = ref.current; // access the DOM element
    const currentTimeoutRef = timeoutRef.current;

    const options = {
      root: null, // the observer will use the viewport of the document as the container to observe the target element
      rootMargin: "0px", // no extra margin is added; the intersection area is exactly the same as the root's bounding box
      threshold: 0.1, // threshold range (0.0 to 1.0), the value = percentage of target value that must be available to run the callback fn (0.1 > 10%)
    };

    const observer = new IntersectionObserver(callbackFunc, options);

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();

      // clear any lingering timeout on unmount
      if (currentTimeoutRef) clearTimeout(currentTimeoutRef);
    };
  }, [ref]);

  return (
    <div
      ref={ref}
      className={cn("transform transition-all duration-500 ease-out", {
        "translate-y-0 opacity-100 will-change-transform": isVisible,
        "will-change-auto": !isVisible,
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

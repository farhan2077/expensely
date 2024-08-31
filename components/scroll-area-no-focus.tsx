import React, { ReactNode, useEffect, useRef } from "react";

interface ScrollAreaNoFocusProps {
  children: ReactNode;
  className?: string;
}

const ScrollAreaNoFocus: React.FC<ScrollAreaNoFocusProps> = ({
  children,
  className = "",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // `e.deltaY` > vertical scroll amount, pos when scrolling down and neg when scrolling up
  // `sscrollTop` > number of pixels an element's content is scrolled vertically
  // scrollTop += e.deltaY > manually adjust the scroll position based on the mouse wheel movement
  const handleScroll = (e: WheelEvent) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop += e.deltaY;
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      scrollContainer.addEventListener("wheel", handleScroll, {
        passive: false,
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("wheel", handleScroll);
      }
    };
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className={`${className}`}
      style={{ scrollbarWidth: "thin" }}
    >
      {children}
    </div>
  );
};

export default ScrollAreaNoFocus;

import React, { ReactNode, useEffect, useRef } from "react";

interface ScrollAreaNoFocusProps {
  children: ReactNode;
  maxHeight?: string;
}

const ScrollAreaNoFocus: React.FC<ScrollAreaNoFocusProps> = ({
  children,
  maxHeight = "max-h-[70vh]",
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
      className={`${maxHeight} -mx-4 overflow-y-auto px-4`}
      // why -mx-4 and px-4?
      // <ScrollAreaNoFocus /> was cutting the input field ring due to overflow-hidden
      // scrollbar was on top of the input fields
      style={{ scrollbarWidth: "thin" }}
    >
      {children}
    </div>
  );
};

export default ScrollAreaNoFocus;

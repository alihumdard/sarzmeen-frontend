"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";

type CarouselProps = {
  /** Total items in the track — used to work out how many dots to show. */
  itemCount: number;
  /** Items visible at once on the widest layout, i.e. one "page". */
  itemsPerPage: number;
  /** The slides. Each child should carry its own fixed width. */
  children: ReactNode;
  /** Accessible label for the previous/next buttons, e.g. "properties". */
  label: string;
  /** Paging dots below the track. Off for carousels that only use arrows. */
  showDots?: boolean;
};

/**
 * Horizontal scroll carousel with side arrows and paging dots.
 *
 * The track is a native scroll container, so it can be swiped or scrolled
 * directly as well; the dots stay in sync with wherever it ends up.
 */
export default function Carousel({
  itemCount,
  itemsPerPage,
  children,
  label,
  showDots = true,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(itemCount / itemsPerPage);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function handleScroll() {
      if (!track) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) {
        setPage(0);
        return;
      }

      const ratio = track.scrollLeft / maxScroll;
      setPage(Math.round(ratio * (pageCount - 1)));
    }

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, [pageCount]);

  function scrollToPage(nextPage: number) {
    const track = trackRef.current;
    if (!track) return;

    const clamped = Math.max(0, Math.min(nextPage, pageCount - 1));
    const maxScroll = track.scrollWidth - track.clientWidth;

    track.scrollTo({
      left: pageCount > 1 ? (maxScroll * clamped) / (pageCount - 1) : 0,
      behavior: "smooth",
    });
  }

  // Arrows sit just outside the track so they never cover a card.
  const arrowClasses =
    "absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-heading shadow-md transition-opacity hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-0 lg:flex";

  return (
    <>
      <div className="relative mt-8">
        <button
          type="button"
          aria-label={`Previous ${label}`}
          onClick={() => scrollToPage(page - 1)}
          disabled={page === 0}
          className={`${arrowClasses} -left-5`}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-0.5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>

        <button
          type="button"
          aria-label={`Next ${label}`}
          onClick={() => scrollToPage(page + 1)}
          disabled={page >= pageCount - 1}
          className={`${arrowClasses} -right-5`}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      {showDots && pageCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={page === index}
              onClick={() => scrollToPage(index)}
              className={`h-2 rounded-full transition-all ${
                page === index ? "w-5 bg-primary" : "w-2 bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}

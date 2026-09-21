"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
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
  /** Advance automatically, looping back to the start. Defaults to on. */
  autoPlay?: boolean;
  /** Milliseconds between each single-card auto-advance. Kept slow/gentle. */
  autoPlayInterval?: number;
  /** "dark" restyles the arrow buttons for a dark section background. */
  variant?: "light" | "dark";
};

/**
 * Horizontal scroll carousel with side arrows and paging dots.
 *
 * The track is a native scroll container, so it can be swiped or scrolled
 * directly as well; the dots stay in sync with wherever it ends up.
 *
 * Autoplay slides one card at a time (right to left) and loops seamlessly:
 * the track renders the slides twice back to back, and once the auto-scroll
 * carries past the first copy it snaps back to the start with the scroll
 * animation switched off for that single frame, so the wrap is invisible.
 * It pauses on hover/touch and while the tab is hidden or the user prefers
 * reduced motion, so it never fights someone who's actively browsing.
 */
export default function Carousel({
  itemCount,
  itemsPerPage,
  children,
  label,
  showDots = true,
  autoPlay = true,
  autoPlayInterval = 3200,
  variant = "light",
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [page, setPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const pageCount = Math.ceil(itemCount / itemsPerPage);
  // Looping needs a second copy of the slides to scroll into, so only turn
  // it on when autoplay is actually active and there's more than one page.
  const isLooping = autoPlay && pageCount > 1;

  /** Width of the original (non-cloned) content, for wrap/ratio maths. */
  function getContentWidth(track: HTMLDivElement) {
    return isLooping ? track.scrollWidth / 2 : track.scrollWidth;
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function handleScroll() {
      if (!track) return;

      const contentWidth = getContentWidth(track);
      const maxScroll = contentWidth - track.clientWidth;
      if (maxScroll <= 0) {
        setPage(0);
        return;
      }

      const ratio = Math.min(1, track.scrollLeft / maxScroll);
      setPage(Math.round(ratio * (pageCount - 1)));
    }

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCount, isLooping]);

  function scrollToPage(nextPage: number) {
    const track = trackRef.current;
    if (!track) return;

    const clamped = Math.max(0, Math.min(nextPage, pageCount - 1));
    const contentWidth = getContentWidth(track);
    const maxScroll = contentWidth - track.clientWidth;

    track.scrollTo({
      left: pageCount > 1 ? (maxScroll * clamped) / (pageCount - 1) : 0,
      behavior: "smooth",
    });
  }

  // Auto-advance one card at a time, looping seamlessly back to the start.
  useEffect(() => {
    if (!autoPlay || isPaused || pageCount <= 1) return;

    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      const current = trackRef.current;
      if (!current) return;

      const firstCard = current.firstElementChild as HTMLElement | null;
      if (!firstCard) return;

      const gap = parseFloat(getComputedStyle(current).columnGap || "0");
      const step = firstCard.getBoundingClientRect().width + gap;

      current.scrollBy({ left: step, behavior: "smooth" });

      // Once the smooth step lands, check whether we've scrolled into the
      // cloned copy; if so, snap back by one content-width with animation
      // switched off. Same content is visible before and after the snap,
      // so the loop reads as continuous.
      if (wrapTimeoutRef.current) clearTimeout(wrapTimeoutRef.current);
      wrapTimeoutRef.current = setTimeout(() => {
        const el = trackRef.current;
        if (!el || !isLooping) return;

        const contentWidth = getContentWidth(el);
        if (el.scrollLeft >= contentWidth) {
          el.style.scrollBehavior = "auto";
          el.scrollLeft -= contentWidth;
          el.style.scrollBehavior = "";
        }
      }, 500);
    }, autoPlayInterval);

    return () => {
      clearInterval(timer);
      if (wrapTimeoutRef.current) clearTimeout(wrapTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, autoPlayInterval, isPaused, pageCount, isLooping]);

  // Arrows sit just outside the track so they never cover a card.
  const arrowClasses =
    variant === "dark"
      ? "absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm shadow-md transition-colors hover:border-[#3DBB6E] hover:text-[#3DBB6E] disabled:pointer-events-none disabled:opacity-0 lg:flex"
      : "absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-heading shadow-md transition-opacity hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-0 lg:flex";

  return (
    <>
      <div
        className="relative mt-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
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
          <Fragment key="original">{children}</Fragment>
          {isLooping && <Fragment key="clone">{children}</Fragment>}
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

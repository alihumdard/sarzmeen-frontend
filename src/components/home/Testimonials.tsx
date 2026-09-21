"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AgentStatIcon,
  GoogleIcon,
  HomeStatIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  SmileStatIcon,
  StarFilledIcon,
  VerifiedTickIcon,
} from "@/components/ui/Icons";
import { testimonials, type Testimonial } from "@/constants/mockTestimonials";
import Carousel from "@/components/ui/Carousel";
import WriteReviewModal from "@/components/home/WriteReviewModal";

const sellStats = [
  { Icon: HomeStatIcon, value: "10K+", label: "Properties Listed" },
  { Icon: SmileStatIcon, value: "5K+", label: "Satisfied Clients" },
  { Icon: AgentStatIcon, value: "2K+", label: "Trusted Agents" },
  { Icon: ShieldCheckIcon, value: "100%", label: "Secure Process" },
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <StarFilledIcon
          key={index}
          className={`h-3.5 w-3.5 ${
            index < rating ? "text-warning" : "text-white/15"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ testimonial }: { testimonial: Testimonial }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="shine-border shine-border-animated group relative flex h-full flex-col overflow-hidden rounded-xl bg-[linear-gradient(160deg,#1c1f1e_0%,#10231a_100%)] p-4 shadow-[0_8px_28px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1">
      {/* Large decorative quote mark, tucked behind the content. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-1 -top-4 select-none font-serif text-[72px] leading-none text-white/[0.04]"
      >
        &rdquo;
      </span>

      {/* Header: avatar photo + name/time + Google badge */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-[13.5px] font-bold text-white">
                {testimonial.name}
              </p>
              <VerifiedTickIcon className="h-3.5 w-3.5 shrink-0 text-info" />
            </div>
            <p className="text-[11px] text-white/45">{testimonial.timeAgo}</p>
          </div>
        </div>

        <GoogleIcon className="h-4 w-4 shrink-0" />
      </div>

      {/* Stars */}
      <div className="relative mt-2">
        <RatingStars rating={testimonial.rating} />
      </div>

      {/* Quote */}
      <p
        className={`relative mt-2 flex-1 text-[13px] leading-relaxed text-white/80 ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {testimonial.quote}
      </p>

      <div className="relative mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-[12px] font-semibold text-[#3DBB6E] transition-colors hover:text-[#5fd68c] hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
        <span className="text-[11px] font-medium text-white/40">
          {testimonial.city}
        </span>
      </div>
    </div>
  );
}

/**
 * Sell/Rent CTA + client testimonials, merged into one continuous dark
 * panel instead of two separate green sections stacked back to back (that
 * used to create a visible seam). CTA + trust stats sit on top; the
 * Google-reviews-style testimonials carousel follows below a divider.
 */
export default function Testimonials() {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const averageRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <section className="relative overflow-hidden bg-[#0a0f0d] py-8 sm:py-9">
      {/* Sweeping diagonal base gradient — deep emerald to near-black. */}
      <div className="absolute inset-0 bg-[linear-gradient(125deg,#1f4a34_0%,#123626_20%,#0d221a_42%,#0a1512_65%,#080c0b_100%)]" />

      {/* Large soft glows layered on top for real depth, not a flat wash. */}
      <div className="absolute -top-32 -left-20 h-[480px] w-[480px] rounded-full bg-[#3DBB6E]/25 blur-[130px]" />
      <div className="absolute -bottom-32 -right-24 h-[460px] w-[460px] rounded-full bg-primary/30 blur-[130px]" />
      <div className="absolute left-1/3 top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-emerald-400/10 blur-[110px]" />

      {/* Fine dot-grid texture for extra depth — fades out toward the bottom. */}
      <div
        className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(180deg,black_0%,black_60%,transparent_100%)]"
        aria-hidden="true"
      />

      <div className="container-page relative">
        {/* Sell/Rent CTA */}
        <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-[20px] font-bold leading-snug text-white sm:text-[23px]">
              Want to Sell Your Property?
            </h2>
            <p className="mt-1.5 max-w-[360px] text-[13px] leading-relaxed text-white/70">
              Join thousands of successful agents and list your property on
              Sarzmeen.com today.
            </p>
            <Link
              href="/properties/add"
              className="mt-3 inline-flex items-center gap-2.5 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Add Your Property
              <PlusCircleIcon className="h-[18px] w-[18px]" />
            </Link>
          </div>

          <div className="grid w-full grid-cols-2 gap-y-3 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 sm:grid-cols-4 sm:gap-y-0 lg:w-auto lg:min-w-[420px]">
            {sellStats.map(({ Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <Icon className="h-5 w-5 text-[#3DBB6E]" />
                <dd className="mt-1 text-[18px] font-bold text-white">
                  {value}
                </dd>
                <dt className="text-[11px] leading-snug text-white/60">
                  {label}
                </dt>
              </div>
            ))}
          </div>
        </div>

        <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Client testimonials */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-center">
          {/* Summary panel */}
          <div className="flex flex-row flex-wrap items-center gap-x-5 gap-y-3 lg:flex-col lg:items-start lg:gap-2 lg:border-r lg:border-white/10 lg:pr-8">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.7 3.7L12 11.7 5.3 8 12 4.3ZM5 9.6l6 3.3v6.8l-6-3.3V9.6Zm8 10.1v-6.8l6-3.3v6.7l-6 3.4Z" />
                </svg>
              </span>
              <span className="text-[15px] font-bold text-white">
                Sarzmeen<span className="text-[#3DBB6E]">.com</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[22px] font-bold leading-none text-white">
                {averageRating.toFixed(1)}
              </span>
              <div>
                <RatingStars rating={Math.round(averageRating)} />
                <p className="mt-0.5 text-[12px] text-white/60">
                  {testimonials.length * 21}+ Google reviews
                </p>
              </div>
            </div>

            {/* Avatar stack — quick "real people" trust signal. */}
            <div className="flex items-center -space-x-2.5">
              {testimonials.slice(0, 4).map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-[#0b1210]"
                >
                  <Image
                    src={testimonial.avatar}
                    alt=""
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
              ))}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-white/70 ring-2 ring-[#0b1210]">
                +{testimonials.length * 21 - 4}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="rounded-md border border-white/20 px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:border-[#3DBB6E] hover:bg-[#3DBB6E]/10 hover:text-[#3DBB6E]"
            >
              Write a Review
            </button>
          </div>

          {/* Reviews carousel */}
          <div className="min-w-0">
            <Carousel
              itemCount={testimonials.length}
              itemsPerPage={3}
              label="client reviews"
              showDots={false}
              variant="dark"
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-[300px] shrink-0 snap-start sm:w-[320px] lg:w-[calc((100%-40px)/3)]"
                >
                  <ReviewCard testimonial={testimonial} />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>

      <WriteReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CloseIcon, SendIcon, StarFilledIcon } from "@/components/ui/Icons";

type WriteReviewModalProps = {
  open: boolean;
  onClose: () => void;
};

const fieldClasses =
  "w-full rounded-md border border-border bg-white px-4 py-3 text-[13px] text-heading outline-none transition-colors placeholder:text-muted focus:border-primary";

/**
 * "Write a Review" dialog opened from the Testimonials section. No backend
 * yet — submitting just shows a thank-you state; wire up the real endpoint
 * where `handleSubmit` is marked below.
 */
export default function WriteReviewModal({
  open,
  onClose,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Reset to a clean form each time the dialog is reopened.
  useEffect(() => {
    if (open) {
      setRating(5);
      setHoverRating(0);
      setSubmitted(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // TODO: POST to the reviews API once it exists. For now just confirm.
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="write-review-title"
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-heading"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
              <StarFilledIcon className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-[18px] font-bold text-heading">
              Thanks for your feedback!
            </h2>
            <p className="mt-1.5 text-[13px] text-muted">
              Your review has been submitted and will appear here once it&apos;s
              reviewed.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2
              id="write-review-title"
              className="text-[18px] font-bold text-heading"
            >
              Write a Review
            </h2>
            <p className="mt-1 text-[13px] text-muted">
              Tell other buyers and sellers about your experience with
              Sarzmeen.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-heading">
                  Your Rating
                </label>
                <div
                  className="flex items-center gap-1"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} out of 5`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="p-0.5"
                    >
                      <StarFilledIcon
                        className={`h-6 w-6 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "text-warning"
                            : "text-border"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="review-name" className="text-[12px] font-semibold text-heading">
                  Your Name
                </label>
                <input
                  id="review-name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Ali Hassan"
                  className={fieldClasses}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="review-message" className="text-[12px] font-semibold text-heading">
                  Your Review
                </label>
                <textarea
                  id="review-message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Share details of your own experience with this property or agent..."
                  className={`${fieldClasses} resize-y`}
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-[13px] font-semibold text-white shadow-[0_10px_22px_rgba(31,122,77,0.24)] transition-colors hover:bg-primary-dark"
              >
                <SendIcon className="h-4 w-4" />
                Submit Review
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

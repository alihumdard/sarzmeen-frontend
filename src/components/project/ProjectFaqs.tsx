"use client";

import { useState } from "react";
import type { ProjectDetail } from "@/types/project";

type Props = {
  project: ProjectDetail;
};

/** Per-project FAQs (spec section 15). */
export default function ProjectFaqs({ project }: Props) {
  const faqs = project.faqs ?? [];
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  if (faqs.length === 0) {
    return (
      <p className="py-8 text-center text-[12px] text-muted">
        No FAQs have been published for this project.
      </p>
    );
  }

  return (
    <div className="max-w-[640px]">
      <h2 className="text-[16px] font-bold text-heading">Frequently Asked Questions</h2>

      <div className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border">
        {faqs.map((faq) => {
          const open = faq.id === openId;

          return (
            <div key={faq.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : faq.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface"
              >
                <span className="text-[13px] font-semibold text-heading">{faq.question}</span>
                <span className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
              {open && (
                <p className="whitespace-pre-line px-4 pb-4 text-[12.5px] leading-relaxed text-text">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

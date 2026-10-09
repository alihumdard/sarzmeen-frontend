"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";

type Faq = {
  id: string;
  question: string;
  answer: string;
};

export default function HomeFAQ() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    api<{ data: Faq[] }>("/faqs")
      .then((res) => {
        const items = res.data.slice(0, 6);
        setFaqs(items);
        if (items.length > 0) setOpenId(items[0].id);
      })
      .catch(() => {});
  }, []);

  if (faqs.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/60 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        <div>
          <h3 className="text-[15px] font-bold text-heading">Frequently Asked Questions</h3>
          <p className="text-[11px] text-muted">Got questions? We have answers</p>
        </div>
      </div>

      {/* Questions */}
      <div className="divide-y divide-gray-100">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className={isOpen ? "bg-primary/[0.02]" : ""}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-gray-50"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-all duration-200 ${
                    isOpen
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isOpen ? "−" : "+"}
                </span>
                <span
                  className={`flex-1 text-[13px] leading-snug ${
                    isOpen ? "font-semibold text-heading" : "font-medium text-gray-600"
                  }`}
                >
                  {faq.question}
                </span>
              </button>

              <div
                className={`grid transition-all duration-200 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 pl-14 text-[12px] leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

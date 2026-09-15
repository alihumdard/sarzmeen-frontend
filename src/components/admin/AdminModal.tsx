"use client";

import { ReactNode, useEffect } from "react";

type AdminModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

export default function AdminModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className = "",
}: AdminModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-gray-950/40 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className={[
          "relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl",
          sizes[size],
          className,
        ].join(" ")}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-5 py-4">
          <div className="min-w-0">
            <h2
              id="admin-modal-title"
              className="text-[15px] font-semibold text-gray-900"
            >
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-[11px] leading-5 text-gray-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-gray-100 bg-gray-50/60 px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
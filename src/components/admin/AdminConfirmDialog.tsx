"use client";

import { useEffect } from "react";

type AdminConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function AdminConfirmDialog({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close confirmation"
        onClick={() => !loading && onCancel()}
        className="absolute inset-0 bg-gray-950/40 backdrop-blur-[2px]"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl"
      >
        <div className="flex items-start gap-3.5">
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              variant === "danger" ? "bg-red-50 text-red-600" : "bg-primary/10 text-primary",
            ].join(" ")}
          >
            {variant === "danger" ? <WarningIcon /> : <QuestionIcon />}
          </div>

          <div className="min-w-0">
            <h2 className="text-[14px] font-semibold text-gray-900">
              {title}
            </h2>

            <p className="mt-1.5 text-[11px] leading-5 text-gray-500">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="h-9 rounded-md border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={[
              "inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-[11px] font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60",
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-primary hover:opacity-90",
            ].join(" ")}
          >
            {loading && <Spinner />}
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-3.5 w-3.5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 21 20H3L12 3Z" />
      <path d="M12 9v5M12 17h.01" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.6 2.6 0 1 1 4.6 1.7c-.9 1.1-2.1 1.4-2.1 2.8" />
      <path d="M12 17h.01" />
    </svg>
  );
}
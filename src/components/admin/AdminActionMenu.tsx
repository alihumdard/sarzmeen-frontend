"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type AdminAction = {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: "default" | "danger";
  dividerBefore?: boolean;
  disabled?: boolean;
};

type AdminActionMenuProps = {
  actions: AdminAction[];
  align?: "left" | "right";
  className?: string;
};

export default function AdminActionMenu({
  actions,
  align = "right",
  className = "",
}: AdminActionMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 6,
      left: align === "right" ? rect.right : rect.left,
    });
  }, [align]);

  useEffect(() => {
    if (!open) return;
    updatePosition();

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const handleScroll = () => updatePosition();

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, updatePosition]);

  const dropdown =
    open && pos
      ? createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: pos.top,
              ...(align === "right"
                ? { right: window.innerWidth - pos.left }
                : { left: pos.left }),
              zIndex: 9999,
            }}
            className="min-w-[160px] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg shadow-gray-900/10"
          >
            {actions.map((action, index) => (
              <div key={`${action.label}-${index}`}>
                {action.dividerBefore && (
                  <div className="my-1 border-t border-gray-100" />
                )}

                <button
                  type="button"
                  disabled={action.disabled}
                  onClick={() => {
                    if (action.disabled) return;
                    action.onClick();
                    setOpen(false);
                  }}
                  className={[
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[11px] font-medium transition-colors",
                    action.variant === "danger"
                      ? "text-red-600 hover:bg-red-50"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    action.disabled
                      ? "cursor-not-allowed opacity-40 hover:bg-transparent"
                      : "",
                  ].join(" ")}
                >
                  {action.icon && (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                      {action.icon}
                    </span>
                  )}

                  <span>{action.label}</span>
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )
      : null;

  return (
    <div className={["relative inline-flex", className].join(" ")}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open actions"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <MoreIcon />
      </button>

      {dropdown}
    </div>
  );
}

function MoreIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

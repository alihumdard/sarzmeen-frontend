"use client";

import { useState } from "react";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  PhoneIcon,
  UserCircleIcon,
} from "@/components/ui/Icons";

/**
 * Icons are looked up by name rather than passed in as a component, because
 * a server component cannot hand a function across to a client component.
 */
const icons = {
  user: UserCircleIcon,
  email: EnvelopeIcon,
  phone: PhoneIcon,
  lock: LockIcon,
} as const;

export type AuthFieldIcon = keyof typeof icons;

type AuthFieldProps = {
  /** Visible label above the control. */
  label: string;
  /** Field name, also used as the input id. */
  name: string;
  type?: "text" | "email" | "tel" | "password";
  placeholder: string;
  /** Which leading icon to draw inside the field. */
  icon: AuthFieldIcon;
  autoComplete?: string;
  required?: boolean;
};

/**
 * One labelled input for the auth forms.
 *
 * Password fields get a reveal toggle; every other type renders as a plain
 * input with the same leading-icon treatment.
 */
export default function AuthField({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  autoComplete,
  required,
}: AuthFieldProps) {
  const [revealed, setRevealed] = useState(false);

  const Icon = icons[icon];
  const isPassword = type === "password";
  const inputType = isPassword && revealed ? "text" : type;

  return (
    <div>
      <label htmlFor={name} className="text-[12px] font-semibold text-heading">
        {label}
      </label>

      <div className="relative mt-2">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />

        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`w-full rounded-md border border-border bg-white py-3 pl-11 text-[13px] text-heading outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15 ${
            isPassword ? "pr-11" : "pr-4"
          }`}
        />

        {isPassword && (
          <button
            type="button"
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            onClick={() => setRevealed(!revealed)}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-muted transition-colors hover:text-primary"
          >
            {revealed ? (
              <EyeOffIcon className="h-[18px] w-[18px]" />
            ) : (
              <EyeIcon className="h-[18px] w-[18px]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

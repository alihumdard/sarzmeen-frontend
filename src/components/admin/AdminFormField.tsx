import { ReactNode } from "react";

type AdminFormFieldProps = {
  label: string;
  name?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

export default function AdminFormField({
  label,
  name,
  required = false,
  error,
  hint,
  children,
  className = "",
}: AdminFormFieldProps) {
  return (
    <div className={["space-y-1.5", className].join(" ")}>
      <label
        htmlFor={name}
        className="block text-[11px] font-semibold text-gray-700"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {children}

      {error ? (
        <p className="text-[10px] text-red-500">{error}</p>
      ) : hint ? (
        <p className="text-[10px] leading-4 text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}

export const adminInputClass =
  "h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-[12px] text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

export const adminTextareaClass =
  "min-h-[110px] w-full resize-y rounded-md border border-gray-200 bg-white px-3 py-2.5 text-[12px] leading-5 text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

export const adminSelectClass =
  "h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 text-[12px] text-gray-700 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";
import { ReactNode } from "react";

type AdminEmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export default function AdminEmptyState({
  title,
  description,
  action,
  icon,
  className = "",
}: AdminEmptyStateProps) {
  return (
    <div
      className={[
        "flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white px-6 py-10 text-center",
        className,
      ].join(" ")}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
        {icon ?? <DefaultEmptyIcon />}
      </div>

      <h3 className="mt-4 text-[13px] font-semibold text-gray-800">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 max-w-md text-[11px] leading-5 text-gray-500">
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function DefaultEmptyIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 3h10l4 4v14H3V3h4Z" />
      <path d="M7 3v5h10V3M8 13h8M8 17h5" />
    </svg>
  );
}
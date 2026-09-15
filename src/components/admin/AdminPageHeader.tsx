import Link from "next/link";
import { ReactNode } from "react";

type Breadcrumb = {
  label: string;
  href?: string;
};

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: ReactNode;
  className?: string;
};

export default function AdminPageHeader({
  title,
  description,
  breadcrumbs = [],
  action,
  className = "",
}: AdminPageHeaderProps) {
  return (
    <div className={["mb-6", className].join(" ")}>
      {/* Top Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Heading */}
        <div className="min-w-0">
          <h1 className="text-[24px] font-bold tracking-tight text-gray-900 sm:text-[28px]">
            {title}
          </h1>

          {description && (
            <p className="mt-1.5 max-w-[700px] text-[12px] leading-5 text-gray-500 sm:text-[13px]">
              {description}
            </p>
          )}
        </div>

        {/* Action */}
        {action && (
          <div className="flex shrink-0 items-center">
            {action}
          </div>
        )}
      </div>

      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="mt-4"
        >
          <ol className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px]">
            <li>
              <Link
                href="/admin"
                className="text-gray-400 transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
            </li>

            {breadcrumbs.map((breadcrumb, index) => (
              <li
                key={`${breadcrumb.label}-${index}`}
                className="flex items-center gap-2"
              >
                <ChevronIcon />

                {breadcrumb.href ? (
                  <Link
                    href={breadcrumb.href}
                    className="text-gray-400 transition-colors hover:text-primary"
                  >
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-600">
                    {breadcrumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="h-3 w-3 shrink-0 text-gray-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
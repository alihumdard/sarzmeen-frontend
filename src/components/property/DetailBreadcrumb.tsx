import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeStatIcon,
} from "@/components/ui/Icons";
import type { Crumb } from "@/components/layout/PageBanner";

type DetailBreadcrumbProps = {
  crumbs: Crumb[];
  /** Where the "Back to Results" link points. */
  backHref: string;
};

/**
 * Light breadcrumb strip used at the top of the property detail page, with a
 * return link to the listing on the right.
 */
export default function DetailBreadcrumb({
  crumbs,
  backHref,
}: DetailBreadcrumbProps) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
        <nav
          aria-label="Breadcrumb"
          className="inline-flex min-w-0 items-center rounded-full bg-white px-3.5 py-1.5 ring-1 ring-border"
        >
          <ol className="flex min-w-0 flex-wrap items-center gap-1.5 text-[12px] font-medium text-muted">
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex min-w-0 items-center gap-1.5">
                {index > 0 ? (
                  <ChevronRightIcon className="h-3 w-3 shrink-0 text-muted" />
                ) : (
                  <HomeStatIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
                )}

                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="truncate transition-colors hover:text-primary"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="truncate font-semibold text-heading">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <Link
          href={backHref}
          className="group flex shrink-0 items-center gap-1.5 text-[12px] font-medium text-primary"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Results
        </Link>
      </div>
    </div>
  );
}

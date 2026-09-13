import Link from "next/link";
import { ChevronLeftIcon } from "@/components/ui/Icons";
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
    <div className="border-b border-border bg-white">
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3.5">
        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex flex-wrap items-center gap-2 text-[12px] text-muted">
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden="true">&gt;</span>}

                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-primary"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="truncate text-heading">{crumb.label}</span>
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

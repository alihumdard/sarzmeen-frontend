import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export type Crumb = {
  label: string;
  /** Omitted on the current page, which renders as plain text. */
  href?: string;
};

type PageBannerProps = {
  title: string;
  /** Optional lead line between the title and the description. */
  subtitle?: string;
  description?: string;
  crumbs: Crumb[];
  /** Overrides the default background photo. */
  image?: string;
  /** Optional slot below the copy, e.g. the blog search bar. */
  children?: ReactNode;
  /** Caps the width of `children` so a search bar doesn't span the banner. */
  contentMaxWidth?: string;
};

/** Background photo used when a page does not supply its own. */
const DEFAULT_BANNER_IMAGE = "/images/hero-bg.jpg";

/**
 * Dark photo banner with breadcrumbs and a page title. Used at the top of
 * the inner public pages.
 */
export default function PageBanner({
  title,
  subtitle,
  description,
  crumbs,
  image = DEFAULT_BANNER_IMAGE,
  children,
  contentMaxWidth,
}: PageBannerProps) {
  /*
   * With a subtitle the banner is a copy block on the left, so the wash is
   * weighted that way and the photo stays visible on the right. Without one
   * the copy is short and a flat vertical wash reads better.
   */
  const overlay = subtitle
    ? "bg-[linear-gradient(95deg,rgba(9,32,25,0.96)_0%,rgba(9,32,25,0.9)_38%,rgba(9,32,25,0.55)_72%,rgba(9,32,25,0.35)_100%)]"
    : "bg-[linear-gradient(180deg,rgba(10,32,26,0.88)_0%,rgba(10,32,26,0.78)_100%)]";

  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />

      <div className={`absolute inset-0 -z-10 ${overlay}`} />

      <div
        className={`container-page ${
          subtitle ? "py-12 sm:py-16" : "py-10 sm:py-12"
        }`}
      >
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-[12px] text-white/75">
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden="true">&gt;</span>}

                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-white"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="mt-4 text-[30px] font-bold text-white sm:text-[34px]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2.5 text-[15px] font-semibold text-white/90">
            {subtitle}
          </p>
        )}

        {description && (
          <p
            className={`text-[13px] leading-relaxed text-white/80 ${
              subtitle ? "mt-4 max-w-[440px]" : "mt-2.5 max-w-[720px]"
            }`}
          >
            {description}
          </p>
        )}

        {children && (
          <div
            className="mt-7"
            style={contentMaxWidth ? { maxWidth: contentMaxWidth } : undefined}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

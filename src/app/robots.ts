import type { MetadataRoute } from "next";
import { getPublicSettings } from "@/lib/siteSettings";

/**
 * robots.txt driven by the SEO settings, so an admin can block indexing
 * while the site is in development without a deploy.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getPublicSettings("seo");

  const indexable = seo.robotsIndex !== false;
  const base = seo.canonicalUrl ? String(seo.canonicalUrl) : "";

  if (!indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private areas and auth screens have no search value.
        disallow: ["/admin", "/login", "/register", "/dashboard"],
      },
    ],
    sitemap: base ? `${base.replace(/\/$/, "")}/sitemap.xml` : undefined,
  };
}

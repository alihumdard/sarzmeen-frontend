import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { getPublicSettings } from "@/lib/siteSettings";
import "./globals.css";

/**
 * Site-wide metadata comes from the `seo` settings group, so an admin can
 * change titles, descriptions and verification tags without a deploy.
 */
export async function generateMetadata(): Promise<Metadata> {
    const seo = await getPublicSettings("seo");

    const text = (v: unknown, fallback = "") =>
        v == null || v === "" ? fallback : String(v);

    const title = text(seo.metaTitle, "Sarzameen.com");
    const template = text(seo.titleTemplate, "%s | Sarzameen.com");
    const description = text(
        seo.metaDescription,
        "Discover properties, real estate projects and property opportunities across Pakistan.",
    );
    const canonical = text(seo.canonicalUrl) || undefined;
    const ogImage = text(seo.ogImage) || undefined;
    const indexable = seo.robotsIndex !== false;

    return {
        title: { default: title, template },
        description,
        keywords: text(seo.metaKeywords)
            ? text(seo.metaKeywords).split(",").map((k) => k.trim()).filter(Boolean)
            : undefined,
        metadataBase: canonical ? new URL(canonical) : undefined,
        alternates: canonical ? { canonical } : undefined,
        robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
        verification: text(seo.googleSiteVerification)
            ? { google: text(seo.googleSiteVerification) }
            : undefined,
        openGraph: {
            title,
            description,
            type: "website",
            url: canonical,
            images: ogImage ? [ogImage] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        },
    };
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const appearance = await getPublicSettings("appearance");

    // Brand colours override the stylesheet defaults without a rebuild.
    const brandVars = [
        appearance.primaryColor && `--color-primary:${appearance.primaryColor}`,
        appearance.primaryDark && `--color-primary-dark:${appearance.primaryDark}`,
        appearance.primaryLight && `--color-primary-light:${appearance.primaryLight}`,
    ]
        .filter(Boolean)
        .join(";");

    return (
        <html lang="en">
            {brandVars && (
                <head>
                    <style
                        dangerouslySetInnerHTML={{ __html: `:root{${brandVars}}` }}
                    />
                </head>
            )}
            {/*
             * suppressHydrationWarning only covers this element's own attributes.
             * It's needed here because some browser extensions (form fillers,
             * color pickers, etc.) inject attributes like cz-shortcut-listen
             * onto <body> before React hydrates, which is a false-positive
             * mismatch unrelated to our code — not a signal to hide real bugs.
             */}
            <body suppressHydrationWarning>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
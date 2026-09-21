import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "Sarzmeen.com",
        template: "%s | Sarzmeen.com",
    },
    description:
        "Discover properties, real estate projects and property opportunities across Pakistan.",
    keywords: [
        "Pakistan real estate",
        "properties in Pakistan",
        "houses for sale",
        "real estate projects",
        "Sarzmeen",
    ],
    authors: [{ name: "Sarzmeen.com" }],
    creator: "Sarzmeen.com",
    publisher: "Sarzmeen.com",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            {/*
             * suppressHydrationWarning only covers this element's own attributes.
             * It's needed here because some browser extensions (form fillers,
             * color pickers, etc.) inject attributes like cz-shortcut-listen
             * onto <body> before React hydrates, which is a false-positive
             * mismatch unrelated to our code — not a signal to hide real bugs.
             */}
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
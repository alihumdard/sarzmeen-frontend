import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
        "houses for rent",
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
            <body>
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}
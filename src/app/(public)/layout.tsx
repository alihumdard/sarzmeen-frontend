import Header from "@/components/layout/Header";
import NewsTicker from "@/components/layout/NewsTicker";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />

            <NewsTicker />

            {children}

            <Footer />

            {/* Clears the fixed bottom bar so the footer is never under it. */}
            <div className="h-[86px] lg:hidden" aria-hidden="true" />

            <MobileBottomNav />

            <WhatsAppButton />
        </>
    );
}
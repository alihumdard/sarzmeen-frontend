import Header from "@/components/layout/Header";
import NewsTicker from "@/components/layout/NewsTicker";
import Footer from "@/components/layout/Footer";
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

            <WhatsAppButton />
        </>
    );
}
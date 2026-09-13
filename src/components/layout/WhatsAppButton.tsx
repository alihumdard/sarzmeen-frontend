import { WhatsAppIcon } from "@/components/ui/Icons";
import { whatsappNumber } from "@/constants/navigation";

/**
 * Floating WhatsApp contact button, fixed to the bottom-right of every page.
 * The number lives in constants/navigation.ts.
 */
export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}

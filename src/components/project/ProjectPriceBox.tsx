import Link from "next/link";
import {
  AreaSizeIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";
import { whatsappNumber } from "@/constants/navigation";
import type { ProjectDetail } from "@/types/project";

type ProjectPriceBoxProps = {
  project: ProjectDetail;
};

/**
 * Price, plot sizes and developer info, with the same contact actions as a
 * property's price box — projects have no single assigned agent, so these
 * route to the site's general WhatsApp/contact channels instead.
 */
export default function ProjectPriceBox({ project }: ProjectPriceBoxProps) {
  const { priceFrom, plotSizes, developer } = project;

  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <p className="text-[19px] font-bold text-primary">{priceFrom}</p>

      <div className="mt-4 border-t border-border pt-4">
        <p className="flex items-center gap-2 text-[11px] font-medium text-muted">
          <AreaSizeIcon className="h-4 w-4 shrink-0 text-primary" />
          Plot Sizes Available
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {plotSizes.map((size) => (
            <span
              key={size}
              className="rounded-full bg-primary-light px-3 py-1 text-[11px] font-medium text-primary"
            >
              {size}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <p className="text-[11px] text-muted">Developed By</p>
        <p className="mt-1 text-[13px] font-bold text-heading">{developer}</p>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <a
          href={`tel:+${whatsappNumber}`}
          className="flex items-center justify-center gap-2 rounded-md bg-primary py-3 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <PhoneIcon className="h-4 w-4" />
          Call for Details
        </a>

        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-2 rounded-md border border-[#0f8a3e] py-3 text-[13px] font-semibold text-heading transition-colors hover:bg-[#25D366] hover:text-white"
        >
          <WhatsAppIcon className="h-4 w-4 text-[#25D366] group-hover:text-white" />
          Chat on WhatsApp
        </a>
      </div>

      <Link
        href="/contact"
        className="mt-3 block rounded-md border border-border py-2.5 text-center text-[12px] font-semibold text-heading transition-colors hover:border-primary hover:text-primary"
      >
        Request a Callback
      </Link>
    </div>
  );
}

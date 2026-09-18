import Link from "next/link";
import { LocationPinIcon, ArrowRightIcon } from "@/components/ui/Icons";

const citiesList = [
  { name: "Karachi", count: 185 },
  { name: "Lahore", count: 210 },
  { name: "Islamabad", count: 145 },
  { name: "Rawalpindi", count: 95 },
  { name: "Faisalabad", count: 70 },
  { name: "Peshawar", count: 55 },
  { name: "Multan", count: 65 },
  { name: "Gujranwala", count: 40 },
  { name: "Sialkot", count: 35 },
  { name: "Hyderabad", count: 50 },
  { name: "Bahawalpur", count: 30 },
  { name: "Quetta", count: 45 },
  { name: "Abbottabad", count: 25 },
  { name: "Mardan", count: 20 },
  { name: "Gujrat", count: 28 },
  { name: "Sargodha", count: 32 },
];

type AgenciesByCityProps = {
  onSelectCity: (city: string) => void;
};

export default function AgenciesByCity({ onSelectCity }: AgenciesByCityProps) {
  return (
    <section className="bg-surface py-12 border-y border-border mb-12">
      <div className="container-page">
        <div>
          <h2 className="text-[22px] font-bold text-heading sm:text-[26px]">
            Browse Agencies By City
          </h2>
          <p className="mt-1 text-[14px] text-text">
            Explore real estate agencies in popular cities across Pakistan.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {citiesList.map((city) => {
            const cityParam = encodeURIComponent(city.name);
            const trendHref = `/property-trends/${city.name.toLowerCase()}`;

            return (
              <div
                key={city.name}
                className="flex flex-col justify-between rounded-lg border border-border bg-white p-5 shadow-sm transition-all hover:border-primary hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-light text-primary">
                      <LocationPinIcon className="h-5 w-5" />
                    </span>
                    <span className="text-[12px] font-semibold text-muted">
                      {city.count} Agencies
                    </span>
                  </div>

                  <h3 className="mt-4 text-[16px] font-bold text-heading">
                    {city.name}
                  </h3>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-[13px] font-semibold">
                  <button
                    type="button"
                    onClick={() => onSelectCity(city.name)}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    View Agencies
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </button>

                  <Link
                    href={trendHref}
                    className="text-[12px] font-medium text-muted transition-colors hover:text-heading"
                  >
                    View Trend →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

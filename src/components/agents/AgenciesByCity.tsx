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
  /** Highlights the city currently applied via the filter bar, if any. */
  selectedCity?: string;
};

export default function AgenciesByCity({
  onSelectCity,
  selectedCity,
}: AgenciesByCityProps) {
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
            const isActive =
              selectedCity?.toLowerCase() === city.name.toLowerCase();

            return (
              <button
                key={city.name}
                type="button"
                onClick={() => onSelectCity(city.name)}
                className={`group flex flex-col rounded-lg border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  isActive
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-border hover:border-primary"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-md ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-primary-light text-primary"
                    }`}
                  >
                    <LocationPinIcon className="h-5 w-5" />
                  </span>
                  <span className="text-[12px] font-semibold text-muted">
                    {city.count} Agencies
                  </span>
                </div>

                <h3 className="mt-4 text-[16px] font-bold text-heading">
                  {city.name}
                </h3>

                <span className="mt-4 flex items-center gap-1 border-t border-border pt-4 text-[13px] font-semibold text-primary">
                  {isActive ? "Selected" : "View Agencies"}
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

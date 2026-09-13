import {
  LocationPinIcon,
  PlaneIcon,
  RoadIcon,
  ShopIcon,
  TreeIcon,
} from "@/components/ui/Icons";
import type { NearbyPlace, PropertyDetail } from "@/types/property";

type PropertyLocationProps = {
  property: PropertyDetail;
};

const placeIcons: Record<NearbyPlace["kind"], typeof TreeIcon> = {
  park: TreeIcon,
  road: RoadIcon,
  airport: PlaneIcon,
  mall: ShopIcon,
};

/**
 * Right column of the Overview tab: a map preview and nearby landmarks.
 *
 * V1 shows a stylised static map — wiring a live embed needs a Google Maps
 * key, which is a Phase 4 concern.
 */
export default function PropertyLocation({ property }: PropertyLocationProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    property.fullLocation,
  )}`;

  return (
    <div>
      <h2 className="text-[15px] font-bold text-heading">Location</h2>

      <p className="mt-2 text-[11px] text-muted">{property.fullLocation}</p>

      <div className="mt-3 overflow-hidden rounded-lg border border-border">
        {/* Stylised street grid standing in for the live map. */}
        <div className="relative h-[150px] bg-[#e8ede9]">
          <svg
            viewBox="0 0 320 150"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            <rect width="320" height="150" fill="#eaefeb" />
            <path
              d="M0 46h320M0 104h320M74 0v150M188 0v150M258 0v150"
              stroke="#ffffff"
              strokeWidth="7"
            />
            <path
              d="M0 74h320M130 0v150"
              stroke="#ffffff"
              strokeWidth="4"
            />
            <rect x="14" y="10" width="46" height="26" fill="#dfe6e1" />
            <rect x="90" y="12" width="30" height="24" fill="#dfe6e1" />
            <rect x="200" y="14" width="44" height="22" fill="#dfe6e1" />
            <rect x="18" y="114" width="42" height="24" fill="#dfe6e1" />
            <rect x="146" y="112" width="30" height="26" fill="#dfe6e1" />
            <rect x="272" y="56" width="36" height="40" fill="#d7e4da" />
          </svg>

          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full bg-primary text-white shadow-lg">
            <LocationPinIcon className="h-5 w-5" />
          </span>
        </div>

        <div className="border-t border-border p-3">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md border border-primary py-2 text-center text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            View on Google Maps
          </a>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {property.nearbyPlaces.map((place) => {
          const Icon = placeIcons[place.kind];

          return (
            <li
              key={place.name}
              className="flex items-center justify-between gap-3"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="truncate text-[11px] text-text">
                  {place.name}
                </span>
              </span>

              <span className="shrink-0 text-[11px] text-muted">
                {place.distance}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

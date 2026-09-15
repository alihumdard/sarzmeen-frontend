import { PlaneIcon, RoadIcon, ShopIcon, TreeIcon } from "@/components/ui/Icons";
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
 * Right column of the Overview tab: a live map preview and nearby landmarks.
 *
 * Uses the key-less Google Maps embed endpoint (maps.google.com/maps?...
 * &output=embed) so the real location renders without an API key; the
 * "View on Google Maps" link opens the same query in a full tab.
 */
export default function PropertyLocation({ property }: PropertyLocationProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    property.fullLocation,
  )}`;

  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    property.fullLocation,
  )}&z=14&output=embed`;

  return (
    <div>
      <h2 className="text-[15px] font-bold text-heading">Location</h2>

      <p className="mt-2 text-[11px] text-muted">{property.fullLocation}</p>

      <div className="mt-3 overflow-hidden rounded-lg border border-border">
        <div className="relative h-[190px] bg-surface">
          <iframe
            title={`Map showing ${property.fullLocation}`}
            src={embedUrl}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
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

type PropertyLocationProps = {
  property: { fullLocation: string };
  fullWidth?: boolean;
};

export default function PropertyLocation({ property, fullWidth }: PropertyLocationProps) {
  const address = property.fullLocation?.trim() ?? "";

  /*
   * An empty address leaves the maps query blank, and Google answers that with
   * a view of the whole world — worse than showing nothing.
   */
  if (!address) {
    return (
      <div>
        <h2 className="text-[16px] font-bold text-heading">Location</h2>
        <p className="py-8 text-center text-[12px] text-muted">
          No address has been published for this listing.
        </p>
      </div>
    );
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`;

  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    address,
  )}&z=14&output=embed`;

  return (
    <div>
      <h2 className="text-[16px] font-bold text-heading">Location</h2>

      <p className="mt-2 text-[12px] font-medium text-muted">{address}</p>

      <div className="mt-3 overflow-hidden rounded-lg border border-border">
        <div className={`relative bg-surface ${fullWidth ? "h-[400px]" : "h-[190px]"}`}>
          <iframe
            title={`Map showing ${address}`}
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
    </div>
  );
}

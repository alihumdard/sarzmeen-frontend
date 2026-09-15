import type { Property } from "@/types/property";

/**
 * Maps a hero-search / filter-sidebar type value to the keywords its title
 * is expected to contain. Mock listings have no dedicated `propertyType`
 * field, so this is a pragmatic stand-in until the API supplies one.
 */
const TYPE_KEYWORDS: Record<string, string[]> = {
  house: ["house", "portion", "apartment", "flat"],
  flat: ["apartment", "flat", "portion"],
  "upper-portion": ["portion"],
  "lower-portion": ["portion"],
  "farm-house": ["farm house"],
  "residential-plot": ["residential plot", "plot"],
  "commercial-plot": ["commercial"],
  shop: ["shop"],
  office: ["office", "commercial"],
};

export type PropertySearchParams = {
  location?: string;
  type?: string;
  price?: string;
  city?: string;
  purpose?: string;
};

/** Parses a "min-max" price bucket value, e.g. "5000000-10000000" or "50000000-". */
function parsePriceRange(value: string): { min: number; max: number | null } {
  const [minRaw, maxRaw] = value.split("-");
  const min = Number(minRaw) || 0;
  const max = maxRaw ? Number(maxRaw) : null;
  return { min, max };
}

/**
 * Filters the mock listing array against the search params carried in the
 * URL — the same params the hero search and listing search bar both write,
 * so either entry point narrows the results shown here.
 */
export function filterProperties(
  properties: Property[],
  params: PropertySearchParams,
): Property[] {
  let results = properties;

  const locationQuery = params.location?.trim().toLowerCase();
  if (locationQuery) {
    results = results.filter((property) =>
      property.location.toLowerCase().includes(locationQuery),
    );
  }

  if (params.type) {
    const keywords = TYPE_KEYWORDS[params.type];
    if (keywords) {
      results = results.filter((property) =>
        keywords.some((keyword) =>
          property.title.toLowerCase().includes(keyword),
        ),
      );
    }
  }

  if (params.price) {
    const { min, max } = parsePriceRange(params.price);
    results = results.filter(
      (property) => property.price >= min && (max === null || property.price <= max),
    );
  }

  return results;
}

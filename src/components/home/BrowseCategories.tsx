import { serverApi } from "@/lib/api/server";
import BrowsePropertiesByCategory, {
  type BrowseCategory,
} from "@/components/home/BrowsePropertiesByCategory";

type RawType = {
  slug: string;
  name: string;
  featured?: boolean;
};

/**
 * Fetches the categories the homepage browse strip shows.
 *
 * The strip used to carry eight names written into the component, so adding a
 * property type in admin never reached the homepage and the cards linked
 * nowhere. It now follows whichever types are marked featured.
 */
async function getCategories(): Promise<BrowseCategory[]> {
  try {
    const res = await serverApi<{ data: RawType[] }>("/property-types", 300);

    return res.data
      .filter((type) => type.featured)
      .map((type) => ({ slug: type.slug, name: type.name }));
  } catch {
    return [];
  }
}

export default async function BrowseCategories() {
  const categories = await getCategories();

  // Nothing featured yet: show no strip rather than an empty heading.
  if (categories.length === 0) return null;

  return <BrowsePropertiesByCategory categories={categories} />;
}

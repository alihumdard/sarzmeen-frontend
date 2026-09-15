import type { Metadata } from "next";
import DetailBreadcrumb from "@/components/property/DetailBreadcrumb";
import PropertyDetailHeader from "@/components/property/PropertyDetailHeader";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyPriceBox from "@/components/property/PropertyPriceBox";
import PropertyQuickFacts from "@/components/property/PropertyQuickFacts";
import PropertyTabs from "@/components/property/PropertyTabs";
import SimilarProperties from "@/components/property/SimilarProperties";
import SellRentStrip from "@/components/layout/SellRentStrip";
import { propertyDetail } from "@/constants/mockPropertyDetail";
import { featuredProperties } from "@/constants/mockProperties";

type PropertyDetailPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Looks a property up by slug.
 *
 * Until the API exists every slug resolves to the one mock record, with its
 * headline derived from the slug so different cards read differently.
 */
function getProperty(slug: string) {
  if (slug === propertyDetail.slug) return propertyDetail;

  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return { ...propertyDetail, slug, headline: title };
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);

  return {
    title: property.headline,
    description: property.description,
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = getProperty(slug);

  return (
    <main>
      <DetailBreadcrumb
        backHref="/properties"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: "Houses", href: "/properties?type=house" },
          { label: property.headline },
        ]}
      />

      <section className="bg-white py-7">
        <div className="container-page">
          <PropertyDetailHeader property={property} />

          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
            <PropertyGallery
              images={property.images}
              title={property.title}
              photoCount={property.photoCount}
              featured={property.featured}
              purpose={property.purpose}
            />

            <div className="flex flex-col gap-5">
              <PropertyPriceBox property={property} />
            </div>
          </div>

          <div className="mt-7">
            <PropertyQuickFacts property={property} />
          </div>

          <div className="mt-6">
            <PropertyTabs property={property} />
          </div>
        </div>
      </section>

      <SimilarProperties
        properties={featuredProperties}
        currentSlug={property.slug}
      />

      <SellRentStrip />
    </main>
  );
}

import type { Metadata } from "next";
import DetailBreadcrumb from "@/components/property/DetailBreadcrumb";
import PropertyDetailHeader from "@/components/property/PropertyDetailHeader";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyPriceBox from "@/components/property/PropertyPriceBox";
import PropertyQuickFacts from "@/components/property/PropertyQuickFacts";
import PropertyTabs from "@/components/property/PropertyTabs";
import SimilarProperties from "@/components/property/SimilarProperties";
import SellRentStrip from "@/components/layout/SellRentStrip";
import { rentPropertyDetail } from "@/constants/mockRentPropertyDetail";
import { rentProperties } from "@/constants/mockRentProperties";

type RentDetailPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Looks a rental up by slug.
 *
 * Mirrors the sale detail page: until the API exists every slug resolves to
 * the one mock record, with its headline derived from the slug so different
 * cards read differently.
 */
function getRental(slug: string) {
  if (slug === rentPropertyDetail.slug) return rentPropertyDetail;

  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return { ...rentPropertyDetail, slug, headline: title };
}

export async function generateMetadata({
  params,
}: RentDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const rental = getRental(slug);

  return {
    title: rental.headline,
    description: rental.description,
  };
}

export default async function RentDetailPage({ params }: RentDetailPageProps) {
  const { slug } = await params;
  const rental = getRental(slug);

  return (
    <main>
      <DetailBreadcrumb
        backHref="/rent"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Rent", href: "/rent" },
          { label: "Houses", href: "/rent?type=house" },
          { label: rental.headline },
        ]}
      />

      <section className="bg-white py-7">
        <div className="container-page">
          <PropertyDetailHeader property={rental} />

          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
            <PropertyGallery
              images={rental.images}
              title={rental.title}
              photoCount={rental.photoCount}
              featured={rental.featured}
              statusLabel="For Rent"
            />

            <div className="flex flex-col gap-5">
              <PropertyPriceBox property={rental} />
            </div>
          </div>

          <div className="mt-7">
            <PropertyQuickFacts property={rental} />
          </div>

          <div className="mt-6">
            <PropertyTabs property={rental} />
          </div>
        </div>
      </section>

      <SimilarProperties
        properties={rentProperties}
        currentSlug={rental.slug}
        title="Similar Rentals You May Like"
        viewAllHref="/rent"
        viewAllLabel="View All Rentals"
      />

      <SellRentStrip />
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DetailBreadcrumb from "@/components/property/DetailBreadcrumb";
import PropertyDetailHeader from "@/components/property/PropertyDetailHeader";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyPaymentSummary from "@/components/property/PropertyPaymentSummary";
import PropertyAgentCard from "@/components/property/PropertyAgentCard";
import PropertyInquiryForm from "@/components/property/PropertyInquiryForm";
import PropertyPriceBox from "@/components/property/PropertyPriceBox";
import PropertyQuickFacts from "@/components/property/PropertyQuickFacts";
import PropertyTabs from "@/components/property/PropertyTabs";
import SimilarProperties from "@/components/property/SimilarProperties";
import SellRentStrip from "@/components/layout/SellRentStrip";
import { serverApi } from "@/lib/api/server";
import type { PropertyDetail, Property } from "@/types/property";

type PropertyDetailPageProps = {
  params: Promise<{ slug: string }>;
};

async function getProperty(slug: string): Promise<PropertyDetail> {
  try {
    const res = await serverApi<{ data: PropertyDetail }>(
      `/properties/${slug}`,
    );
    return res.data;
  } catch {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);

  return {
    title: property.headline,
    description: property.description,
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;

  /*
   * Both requests key only on the slug, so they run together rather than one
   * waiting on the other.
   */
  const [property, similarResult] = await Promise.all([
    getProperty(slug),
    serverApi<{ data: Property[] }>(`/properties?per_page=4&featured=1`).catch(
      () => ({ data: [] as Property[] }),
    ),
  ]);

  const similarProperties = similarResult.data.filter((p) => p.slug !== slug);

  return (
    <main>
      <DetailBreadcrumb
        backHref="/properties"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: property.headline },
        ]}
      />

      <section className="bg-white py-7">
        <div className="container-page">
          <PropertyDetailHeader property={property} />

          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0 space-y-6">
              <PropertyGallery
                images={property.images}
                title={property.title}
                photoCount={property.photoCount}
                featured={property.featured}
                /* A rental reached through this route is still a rental. */
                statusLabel={
                  property.purpose === "rent"
                    ? "For Rent"
                    : property.purpose === "installment"
                      ? "On Installments"
                      : "For Sale"
                }
              />

              <PropertyQuickFacts property={property} />

              <PropertyTabs property={property} />
            </div>

            <div className="sticky top-4 flex flex-col gap-4">
              <PropertyPriceBox property={property} />
              {property.purpose === "installment" && property.specs && (
                <PropertyPaymentSummary
                  specs={property.specs}
                  price={property.price}
                />
              )}
              {/* Pre-fills the calculator so the buyer starts from this listing. */}
              <Link
                href={`/calculator?price=${property.price}${
                  property.specs?.unitArea ? `&area=${property.specs.unitArea}` : ""
                }${
                  property.specs?.ratePerSqft ? `&rate=${property.specs.ratePerSqft}` : ""
                }`}
                className="flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary-light py-3 text-[12.5px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Calculate your payment plan
              </Link>

              <PropertyAgentCard agent={property.agent} />
              <PropertyInquiryForm
                propertyId={property.id}
                title={property.title}
              />
            </div>
          </div>
        </div>
      </section>

      <SimilarProperties
        properties={similarProperties}
        currentSlug={property.slug}
      />

      <SellRentStrip />
    </main>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailBreadcrumb from "@/components/property/DetailBreadcrumb";
import PropertyDetailHeader from "@/components/property/PropertyDetailHeader";
import PropertyGallery from "@/components/property/PropertyGallery";
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
  const property = await getProperty(slug);

  let similarProperties: Property[] = [];
  try {
    const res = await serverApi<{ data: Property[] }>(
      `/properties?per_page=4&featured=1`,
    );
    similarProperties = res.data.filter((p) => p.slug !== slug);
  } catch {
    // non-critical
  }

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
            <PropertyGallery
              images={property.images}
              title={property.title}
              photoCount={property.photoCount}
              featured={property.featured}
              statusLabel="For Sale"
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
        properties={similarProperties}
        currentSlug={property.slug}
      />

      <SellRentStrip />
    </main>
  );
}

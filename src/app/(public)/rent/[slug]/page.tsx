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

type RentDetailPageProps = {
  params: Promise<{ slug: string }>;
};

async function getRental(slug: string): Promise<PropertyDetail> {
  try {
    const res = await serverApi<{ data: PropertyDetail }>(`/properties/${slug}`);
    return res.data;
  } catch {
    notFound();
  }
}

export async function generateMetadata({ params }: RentDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const rental = await getRental(slug);
  return {
    title: rental.headline,
    description: rental.description,
  };
}

export default async function RentDetailPage({ params }: RentDetailPageProps) {
  const { slug } = await params;
  const rental = await getRental(slug);

  let similarProperties: Property[] = [];
  try {
    const res = await serverApi<{ data: Property[] }>(`/properties?per_page=4&purpose=rent`);
    similarProperties = res.data.filter((p) => p.slug !== slug);
  } catch {
    // non-critical
  }

  return (
    <main>
      <DetailBreadcrumb
        backHref="/rent"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Rent", href: "/rent" },
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
        properties={similarProperties}
        currentSlug={rental.slug}
        title="Similar Rentals You May Like"
        viewAllHref="/rent"
        viewAllLabel="View All Rentals"
      />

      <SellRentStrip />
    </main>
  );
}

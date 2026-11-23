import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import PropertyCard from "@/components/property/PropertyCard";
import MapViewer from "@/components/society-maps/MapViewer";
import { serverApi } from "@/lib/api/server";
import type { SocietyMap } from "@/types/societyMap";
import type { Property } from "@/types/property";

type MapPayload = {
  data: SocietyMap;
  properties: Property[];
};

async function getMap(slug: string): Promise<MapPayload | null> {
  try {
    return await serverApi<MapPayload>(`/society-maps/${slug}`, 300);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getMap(slug);

  if (!payload) return { title: "Society Map" };

  const map = payload.data;

  return {
    title: map.metaTitle ?? `${map.title} — Sarzameen.com`,
    description:
      map.metaDescription ??
      map.summary ??
      `View and download the ${map.title}.`,
  };
}

export default async function SocietyMapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const payload = await getMap(slug);

  if (!payload) notFound();

  const { data: map, properties } = payload;
  const blogs = map.blogs ?? [];

  return (
    <main className="bg-surface pb-14">
      {/* Breadcrumb, kept small: the map is what the reader came for. */}
      <div className="border-b border-border bg-white">
        <div className="container-page flex flex-wrap items-center gap-1.5 py-3.5 text-[12px] text-muted">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span aria-hidden="true">›</span>
          <Link href="/society-maps" className="hover:text-primary">
            Society Maps
          </Link>
          {map.city && (
            <>
              <span aria-hidden="true">›</span>
              <Link
                href={`/society-maps?city=${map.city.slug}`}
                className="hover:text-primary"
              >
                {map.city.name}
              </Link>
            </>
          )}
          <span aria-hidden="true">›</span>
          <span className="font-semibold text-heading">{map.title}</span>
        </div>
      </div>

      <div className="container-page pt-8">
        <header className="mb-6">
          <h1 className="text-[26px] font-bold leading-tight text-heading sm:text-[32px]">
            {map.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-muted">
            {map.society && (
              <span className="font-semibold text-heading">
                {map.society.name}
              </span>
            )}
            {map.city && <span>{map.city.name}</span>}
            {map.publishedAt && (
              <time dateTime={map.publishedAt}>
                Updated{" "}
                {new Date(map.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </time>
            )}
          </div>

          {map.summary && (
            <p className="mt-3 max-w-3xl text-[13.5px] leading-6 text-text">
              {map.summary}
            </p>
          )}
        </header>

        <MapViewer map={map} />

        {map.description && (
          <section className="mt-10 rounded-2xl border border-border bg-white p-6 sm:p-8">
            {/* The write-up is sanitised HTML from the editor. */}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: map.description }}
            />
          </section>
        )}

        {properties.length > 0 && (
          <section className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-[20px] font-bold text-heading">
                  Properties in {map.society?.name ?? map.title}
                </h2>
                <p className="mt-1 text-[12.5px] text-muted">
                  {properties.length} on the market right now
                </p>
              </div>

              {map.society && (
                <Link
                  href={`/properties?location=${map.society.slug}`}
                  className="shrink-0 text-[12.5px] font-semibold text-primary hover:underline"
                >
                  View all
                </Link>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>
        )}

        {blogs.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 text-[20px] font-bold text-heading">
              Latest updates about {map.society?.name ?? map.title}
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

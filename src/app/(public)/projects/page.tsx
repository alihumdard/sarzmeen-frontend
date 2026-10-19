import type { Metadata } from "next";
import PageBanner from "@/components/layout/PageBanner";
import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectResults from "@/components/project/ProjectResults";
import ProjectSearchBar from "@/components/project/ProjectSearchBar";
import { serverApi } from "@/lib/api/server";
import type { Project } from "@/types/project";

export const metadata: Metadata = {
  title: "Real Estate Projects",
  description:
    "Browse new and ongoing real estate developments across Lahore, Karachi and Islamabad.",
};

type ProjectsPageProps = {
  searchParams: Promise<{
    search?: string;
    city?: string;
    area?: string;
    status?: string;
    category?: string;
    type?: string;
    format?: string;
    payment?: string;
    unit_type?: string;
  }>;
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;

  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.city) qs.set("city", params.city);
  if (params.status) qs.set("status", params.status);
  if (params.type) qs.set("type", params.type);
  if (params.format) qs.set("format", params.format);
  if (params.payment) qs.set("payment", params.payment);
  if (params.unit_type) qs.set("unit_type", params.unit_type);

  /*
   * Area is a society name rather than a slug, so it searches alongside any
   * typed term — the API matches it against the name and full location.
   */
  const terms = [params.search, params.area?.split(",").join(" ")]
    .filter(Boolean)
    .join(" ");
  if (terms) qs.set("search", terms);

  const query = qs.toString();
  const res = await serverApi<{
    data: Project[];
    meta: { total: number };
  }>(`/projects${query ? `?${query}` : ""}`);

  const results = res.data;
  const total = res.meta.total;

  return (
    <main>
      <PageBanner
        title="Real Estate Projects"
        description={`${total.toLocaleString("en-US")} ${total === 1 ? "project" : "projects"} available`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
        contentMaxWidth="720px"
        image="/images/city-lahore-skyline.jpg"
      >
        <ProjectSearchBar initialTerm={params.search} />
      </PageBanner>

      {/* Anchor for the search bar, which scrolls results into view. */}
      <section id="project-results" className="bg-surface py-8 scroll-mt-4">
        <div className="container-page grid items-start gap-6 lg:grid-cols-[250px_1fr]">
          <ProjectFilters />
          <ProjectResults projects={results} total={total} />
        </div>
      </section>
    </main>
  );
}

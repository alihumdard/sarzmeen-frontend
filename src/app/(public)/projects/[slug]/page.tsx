import type { Metadata } from "next";
import SellRentStrip from "@/components/layout/SellRentStrip";
import DetailBreadcrumb from "@/components/property/DetailBreadcrumb";
import PropertyGallery from "@/components/property/PropertyGallery";
import ProjectDetailHeader from "@/components/project/ProjectDetailHeader";
import ProjectPriceBox from "@/components/project/ProjectPriceBox";
import ProjectProperties from "@/components/project/ProjectProperties";
import ProjectQuickFacts from "@/components/project/ProjectQuickFacts";
import ProjectTabs from "@/components/project/ProjectTabs";
import { getProjectDetail } from "@/constants/mockProjects";
import { getPropertiesByProject } from "@/lib/utils/getProjectProperties";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectDetail(slug);

  return {
    title: project.name,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectDetail(slug);
  const properties = getPropertiesByProject(project.slug);

  return (
    <main>
      <DetailBreadcrumb
        backHref="/projects"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: project.name },
        ]}
      />

      <section className="bg-white py-7">
        <div className="container-page">
          <ProjectDetailHeader project={project} />

          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
            <PropertyGallery
              images={project.images}
              title={project.name}
              photoCount={project.images.length}
              featured={project.featured ?? false}
              statusLabel={project.status}
            />

            <div className="flex flex-col gap-5">
              <ProjectPriceBox project={project} />
            </div>
          </div>

          <div className="mt-7">
            <ProjectQuickFacts project={project} />
          </div>

          <div className="mt-6">
            <ProjectTabs project={project} />
          </div>
        </div>
      </section>

      <ProjectProperties properties={properties} projectName={project.name} />

      <SellRentStrip />
    </main>
  );
}

import Link from "next/link";
import ProjectCard from "@/components/project/ProjectCard";
import Carousel from "@/components/ui/Carousel";
import { popularProjects } from "@/constants/mockProjects";

export default function PopularProjects() {
  return (
    <section className="bg-surface py-10 sm:py-12">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-bold text-heading sm:text-[30px]">
              Popular Projects
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Explore new and upcoming projects
            </p>
          </div>

          <Link
            href="/projects"
            className="rounded-md border-2 border-primary px-5 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            View All Projects
          </Link>
        </div>

        <Carousel
          itemCount={popularProjects.length}
          itemsPerPage={4}
          label="projects"
        >
          {popularProjects.map((project) => (
            <div
              key={project.id}
              className="w-[270px] shrink-0 snap-start sm:w-[300px] lg:w-[calc((100%-60px)/4)]"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

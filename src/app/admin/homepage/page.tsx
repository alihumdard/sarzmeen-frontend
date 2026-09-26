"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

type SectionType =
  | "Banner"
  | "Properties"
  | "Projects"
  | "Locations"
  | "Content"
  | "Blogs"
  | "Testimonials"
  | "CTA";

type Section = {
  id: number;
  name: string;
  description: string;
  type: SectionType;
  image: string;
  visible: boolean;
};

const typeBadgeClasses: Record<SectionType, string> = {
  Banner: "bg-gray-100 text-gray-600",
  Properties: "bg-blue-50 text-blue-600",
  Projects: "bg-violet-50 text-violet-600",
  Locations: "bg-blue-50 text-blue-600",
  Content: "bg-gray-100 text-gray-600",
  Blogs: "bg-amber-50 text-amber-600",
  Testimonials: "bg-emerald-50 text-emerald-600",
  CTA: "bg-red-50 text-red-500",
};

const initialSections: Section[] = [
  {
    id: 1,
    name: "Hero Banner",
    description: "Main banner with search",
    type: "Banner",
    image: "/images/hero-bg.jpg",
    visible: true,
  },
  {
    id: 2,
    name: "Featured Properties",
    description: "Showcase latest properties",
    type: "Properties",
    image: "/images/property-1.jpg",
    visible: true,
  },
  {
    id: 3,
    name: "Explore Projects",
    description: "Featured real estate projects",
    type: "Projects",
    image: "/images/project-1.jpg",
    visible: true,
  },
  {
    id: 4,
    name: "Popular Locations",
    description: "Top cities and areas",
    type: "Locations",
    image: "/images/city-1.jpg",
    visible: true,
  },
  {
    id: 5,
    name: "Why Choose Sarzameen",
    description: "Platform highlights",
    type: "Content",
    image: "/images/interior-1.jpg",
    visible: true,
  },
  {
    id: 6,
    name: "Latest Blogs",
    description: "Recent articles and news",
    type: "Blogs",
    image: "/images/blog-1.jpg",
    visible: true,
  },
  {
    id: 7,
    name: "Testimonials",
    description: "Client reviews and feedback",
    type: "Testimonials",
    image: "/images/team-1.jpg",
    visible: true,
  },
  {
    id: 8,
    name: "Newsletter CTA",
    description: "Subscribe for updates",
    type: "CTA",
    image: "/images/city-1.jpg",
    visible: false,
  },
];

const previewProperties = [
  {
    id: 1,
    tag: "For Sale",
    price: "PKR 2.5 Crore",
    title: "5 Marla House",
    location: "DHA Lahore",
    image: "/images/property-1.jpg",
  },
  {
    id: 2,
    tag: "For Rent",
    price: "PKR 85,000/month",
    title: "Apartment",
    location: "Bahria Town Karachi",
    image: "/images/interior-1.jpg",
  },
  {
    id: 3,
    tag: "For Sale",
    price: "PKR 1.8 Crore",
    title: "Plot",
    location: "Islamabad",
    image: "/images/city-1.jpg",
  },
  {
    id: 4,
    tag: "For Sale",
    price: "PKR 3.2 Crore",
    title: "10 Marla House",
    location: "Gulberg Lahore",
    image: "/images/project-1.jpg",
  },
];

export default function HomepageCmsPage() {
  const [sections, setSections] = useState(initialSections);
  const [selected, setSelected] = useState<number[]>([]);
  const [dragId, setDragId] = useState<number | null>(null);

  const toggleVisible = (id: number) => {
    setSections((current) =>
      current.map((section) =>
        section.id === id ? { ...section, visible: !section.visible } : section,
      ),
    );
  };

  const deleteSection = (id: number) => {
    setSections((current) => current.filter((section) => section.id !== id));
  };

  const toggleSelected = (id: number) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const allSelected = sections.length > 0 && sections.every((s) => selected.includes(s.id));

  const toggleSelectAll = () => {
    setSelected(allSelected ? [] : sections.map((s) => s.id));
  };

  const handleDrop = (targetId: number) => {
    if (dragId === null || dragId === targetId) return;

    setSections((current) => {
      const list = [...current];
      const fromIndex = list.findIndex((s) => s.id === dragId);
      const toIndex = list.findIndex((s) => s.id === targetId);
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return list;
    });

    setDragId(null);
  };

  const publishedCount = sections.filter((s) => s.visible).length;
  const draftCount = sections.length - publishedCount;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Homepage CMS"
        description="Manage your homepage content, sections and visibility. Drag to reorder sections."
        breadcrumbs={[
          { label: "Content Management" },
          { label: "Homepage CMS" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              <ExternalLinkIcon />
              View Live Site
            </Link>

            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <SaveIcon />
              Save Changes
            </button>
          </div>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Total Sections"
          value={sections.length}
          hint="Manage homepage sections"
          icon={<LayersIcon />}
          iconClassName="bg-primary/10 text-primary"
        />
        <SummaryCard
          label="Published"
          value={publishedCount}
          hint="Visible on homepage"
          hintIcon={<DotIcon className="text-emerald-500" />}
          icon={<EyeIcon />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <SummaryCard
          label="Draft"
          value={draftCount}
          hint="Not visible yet"
          icon={<ClockIcon />}
          iconClassName="bg-amber-50 text-amber-600"
        />
        <SummaryCard
          label="Last Updated"
          value="May 20, 2024"
          hint="by Admin"
          icon={<EditNoteIcon />}
          iconClassName="bg-violet-50 text-violet-600"
        />
      </section>

      {/* Sections + Preview */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
        {/* Sections table */}
        <div className="min-w-0 rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[14px] font-semibold text-gray-800">
                Homepage Sections
              </h2>
              <p className="mt-0.5 text-[11px] text-gray-400">
                Drag and drop to reorder sections. Toggle to show/hide sections on homepage.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              <PlusIcon />
              Add Section
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="w-9 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/40"
                    />
                  </th>
                  <th className="w-10 px-2 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    #
                  </th>
                  <th className="px-2 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Section Name
                  </th>
                  <th className="px-2 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Type
                  </th>
                  <th className="px-2 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {sections.map((section, index) => (
                  <tr
                    key={section.id}
                    draggable
                    onDragStart={() => setDragId(section.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDrop(section.id)}
                    className={[
                      "transition-colors hover:bg-gray-50/70",
                      dragId === section.id ? "opacity-50" : "",
                    ].join(" ")}
                  >
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selected.includes(section.id)}
                        onChange={() => toggleSelected(section.id)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/40"
                      />
                    </td>

                    <td className="cursor-grab px-2 py-3.5 text-gray-400 active:cursor-grabbing">
                      <div className="flex items-center gap-1.5">
                        <DragHandleIcon />
                        <span>{index + 1}</span>
                      </div>
                    </td>

                    <td className="px-2 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <Image
                            src={section.image}
                            alt={section.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-semibold text-gray-800">
                            {section.name}
                          </p>
                          <p className="mt-0.5 truncate text-[10px] text-gray-400">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-2 py-3.5">
                      <span
                        className={[
                          "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium",
                          typeBadgeClasses[section.type],
                        ].join(" ")}
                      >
                        {section.type}
                      </span>
                    </td>

                    <td className="px-2 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={section.visible}
                          aria-label={
                            section.visible ? "Hide section" : "Show section"
                          }
                          onClick={() => toggleVisible(section.id)}
                          className={[
                            "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                            section.visible ? "bg-primary" : "bg-gray-200",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                              section.visible ? "translate-x-[18px]" : "translate-x-0.5",
                            ].join(" ")}
                          />
                        </button>

                        {!section.visible && (
                          <span className="whitespace-nowrap rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-600">
                            Draft
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          aria-label="Edit section"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          <EditIcon />
                        </button>

                        <button
                          type="button"
                          aria-label="Section settings"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        >
                          <SettingsIcon />
                        </button>

                        <button
                          type="button"
                          aria-label="Delete section"
                          onClick={() => deleteSection(section.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50"
                        >
                          <TrashIcon />
                        </button>

                        <button
                          type="button"
                          aria-label="More actions"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        >
                          <MoreIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live preview */}
        <div className="min-w-0 rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-[14px] font-semibold text-gray-800">
                Homepage Preview
              </h2>
              <p className="mt-0.5 text-[11px] text-gray-400">
                Live preview of your homepage with current content.
              </p>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-[10px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              <ExternalLinkIcon />
              Open in New Tab
            </Link>
          </div>

          <div className="overflow-hidden rounded-b-lg">
            {/* Mini header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <Image
                  src="/logos/sarzmeen-icon.png"
                  alt="Sarzameen"
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] object-contain"
                />
                <span className="text-[11px] font-bold tracking-tight text-gray-900">
                  SARZAMEEN
                </span>
              </div>

              <div className="hidden items-center gap-3 text-[9px] font-medium text-gray-500 sm:flex">
                <span>Buy</span>
                <span>Rent</span>
                <span>Projects</span>
                <span>Blog</span>
                <span>Locations</span>
                <span>About</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="rounded-md bg-primary px-2 py-1 text-[9px] font-semibold text-white">
                  Add Property
                </span>
              </div>
            </div>

            {/* Mini hero */}
            <div className="relative h-[220px] w-full overflow-hidden bg-[#031c20]">
              <Image
                src="/images/hero-bg.jpg"
                alt="Homepage hero"
                fill
                sizes="480px"
                className="object-cover opacity-60"
              />

              <div className="absolute inset-0 flex flex-col justify-center gap-2 px-4">
                <span className="w-fit rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white">
                  Find • Invest • Grow
                </span>

                <h3 className="max-w-[220px] text-[18px] font-bold leading-tight text-white">
                  Find Your Dream Property in Pakistan
                </h3>

                <p className="max-w-[220px] text-[9px] leading-4 text-white/70">
                  Explore thousands of verified properties, projects and
                  investment opportunities across Pakistan.
                </p>

                <div className="mt-1 flex w-fit items-center gap-1 rounded-md bg-white/95 p-1.5">
                  <span className="rounded bg-gray-100 px-2 py-1 text-[8px] text-gray-500">
                    Property Type
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-1 text-[8px] text-gray-500">
                    City
                  </span>
                  <span className="rounded bg-primary px-2.5 py-1 text-[8px] font-semibold text-white">
                    Search
                  </span>
                </div>
              </div>
            </div>

            {/* Mini featured properties */}
            <div className="px-4 py-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-semibold text-gray-800">
                  Featured Properties
                </p>
                <span className="text-[9px] font-medium text-primary">
                  View All →
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {previewProperties.map((property) => (
                  <div
                    key={property.id}
                    className="overflow-hidden rounded-md border border-gray-100"
                  >
                    <div className="relative h-16 w-full">
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        sizes="140px"
                        className="object-cover"
                      />
                      <span
                        className={[
                          "absolute left-1 top-1 rounded px-1.5 py-0.5 text-[7px] font-semibold text-white",
                          property.tag === "For Sale" ? "bg-emerald-600" : "bg-blue-600",
                        ].join(" ")}
                      >
                        {property.tag}
                      </span>
                    </div>

                    <div className="p-1.5">
                      <p className="text-[8.5px] font-bold text-gray-800">
                        {property.price}
                      </p>
                      <p className="truncate text-[8px] text-gray-500">
                        {property.title}
                      </p>
                      <p className="truncate text-[7.5px] text-gray-400">
                        {property.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  hint,
  hintIcon,
  icon,
  iconClassName,
}: {
  label: string;
  value: string | number;
  hint?: string;
  hintIcon?: React.ReactNode;
  icon: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <span
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
          iconClassName ?? "bg-primary/10 text-primary",
        ].join(" ")}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p className="truncate text-[11px] text-gray-500">{label}</p>
        <p className="mt-0.5 truncate text-[17px] font-bold leading-none text-gray-900">
          {value}
        </p>
        {hint && (
          <p className="mt-1.5 flex items-center gap-1 text-[9px] text-gray-400">
            {hintIcon}
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

function DotIcon({ className = "" }: { className?: string }) {
  return <span className={["h-1.5 w-1.5 rounded-full bg-current", className].join(" ")} />;
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function EditNoteIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-2.8-2.8L5.4 16.2 4 20Z" />
      <path d="m14.5 6.5 3 3" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h6v6" />
      <path d="M10 14 20 4" />
      <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M8 4v5h7V4M8 20v-6h8v6" />
    </svg>
  );
}

function DragHandleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="6" r="1.4" />
      <circle cx="15" cy="6" r="1.4" />
      <circle cx="9" cy="12" r="1.4" />
      <circle cx="15" cy="12" r="1.4" />
      <circle cx="9" cy="18" r="1.4" />
      <circle cx="15" cy="18" r="1.4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-2.8-2.8L5.4 16.2 4 20Z" />
      <path d="m14.5 6.5 3 3" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1H15V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.6H21a1.7 1.7 0 0 0-1.6 1Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

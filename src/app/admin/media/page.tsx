"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPagination from "@/components/admin/AdminPagination";

type MediaType = "image" | "document" | "video";

type MediaFile = {
  id: number;
  name: string;
  type: MediaType;
  size: string;
  date: string;
  dateFull: string;
  folder: string;
  image?: string;
  dimensions?: string;
  uploadedBy: string;
  url: string;
  tags: string[];
};

const folders = [
  { id: "all", label: "All Media", count: 1248 },
  { id: "property", label: "Property Images", count: 420 },
  { id: "project", label: "Project Images", count: 280 },
  { id: "blog", label: "Blog Images", count: 180 },
  { id: "team", label: "Team Members", count: 32 },
  { id: "logos", label: "Logos & Banners", count: 46 },
  { id: "documents", label: "Documents", count: 156 },
  { id: "videos", label: "Videos", count: 112 },
  { id: "others", label: "Others", count: 22 },
];

const files: MediaFile[] = [
  {
    id: 1,
    name: "house-01.jpg",
    type: "image",
    size: "1.2 MB",
    date: "May 20, 2024",
    dateFull: "May 20, 2024, 10:30 AM",
    folder: "property",
    image: "/images/property-1.jpg",
    dimensions: "1920 × 1280",
    uploadedBy: "Admin",
    url: "https://sarzameen.com/media/house-01.jpg",
    tags: ["house", "modern", "exterior", "lahore"],
  },
  {
    id: 2,
    name: "interior-01.jpg",
    type: "image",
    size: "980 KB",
    date: "May 20, 2024",
    dateFull: "May 20, 2024, 09:50 AM",
    folder: "property",
    image: "/images/interior-1.jpg",
    dimensions: "1600 × 1067",
    uploadedBy: "Admin",
    url: "https://sarzameen.com/media/interior-01.jpg",
    tags: ["interior", "living room"],
  },
  {
    id: 3,
    name: "lahore-skyline.jpg",
    type: "image",
    size: "1.5 MB",
    date: "May 19, 2024",
    dateFull: "May 19, 2024, 04:15 PM",
    folder: "others",
    image: "/images/city-1.jpg",
    dimensions: "2048 × 1365",
    uploadedBy: "Admin",
    url: "https://sarzameen.com/media/lahore-skyline.jpg",
    tags: ["lahore", "skyline", "city"],
  },
  {
    id: 4,
    name: "dha-lahore.jpg",
    type: "image",
    size: "1.1 MB",
    date: "May 19, 2024",
    dateFull: "May 19, 2024, 01:20 PM",
    folder: "project",
    image: "/images/project-1.jpg",
    dimensions: "1920 × 1280",
    uploadedBy: "Ahmed Khan",
    url: "https://sarzameen.com/media/dha-lahore.jpg",
    tags: ["dha", "project", "lahore"],
  },
  {
    id: 5,
    name: "bahria-town.jpg",
    type: "image",
    size: "1.3 MB",
    date: "May 18, 2024",
    dateFull: "May 18, 2024, 11:05 AM",
    folder: "property",
    image: "/images/property-1.jpg",
    dimensions: "1920 × 1280",
    uploadedBy: "Admin",
    url: "https://sarzameen.com/media/bahria-town.jpg",
    tags: ["bahria town", "house"],
  },
  {
    id: 6,
    name: "bedroom.jpg",
    type: "image",
    size: "850 KB",
    date: "May 18, 2024",
    dateFull: "May 18, 2024, 10:40 AM",
    folder: "property",
    image: "/images/interior-1.jpg",
    dimensions: "1600 × 1067",
    uploadedBy: "Admin",
    url: "https://sarzameen.com/media/bedroom.jpg",
    tags: ["interior", "bedroom"],
  },
  {
    id: 7,
    name: "kitchen.jpg",
    type: "image",
    size: "920 KB",
    date: "May 17, 2024",
    dateFull: "May 17, 2024, 03:30 PM",
    folder: "property",
    image: "/images/interior-1.jpg",
    dimensions: "1600 × 1067",
    uploadedBy: "Sara Malik",
    url: "https://sarzameen.com/media/kitchen.jpg",
    tags: ["interior", "kitchen"],
  },
  {
    id: 8,
    name: "islamabad.jpg",
    type: "image",
    size: "1.4 MB",
    date: "May 17, 2024",
    dateFull: "May 17, 2024, 09:10 AM",
    folder: "others",
    image: "/images/city-1.jpg",
    dimensions: "2048 × 1365",
    uploadedBy: "Admin",
    url: "https://sarzameen.com/media/islamabad.jpg",
    tags: ["islamabad", "city"],
  },
  {
    id: 9,
    name: "floor-plan.png",
    type: "document",
    size: "650 KB",
    date: "May 16, 2024",
    dateFull: "May 16, 2024, 02:00 PM",
    folder: "documents",
    uploadedBy: "Admin",
    url: "https://sarzameen.com/media/floor-plan.png",
    tags: ["floor plan"],
  },
  {
    id: 10,
    name: "sarzameen-logo.png",
    type: "image",
    size: "320 KB",
    date: "May 16, 2024",
    dateFull: "May 16, 2024, 11:15 AM",
    folder: "logos",
    uploadedBy: "Admin",
    url: "https://sarzameen.com/media/sarzameen-logo.png",
    tags: ["logo", "brand"],
  },
  {
    id: 11,
    name: "project-brochure.pdf",
    type: "document",
    size: "2.4 MB",
    date: "May 15, 2024",
    dateFull: "May 15, 2024, 05:45 PM",
    folder: "documents",
    uploadedBy: "Admin",
    url: "https://sarzameen.com/media/project-brochure.pdf",
    tags: ["brochure", "pdf"],
  },
  {
    id: 12,
    name: "project-video.mp4",
    type: "video",
    size: "12.5 MB",
    date: "May 15, 2024",
    dateFull: "May 15, 2024, 05:00 PM",
    folder: "videos",
    image: "/images/project-1.jpg",
    uploadedBy: "Admin",
    url: "https://sarzameen.com/media/project-video.mp4",
    tags: ["video", "project"],
  },
];

export default function MediaPage() {
  const [activeFolder, setActiveFolder] = useState("all");
  const [search, setSearch] = useState("");
  const [fileType, setFileType] = useState("");
  const [sort, setSort] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<number[]>([]);
  const [activeFile, setActiveFile] = useState<MediaFile | null>(files[0]);
  const [page, setPage] = useState(1);

  const itemsPerPage = 12;

  const filteredFiles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return files.filter((file) => {
      const matchesFolder = activeFolder === "all" || file.folder === activeFolder;
      const matchesSearch =
        !query ||
        file.name.toLowerCase().includes(query) ||
        file.tags.some((tag) => tag.toLowerCase().includes(query));
      const matchesType = !fileType || file.type === fileType;

      return matchesFolder && matchesSearch && matchesType;
    });
  }, [activeFolder, search, fileType]);

  const sortedFiles = useMemo(() => {
    const list = [...filteredFiles];
    if (sort === "name") {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [filteredFiles, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedFiles.length / itemsPerPage));

  const paginatedFiles = sortedFiles.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const toggleSelected = (id: number) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const clearSelection = () => setSelected([]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media Library"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Media Library" },
          { label: "All Media" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              <FolderPlusIcon />
              Create Folder
            </button>

            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <PlusIcon />
              Upload Media
            </button>
          </div>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Total Files"
          value="1,248"
          trend="+12.5%"
          icon={<FileIcon />}
          iconClassName="bg-primary/10 text-primary"
        />
        <SummaryCard
          label="Images"
          value="980"
          trend="+15.3%"
          icon={<ImageIcon />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <SummaryCard
          label="Documents"
          value="156"
          trend="+8.7%"
          icon={<DocumentIcon />}
          iconClassName="bg-violet-50 text-violet-600"
        />
        <SummaryCard
          label="Videos"
          value="112"
          trend="+22.1%"
          icon={<VideoIcon />}
          iconClassName="bg-red-50 text-red-600"
        />
      </section>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1 xl:max-w-[320px]">
          <SearchIcon />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search files by name, type or tags..."
            className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={fileType}
            onChange={(event) => {
              setFileType(event.target.value);
              setPage(1);
            }}
            className="h-10 min-w-[130px] rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none transition-colors focus:border-primary"
          >
            <option value="">All File Types</option>
            <option value="image">Images</option>
            <option value="document">Documents</option>
            <option value="video">Videos</option>
          </select>

          <select
            value={activeFolder}
            onChange={(event) => {
              setActiveFolder(event.target.value);
              setPage(1);
            }}
            className="h-10 min-w-[130px] rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none transition-colors focus:border-primary"
          >
            <option value="all">All Folders</option>
            {folders
              .filter((folder) => folder.id !== "all")
              .map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.label}
                </option>
              ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-10 min-w-[140px] rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none transition-colors focus:border-primary"
          >
            <option value="newest">Sort by Newest</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        <div className="flex shrink-0 items-center gap-2 xl:ml-auto">
          <div className="flex h-10 items-center gap-0.5 rounded-md border border-gray-200 bg-white p-1">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setViewMode("grid")}
              className={[
                "flex h-7 w-7 items-center justify-center rounded transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-gray-700",
              ].join(" ")}
            >
              <GridIcon />
            </button>

            <button
              type="button"
              aria-label="List view"
              onClick={() => setViewMode("list")}
              className={[
                "flex h-7 w-7 items-center justify-center rounded transition-colors",
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-gray-700",
              ].join(" ")}
            >
              <ListIcon />
            </button>
          </div>

          <button
            type="button"
            disabled={selected.length === 0}
            className={[
              "inline-flex h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-[11px] font-semibold transition-colors",
              selected.length === 0
                ? "cursor-not-allowed text-gray-300"
                : "text-gray-700 hover:border-primary hover:text-primary",
            ].join(" ")}
          >
            Select
            <ChevronDownIcon />
          </button>

          <button
            type="button"
            disabled={selected.length === 0}
            onClick={clearSelection}
            aria-label="Delete selected"
            className={[
              "flex h-10 w-10 items-center justify-center rounded-md border transition-colors",
              selected.length === 0
                ? "cursor-not-allowed border-gray-200 text-gray-300"
                : "border-red-200 bg-red-50 text-red-500 hover:bg-red-100",
            ].join(" ")}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Main layout: folders + grid + detail */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[220px_1fr_320px]">
        {/* Folders sidebar */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
            <h2 className="text-[13px] font-semibold text-gray-800">Folders</h2>
            <button
              type="button"
              aria-label="Add folder"
              className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary"
            >
              <PlusIcon />
            </button>
          </div>

          <div className="space-y-1 p-2">
            {folders.map((folder) => (
              <button
                key={folder.id}
                type="button"
                onClick={() => {
                  setActiveFolder(folder.id);
                  setPage(1);
                }}
                className={[
                  "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12px] transition-colors",
                  activeFolder === folder.id
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-gray-600 hover:bg-gray-50",
                ].join(" ")}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <FolderIcon />
                  <span className="truncate">{folder.label}</span>
                </span>
                <span className="shrink-0 text-[10px] text-gray-400">
                  {folder.count}
                </span>
              </button>
            ))}

            <div className="my-1 border-t border-gray-100" />

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12px] text-gray-500 transition-colors hover:bg-gray-50"
            >
              <span className="flex items-center gap-2">
                <TrashIcon />
                Trash
              </span>
              <span className="text-[10px] text-gray-400">8</span>
            </button>
          </div>
        </div>

        {/* Media grid */}
        <div className="min-w-0 space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {paginatedFiles.map((file) => (
                <MediaCard
                  key={file.id}
                  file={file}
                  selected={selected.includes(file.id)}
                  active={activeFile?.id === file.id}
                  onToggleSelect={() => toggleSelected(file.id)}
                  onOpen={() => setActiveFile(file)}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="w-9 px-4 py-3" />
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedFiles.map((file) => (
                    <tr
                      key={file.id}
                      onClick={() => setActiveFile(file)}
                      className={[
                        "cursor-pointer transition-colors hover:bg-gray-50/70",
                        activeFile?.id === file.id ? "bg-primary/5" : "",
                      ].join(" ")}
                    >
                      <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.includes(file.id)}
                          onChange={() => toggleSelected(file.id)}
                          className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/40"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                            {file.image ? (
                              <Image
                                src={file.image}
                                alt={file.name}
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            ) : (
                              <FileTypeIcon type={file.type} />
                            )}
                          </div>
                          <span className="truncate text-[12px] font-medium text-gray-700">
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-gray-500">
                        {file.size}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-gray-400">
                        {file.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <AdminPagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={sortedFiles.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
          />
        </div>

        {/* Detail panel */}
        <div className="xl:sticky xl:top-20 xl:self-start">
          {activeFile ? (
            <FileDetailPanel
              file={activeFile}
              onClose={() => setActiveFile(null)}
            />
          ) : (
            <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white text-center text-[12px] text-gray-400">
              Select a file to preview details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MediaCard({
  file,
  selected,
  active,
  onToggleSelect,
  onOpen,
}: {
  file: MediaFile;
  selected: boolean;
  active: boolean;
  onToggleSelect: () => void;
  onOpen: () => void;
}) {
  return (
    <div
      onClick={onOpen}
      className={[
        "group relative cursor-pointer overflow-hidden rounded-lg border bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all",
        active ? "border-primary ring-1 ring-primary/30" : "border-gray-200 hover:border-primary/40",
      ].join(" ")}
    >
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        {file.image ? (
          <Image
            src={file.image}
            alt={file.name}
            fill
            sizes="220px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FileTypeIcon type={file.type} large />
          </div>
        )}

        {file.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-800">
              <PlayIcon />
            </span>
          </div>
        )}

        <input
          type="checkbox"
          checked={selected}
          onClick={(event) => event.stopPropagation()}
          onChange={onToggleSelect}
          className="absolute left-2 top-2 h-4 w-4 rounded border-gray-300 bg-white text-primary shadow focus:ring-primary/40"
        />

        <button
          type="button"
          aria-label="More actions"
          onClick={(event) => event.stopPropagation()}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-gray-500 opacity-0 shadow transition-opacity group-hover:opacity-100"
        >
          <MoreIcon />
        </button>
      </div>

      <div className="p-2.5">
        <p className="truncate text-[11px] font-medium text-gray-700">
          {file.name}
        </p>
        <p className="mt-0.5 text-[9px] text-gray-400">
          {file.size} • {file.date}
        </p>
      </div>
    </div>
  );
}

function FileDetailPanel({
  file,
  onClose,
}: {
  file: MediaFile;
  onClose: () => void;
}) {
  const [tags, setTags] = useState(file.tags);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        {file.image ? (
          <Image
            src={file.image}
            alt={file.name}
            fill
            sizes="320px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FileTypeIcon type={file.type} large />
          </div>
        )}

        <button
          type="button"
          aria-label="Close preview"
          onClick={onClose}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-white"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="p-4">
        <h3 className="truncate text-[13px] font-semibold text-gray-800">
          {file.name}
        </h3>
        <p className="mt-0.5 text-[10px] text-gray-400">
          {file.size} • {file.dateFull}
        </p>

        <dl className="mt-4 space-y-2.5 border-t border-gray-100 pt-4 text-[11px]">
          <div className="flex items-center justify-between">
            <dt className="text-gray-400">File Type</dt>
            <dd className="font-medium text-gray-700">
              {file.type === "image"
                ? "Image (JPG)"
                : file.type === "video"
                  ? "Video (MP4)"
                  : "Document"}
            </dd>
          </div>

          {file.dimensions && (
            <div className="flex items-center justify-between">
              <dt className="text-gray-400">Dimensions</dt>
              <dd className="font-medium text-gray-700">{file.dimensions}</dd>
            </div>
          )}

          <div className="flex items-center justify-between">
            <dt className="text-gray-400">Uploaded By</dt>
            <dd className="font-medium text-gray-700">{file.uploadedBy}</dd>
          </div>

          <div className="flex items-center justify-between gap-3">
            <dt className="shrink-0 text-gray-400">Folder</dt>
            <dd className="flex items-center gap-1.5 truncate font-medium text-gray-700">
              <FolderIcon />
              {folders.find((f) => f.id === file.folder)?.label ?? "—"}
            </dd>
          </div>
        </dl>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="mb-1.5 text-[10px] font-medium text-gray-400">URL</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={file.url}
              className="h-8 w-full min-w-0 rounded-md border border-gray-200 bg-gray-50 px-2 text-[10px] text-gray-500 outline-none"
            />
            <button
              type="button"
              aria-label="Copy URL"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
            >
              <CopyIcon />
            </button>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="mb-2 text-[10px] font-medium text-gray-400">Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-600"
              >
                {tag}
                <button
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  onClick={() =>
                    setTags((current) => current.filter((t) => t !== tag))
                  }
                  className="text-gray-400 hover:text-gray-700"
                >
                  <SmallCloseIcon />
                </button>
              </span>
            ))}

            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-2.5 py-1 text-[10px] font-medium text-gray-500 transition-colors hover:border-primary hover:text-primary"
            >
              <PlusIcon />
              Add Tag
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-primary text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <DownloadIcon />
            Download
          </button>

          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-gray-200 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
          >
            <EditIcon />
            Edit
          </button>

          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-red-200 bg-red-50 text-[11px] font-semibold text-red-500 transition-colors hover:bg-red-100"
          >
            <TrashIcon />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  trend,
  icon,
  iconClassName,
}: {
  label: string;
  value: string;
  trend: string;
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
        <p className="mt-0.5 text-[19px] font-bold leading-none text-gray-900">
          {value}
        </p>
        <p className="mt-1.5 text-[9px] font-medium text-emerald-600">
          ↑ {trend}
          <span className="ml-1 font-normal text-gray-400">
            from last month
          </span>
        </p>
      </div>
    </div>
  );
}

function FileTypeIcon({ type, large }: { type: MediaType; large?: boolean }) {
  const size = large ? "h-12 w-12" : "h-6 w-6";

  if (type === "document") {
    return (
      <svg className={[size, "text-red-400"].join(" ")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2h9l3 3v17H6z" />
        <path d="M15 2v3h3" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    );
  }

  if (type === "video") {
    return (
      <svg className={[size, "text-violet-400"].join(" ")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="5" width="19" height="14" rx="2" />
        <path d="m10 9 5 3-5 3V9Z" />
      </svg>
    );
  }

  return (
    <svg className={[size, "text-gray-300"].join(" ")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m4 17 5-5 4 4 3-3 4 4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function FolderPlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6.5a1.5 1.5 0 0 1 1.5-1.5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18Z" />
      <path d="M12 12v4M10 14h4" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6.5a1.5 1.5 0 0 1 1.5-1.5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18Z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2h9l3 3v17H6z" />
      <path d="M15 2v3h3" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m4 17 5-5 4 4 3-3 4 4" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2h9l3 3v17H6z" />
      <path d="M15 2v3h3" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m10 9 5 3-5 3V9Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10.8" cy="10.8" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
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

function PlayIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function SmallCloseIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
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

function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  );
}

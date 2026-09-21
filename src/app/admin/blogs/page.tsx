"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminTable, {
  AdminTableColumn,
} from "@/components/admin/AdminTable";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminActionMenu from "@/components/admin/AdminActionMenu";
import StatusBadge from "@/components/admin/StatusBadge";

type BlogStatus = "Published" | "Draft" | "Pending" | "Expired";

type Blog = {
  id: number;
  title: string;
  category: string;
  author: string;
  status: BlogStatus;
  featured: boolean;
  views: number;
  date: string;
  image: string;
};

const initialBlogs: Blog[] = [
  {
    id: 1,
    title: "Real Estate Market Trends in Pakistan 2024",
    category: "Market Trends",
    author: "Usman Tariq",
    status: "Published",
    featured: true,
    views: 2450,
    date: "May 20, 2024 10:30 AM",
    image: "/images/city-1.jpg",
  },
  {
    id: 2,
    title: "Top 10 Investment Areas in Lahore",
    category: "Investment",
    author: "Ayesha Malik",
    status: "Published",
    featured: false,
    views: 1890,
    date: "May 19, 2024 09:15 AM",
    image: "/images/city-1.jpg",
  },
  {
    id: 3,
    title: "How to Buy Property in Pakistan (Complete Guide)",
    category: "Buying Guide",
    author: "Fahad Hassan",
    status: "Published",
    featured: true,
    views: 3560,
    date: "May 18, 2024 05:40 PM",
    image: "/images/interior-1.jpg",
  },
  {
    id: 4,
    title: "Commercial vs Residential Property Investment",
    category: "Investment",
    author: "Usman Tariq",
    status: "Pending",
    featured: false,
    views: 980,
    date: "May 18, 2024 11:10 AM",
    image: "/images/property-1.jpg",
  },
  {
    id: 5,
    title: "Tips for First-Time Home Buyers",
    category: "Buying Guide",
    author: "Sana Khan",
    status: "Published",
    featured: false,
    views: 1250,
    date: "May 17, 2024 10:00 AM",
    image: "/images/interior-1.jpg",
  },
  {
    id: 6,
    title: "Best Housing Societies in Islamabad",
    category: "Islamabad",
    author: "Ayesha Malik",
    status: "Draft",
    featured: false,
    views: 450,
    date: "May 18, 2024 03:45 PM",
    image: "/images/city-1.jpg",
  },
  {
    id: 7,
    title: "A Complete Guide to Property Taxes in Pakistan",
    category: "Guides",
    author: "Fahad Hassan",
    status: "Published",
    featured: true,
    views: 1670,
    date: "May 16, 2024 02:00 PM",
    image: "/images/property-1.jpg",
  },
  {
    id: 8,
    title: "Understanding NOC: Everything You Need to Know",
    category: "Guides",
    author: "Usman Tariq",
    status: "Expired",
    featured: false,
    views: 760,
    date: "May 15, 2024 04:20 PM",
    image: "/images/interior-1.jpg",
  },
  {
    id: 9,
    title: "5 Marla vs 10 Marla: Which is a Better Investment?",
    category: "Market Trends",
    author: "Sana Khan",
    status: "Published",
    featured: false,
    views: 1120,
    date: "May 14, 2024 09:30 AM",
    image: "/images/city-1.jpg",
  },
  {
    id: 10,
    title: "How to Sell Your Property Fast in Pakistan",
    category: "Selling Guide",
    author: "Fahad Hassan",
    status: "Published",
    featured: true,
    views: 980,
    date: "May 13, 2024 11:20 AM",
    image: "/images/property-1.jpg",
  },
];

const popularBlogs = [
  { id: 1, title: "Real Estate Market Trends in Pakistan 2024", views: "2,450", image: "/images/city-1.jpg" },
  { id: 2, title: "How to Buy Property in Pakistan (Complete Guide)", views: "3,560", image: "/images/interior-1.jpg" },
  { id: 3, title: "Top 10 Investment Areas in Lahore", views: "3,560", image: "/images/city-1.jpg" },
  { id: 4, title: "Best Housing Societies in Islamabad", views: "1,670", image: "/images/city-1.jpg" },
  { id: 5, title: "Commercial vs Residential Property Investment", views: "980", image: "/images/property-1.jpg" },
];

const recentDrafts = [
  { id: 1, title: "Future of Real Estate in Pakistan", date: "May 20, 2024" },
  { id: 2, title: "Property Documents Checklist for Buyers", date: "May 19, 2024" },
  { id: 3, title: "Best Time to Buy Property in Pakistan", date: "May 18, 2024" },
  { id: 4, title: "Rental vs Buying: Which is Better?", date: "May 17, 2024" },
  { id: 5, title: "How Overseas Pakistanis Can Invest in Property", date: "May 16, 2024" },
];

const categoryBreakdown = [
  { label: "Market Trends", value: 15.2, count: 28, color: "#1f7a4d" },
  { label: "Investment", value: 17.4, count: 32, color: "#2563eb" },
  { label: "Buying Guide", value: 16.3, count: 30, color: "#f97316" },
  { label: "Guides", value: 14.1, count: 26, color: "#8b5cf6" },
  { label: "Islamabad", value: 12.0, count: 22, color: "#9ca3af" },
  { label: "Others", value: 25.0, count: 46, color: "#d1d5db" },
];

export default function BlogsManagementPage() {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selected, setSelected] = useState<number[]>([]);

  const itemsPerPage = 10;

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesSearch =
        !query ||
        blog.title.toLowerCase().includes(query) ||
        blog.author.toLowerCase().includes(query) ||
        blog.category.toLowerCase().includes(query);

      const matchesStatus = !status || blog.status === status;
      const matchesCategory = !category || blog.category === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [blogs, search, status, category]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / itemsPerPage),
  );

  const paginatedBlogs = filteredBlogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setCategory("");
    setPage(1);
  };

  const deleteBlog = (id: number) => {
    setBlogs((current) => current.filter((blog) => blog.id !== id));
  };

  const toggleFeatured = (id: number) => {
    setBlogs((current) =>
      current.map((blog) =>
        blog.id === id ? { ...blog, featured: !blog.featured } : blog,
      ),
    );
  };

  const toggleSelected = (id: number) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const allSelected =
    paginatedBlogs.length > 0 &&
    paginatedBlogs.every((blog) => selected.includes(blog.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected((current) =>
        current.filter(
          (id) => !paginatedBlogs.some((blog) => blog.id === id),
        ),
      );
    } else {
      setSelected((current) => [
        ...current,
        ...paginatedBlogs
          .map((blog) => blog.id)
          .filter((id) => !current.includes(id)),
      ]);
    }
  };

  const columns: AdminTableColumn<Blog>[] = [
    {
      key: "select",
      label: "",
      width: "36px",
      render: (blog) => (
        <input
          type="checkbox"
          checked={selected.includes(blog.id)}
          onChange={() => toggleSelected(blog.id)}
          onClick={(event) => event.stopPropagation()}
          className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/40"
        />
      ),
    },
    {
      key: "title",
      label: "Blog",
      width: "28%",
      render: (blog) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <Link
              href={`/admin/blogs/${blog.id}`}
              onClick={(event) => event.stopPropagation()}
              className="block truncate text-[11px] font-semibold text-gray-800 hover:text-primary"
            >
              {blog.title}
            </Link>
            <p className="mt-1 truncate text-[9px] text-gray-400">
              /{slugify(blog.title)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (blog) => (
        <span className="whitespace-nowrap rounded-md bg-gray-50 px-2 py-1 text-[10px] text-gray-600">
          {blog.category}
        </span>
      ),
    },
    {
      key: "author",
      label: "Author",
      render: (blog) => (
        <span className="whitespace-nowrap text-gray-600">{blog.author}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (blog) => <StatusBadge status={blog.status} />,
    },
    {
      key: "featured",
      label: "Featured",
      align: "center",
      render: (blog) => (
        <button
          type="button"
          aria-label={
            blog.featured ? "Remove from featured" : "Mark as featured"
          }
          onClick={(event) => {
            event.stopPropagation();
            toggleFeatured(blog.id);
          }}
          className={[
            "transition-colors",
            blog.featured ? "text-primary" : "text-gray-300 hover:text-primary",
          ].join(" ")}
        >
          <StarIcon filled={blog.featured} />
        </button>
      ),
    },
    {
      key: "views",
      label: "Views",
      align: "right",
      render: (blog) => (
        <span className="font-medium text-gray-700">
          {blog.views.toLocaleString()}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (blog) => (
        <span className="whitespace-nowrap text-[11px] text-gray-400">
          {blog.date}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (blog) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(event) => event.stopPropagation()}
        >
          <Link
            href={`/admin/blogs/${blog.id}/edit`}
            aria-label="Edit Blog"
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <EditIcon />
          </Link>

          <button
            type="button"
            aria-label="Delete Blog"
            onClick={() => deleteBlog(blog.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <TrashIcon />
          </button>

          <AdminActionMenu
            actions={[
              {
                label: "View Blog",
                onClick: () => {},
                icon: <EyeIcon />,
              },
              {
                label: blog.status === "Published" ? "Unpublish" : "Publish",
                onClick: () => {},
                icon: <PublishIcon />,
                dividerBefore: true,
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blogs Management"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Blogs" },
          { label: "All Blogs" },
        ]}
        action={
          <Link
            href="/admin/blogs/new"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <PlusIcon />
            Add New Blog
          </Link>
        }
      />

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <SummaryCard
          label="Total Blogs"
          value={blogs.length}
          trend="+15.3%"
          icon={<BlogIcon />}
          iconClassName="bg-primary/10 text-primary"
        />
        <SummaryCard
          label="Published"
          value={blogs.filter((b) => b.status === "Published").length}
          trend="+12.6%"
          icon={<CheckIcon />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <SummaryCard
          label="Pending Review"
          value={blogs.filter((b) => b.status === "Pending").length}
          trend="+8.2%"
          icon={<ClockIcon />}
          iconClassName="bg-amber-50 text-amber-600"
        />
        <SummaryCard
          label="Draft"
          value={blogs.filter((b) => b.status === "Draft").length}
          trend="-5.3%"
          negative
          icon={<DraftIcon />}
          iconClassName="bg-violet-50 text-violet-600"
        />
        <SummaryCard
          label="Expired"
          value={blogs.filter((b) => b.status === "Expired").length}
          trend="-2.1%"
          negative
          icon={<TrashIcon />}
          iconClassName="bg-red-50 text-red-600"
        />
      </section>

      {/* Filters */}
      <AdminFilterBar
        searchPlaceholder="Search blogs by title..."
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filters={[
          {
            label: "All Status",
            value: status,
            options: [
              { label: "Published", value: "Published" },
              { label: "Draft", value: "Draft" },
              { label: "Pending", value: "Pending" },
              { label: "Expired", value: "Expired" },
            ],
            onChange: (value) => {
              setStatus(value);
              setPage(1);
            },
          },
          {
            label: "All Categories",
            value: category,
            options: Array.from(
              new Set(blogs.map((blog) => blog.category)),
            ).map((value) => ({ label: value, value })),
            onChange: (value) => {
              setCategory(value);
              setPage(1);
            },
          },
        ]}
        onReset={resetFilters}
        onExport={() => exportBlogs(filteredBlogs)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Table */}
      <section>
        <div className="mb-2 flex items-center gap-2 px-1">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/40"
          />
          <span className="text-[11px] text-gray-500">
            {selected.length > 0
              ? `${selected.length} selected`
              : "Select all"}
          </span>
        </div>

        <AdminTable
          columns={columns}
          data={paginatedBlogs}
          rowKey={(blog) => blog.id}
          emptyMessage="No blog posts match your filters."
        />

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={filteredBlogs.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
        />
      </section>

      {/* Popular Blogs + Top Categories + Recent Drafts */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-[13px] font-semibold text-gray-800">
              Popular Blogs
            </h2>
            <Link
              href="/admin/blogs"
              className="text-[11px] font-semibold text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <ul className="divide-y divide-gray-100">
            {popularBlogs.map((blog) => (
              <li key={blog.id} className="flex items-center gap-3 px-5 py-3">
                <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-medium text-gray-800">
                    {blog.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-400">
                    <EyeIcon />
                    {blog.views} views
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <h2 className="mb-5 text-[13px] font-semibold text-gray-800">
            Top Categories
          </h2>

          <div className="flex flex-col items-center gap-5">
            <div className="relative flex h-[132px] w-[132px] items-center justify-center">
              <svg width="132" height="132" viewBox="0 0 132 132" className="-rotate-90">
                {(() => {
                  const radius = 55;
                  const circumference = 2 * Math.PI * radius;

                  const arcs = categoryBreakdown.reduce<
                    { dash: number; offset: number }[]
                  >((acc, segment) => {
                    const dash = (segment.value / 100) * circumference;
                    const previous = acc.length > 0 ? acc[acc.length - 1] : null;
                    const offset = previous ? previous.offset + previous.dash : 0;
                    return [...acc, { dash, offset }];
                  }, []);

                  return categoryBreakdown.map((segment, index) => {
                    const { dash, offset } = arcs[index];
                    return (
                      <circle
                        key={segment.label}
                        cx="66"
                        cy="66"
                        r={radius}
                        fill="none"
                        stroke={segment.color}
                        strokeWidth="22"
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset={-offset}
                      />
                    );
                  });
                })()}
              </svg>

              <div className="absolute flex flex-col items-center">
                <span className="text-[20px] font-bold text-gray-900">
                  {blogs.length}
                </span>
                <span className="text-[9px] text-gray-400">Total</span>
              </div>
            </div>

            <ul className="w-full space-y-2">
              {categoryBreakdown.map((segment) => (
                <li
                  key={segment.label}
                  className="flex items-center justify-between text-[11px]"
                >
                  <span className="flex items-center gap-2 text-gray-600">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    {segment.label}
                  </span>
                  <span className="whitespace-nowrap text-gray-400">
                    {segment.count} ({segment.value.toFixed(1)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-[13px] font-semibold text-gray-800">
              Recent Drafts
            </h2>
            <Link
              href="/admin/blogs"
              className="text-[11px] font-semibold text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <ul className="divide-y divide-gray-100">
            {recentDrafts.map((draft) => (
              <li
                key={draft.id}
                className="flex items-center justify-between gap-3 px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-[11.5px] font-medium text-gray-800">
                    {draft.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">
                    Last edited: {draft.date}
                  </p>
                </div>

                <Link
                  href={`/admin/blogs/${draft.id}/edit`}
                  aria-label="Edit draft"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <EditIcon />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  trend,
  negative,
  icon,
  iconClassName,
}: {
  label: string;
  value: number;
  trend: string;
  negative?: boolean;
  icon: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-2">
        <span
          className={[
            "flex h-8 w-8 items-center justify-center rounded-md",
            iconClassName ?? "bg-primary/10 text-primary",
          ].join(" ")}
        >
          {icon}
        </span>
        <span className="text-[10px] text-gray-500">{label}</span>
      </div>

      <p className="mt-2 text-[19px] font-semibold leading-none text-gray-800">
        {value.toLocaleString()}
      </p>

      <p
        className={[
          "mt-2 text-[9px] font-medium",
          negative ? "text-red-500" : "text-emerald-600",
        ].join(" ")}
      >
        {trend}
        <span className="ml-1 font-normal text-gray-400">
          from last month
        </span>
      </p>
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function exportBlogs(data: Blog[]) {
  const headers = [
    "Title",
    "Category",
    "Author",
    "Status",
    "Featured",
    "Views",
    "Date",
  ];

  const rows = data.map((blog) => [
    blog.title,
    blog.category,
    blog.author,
    blog.status,
    blog.featured ? "Yes" : "No",
    blog.views,
    blog.date,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "blogs.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function BlogIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h14v18H5z" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function DraftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
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

function PublishIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M5 20h14" />
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

function StarIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  );
}

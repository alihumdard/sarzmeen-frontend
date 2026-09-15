"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminTable, {
  AdminTableColumn,
} from "@/components/admin/AdminTable";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminActionMenu from "@/components/admin/AdminActionMenu";
import StatusBadge from "@/components/admin/StatusBadge";

type BlogStatus = "Published" | "Draft" | "Pending";

type Blog = {
  id: number;
  title: string;
  category: string;
  author: string;
  status: BlogStatus;
  views: number;
  date: string;
};

const initialBlogs: Blog[] = [
  {
    id: 1,
    title: "Complete Guide to Buying Property in Pakistan",
    category: "Buying Guide",
    author: "Admin",
    status: "Published",
    views: 2840,
    date: "Sep 14, 2026",
  },
  {
    id: 2,
    title: "Top Real Estate Investment Opportunities in Lahore",
    category: "Investment",
    author: "Ahmed Khan",
    status: "Published",
    views: 1924,
    date: "Sep 12, 2026",
  },
  {
    id: 3,
    title: "DHA Lahore Property Market Trends 2026",
    category: "Market Trends",
    author: "Sara Malik",
    status: "Published",
    views: 1650,
    date: "Sep 10, 2026",
  },
  {
    id: 4,
    title: "Things to Check Before Buying a House",
    category: "Buying Guide",
    author: "Admin",
    status: "Draft",
    views: 0,
    date: "Sep 09, 2026",
  },
  {
    id: 5,
    title: "Understanding Property Taxes in Pakistan",
    category: "Legal & Tax",
    author: "Usman Ali",
    status: "Pending",
    views: 0,
    date: "Sep 07, 2026",
  },
  {
    id: 6,
    title: "Best Areas to Invest in Islamabad",
    category: "Investment",
    author: "Admin",
    status: "Published",
    views: 2310,
    date: "Sep 05, 2026",
  },
  {
    id: 7,
    title: "How to Find the Right Real Estate Agent",
    category: "Real Estate",
    author: "Hina Shah",
    status: "Draft",
    views: 0,
    date: "Sep 03, 2026",
  },
  {
    id: 8,
    title: "Commercial Property Investment Guide",
    category: "Investment",
    author: "Admin",
    status: "Published",
    views: 3180,
    date: "Aug 30, 2026",
  },
  {
    id: 9,
    title: "Property Documentation Checklist",
    category: "Legal & Tax",
    author: "Ahmed Khan",
    status: "Published",
    views: 1470,
    date: "Aug 27, 2026",
  },
  {
    id: 10,
    title: "Real Estate Market Outlook for 2027",
    category: "Market Trends",
    author: "Admin",
    status: "Pending",
    views: 0,
    date: "Aug 24, 2026",
  },
  {
    id: 11,
    title: "Guide to Property Valuation",
    category: "Buying Guide",
    author: "Sara Malik",
    status: "Published",
    views: 1120,
    date: "Aug 21, 2026",
  },
  {
    id: 12,
    title: "Rental Property Investment Basics",
    category: "Investment",
    author: "Admin",
    status: "Draft",
    views: 0,
    date: "Aug 18, 2026",
  },
];

export default function BlogsManagementPage() {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 8;

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

  const columns: AdminTableColumn<Blog>[] = [
    {
      key: "title",
      label: "Blog Post",
      width: "34%",
      render: (blog) => (
        <div className="min-w-0">
          <Link
            href={`/admin/blogs/${blog.id}`}
            onClick={(event) => event.stopPropagation()}
            className="block truncate font-semibold text-gray-800 hover:text-primary"
          >
            {blog.title}
          </Link>
          <p className="mt-1 text-[10px] text-gray-400">
            /{slugify(blog.title)}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (blog) => (
        <span className="rounded-md bg-gray-50 px-2 py-1 text-[10px] text-gray-600">
          {blog.category}
        </span>
      ),
    },
    {
      key: "author",
      label: "Author",
      render: (blog) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[9px] font-semibold text-primary">
            {getInitials(blog.author)}
          </div>
          <span>{blog.author}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (blog) => <StatusBadge status={blog.status} />,
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
      label: "Published",
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (blog) => (
        <div onClick={(event) => event.stopPropagation()}>
          <AdminActionMenu
            actions={[
              {
                label: "View Blog",
                onClick: () => {},
                icon: <EyeIcon />,
              },
              {
                label: "Edit Blog",
                onClick: () => {},
                icon: <EditIcon />,
              },
              {
                label: blog.status === "Published" ? "Unpublish" : "Publish",
                onClick: () => {},
                icon: <PublishIcon />,
                dividerBefore: true,
              },
              {
                label: "Delete Blog",
                onClick: () => deleteBlog(blog.id),
                icon: <TrashIcon />,
                variant: "danger",
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
        description="Create, manage and publish real estate blog content."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Blogs" },
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
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          label="Total Posts"
          value={blogs.length}
          icon={<BlogIcon />}
        />
        <SummaryCard
          label="Published"
          value={blogs.filter((blog) => blog.status === "Published").length}
          icon={<CheckIcon />}
        />
        <SummaryCard
          label="Drafts"
          value={blogs.filter((blog) => blog.status === "Draft").length}
          icon={<DraftIcon />}
        />
        <SummaryCard
          label="Pending"
          value={blogs.filter((blog) => blog.status === "Pending").length}
          icon={<ClockIcon />}
        />
      </section>

      {/* Filters */}
      <AdminFilterBar
        searchPlaceholder="Search blogs by title, author or category..."
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filters={[
          {
            label: "All Statuses",
            value: status,
            options: [
              { label: "Published", value: "Published" },
              { label: "Draft", value: "Draft" },
              { label: "Pending", value: "Pending" },
            ],
            onChange: (value) => {
              setStatus(value);
              setPage(1);
            },
          },
          {
            label: "All Categories",
            value: category,
            options: [
              { label: "Buying Guide", value: "Buying Guide" },
              { label: "Investment", value: "Investment" },
              { label: "Market Trends", value: "Market Trends" },
              { label: "Legal & Tax", value: "Legal & Tax" },
              { label: "Real Estate", value: "Real Estate" },
            ],
            onChange: (value) => {
              setCategory(value);
              setPage(1);
            },
          },
        ]}
        onReset={resetFilters}
        onExport={() => exportBlogs(filteredBlogs)}
      />

      {/* Table */}
      <section>
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
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>

      <div>
        <p className="text-[10px] text-gray-400">{label}</p>
        <p className="mt-0.5 text-[18px] font-semibold leading-none text-gray-800">
          {value}
        </p>
      </div>
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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function exportBlogs(data: Blog[]) {
  const headers = [
    "Title",
    "Category",
    "Author",
    "Status",
    "Views",
    "Date",
  ];

  const rows = data.map((blog) => [
    blog.title,
    blog.category,
    blog.author,
    blog.status,
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
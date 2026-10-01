"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminTable, { AdminTableColumn } from "@/components/admin/AdminTable";
import AdminPagination from "@/components/admin/AdminPagination";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  listLocations,
  createLocation,
  deleteLocation as apiDeleteLocation,
  type Location,
  type LocationInput,
} from "@/lib/api/locations";

const PER_PAGE = 10;

const typeBadgeClasses: Record<string, string> = {
  city: "bg-blue-50 text-blue-600",
  area: "bg-violet-50 text-violet-600",
  society: "bg-emerald-50 text-emerald-600",
};

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("city");
  const [newParent, setNewParent] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listLocations();
      setLocations(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cityOptions = useMemo(
    () => locations.filter((l) => l.type === "city").map((l) => l.name),
    [locations],
  );

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return locations.filter((location) => {
      const matchesSearch = !query || location.name.toLowerCase().includes(query) || (location.parent ?? "").toLowerCase().includes(query);
      const matchesType = !type || location.type === type;
      const matchesStatus = !status || location.status === status;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [locations, search, type, status]);

  const totalPages = Math.max(1, Math.ceil(filteredLocations.length / PER_PAGE));
  const paginatedLocations = filteredLocations.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetFilters = () => { setSearch(""); setType(""); setStatus(""); setPage(1); };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteLocation(id);
      setLocations((cur) => cur.filter((l) => l.id !== id));
    } catch {
      // handle error
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    setFormError("");
    try {
      const slug = newName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const input: LocationInput = { name: newName.trim(), slug, type: newType };
      if (newParent) input.parent = newParent;
      await createLocation(input);
      setAddModalOpen(false);
      setNewName("");
      setNewType("city");
      setNewParent("");
      load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to create location");
    } finally {
      setSaving(false);
    }
  };

  const columns: AdminTableColumn<Location>[] = [
    {
      key: "index",
      label: "#",
      width: "44px",
      render: (_loc, index) => <span className="text-gray-400">{(page - 1) * PER_PAGE + index + 1}</span>,
    },
    {
      key: "name",
      label: "Location Name",
      width: "25%",
      render: (loc) => <span className="text-[12px] font-semibold text-gray-800">{loc.name}</span>,
    },
    {
      key: "type",
      label: "Type",
      render: (loc) => (
        <span className={["inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium capitalize", typeBadgeClasses[loc.type] ?? "bg-gray-50 text-gray-600"].join(" ")}>
          {loc.type}
        </span>
      ),
    },
    {
      key: "parent",
      label: "Parent",
      render: (loc) => <span className="text-gray-500">{loc.parent ?? "—"}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (loc) => (
        <StatusBadge
          status={loc.status === "published" ? "Published" : loc.status === "draft" ? "Draft" : loc.status}
          variant={loc.status === "published" ? "success" : "neutral"}
        />
      ),
    },
    {
      key: "featured",
      label: "Featured",
      align: "center",
      render: (loc) => (
        <span className={loc.featured ? "text-primary" : "text-gray-300"}>
          <StarIcon filled={loc.featured} />
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (loc) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label="Delete Location"
            onClick={() => handleDelete(loc.id)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Locations Management"
        breadcrumbs={[{ label: "Locations" }, { label: "All Locations" }]}
        action={
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[11px] font-semibold text-white hover:opacity-90"
          >
            <PlusIcon />
            Add New Location
          </button>
        }
      />

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard label="Total Locations" value={locations.length} icon={<LocationIcon />} />
        <SummaryCard label="Cities" value={locations.filter((l) => l.type === "city").length} icon={<CityIcon />} />
        <SummaryCard label="Areas" value={locations.filter((l) => l.type === "area").length} icon={<AreaIcon />} />
        <SummaryCard label="Societies" value={locations.filter((l) => l.type === "society").length} icon={<SocietyIcon />} />
      </section>

      <AdminFilterBar
        searchPlaceholder="Search locations..."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        filters={[
          {
            label: "All Types",
            value: type,
            options: [
              { label: "City", value: "city" },
              { label: "Area", value: "area" },
              { label: "Society", value: "society" },
            ],
            onChange: (v) => { setType(v); setPage(1); },
          },
          {
            label: "All Status",
            value: status,
            options: [
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
            ],
            onChange: (v) => { setStatus(v); setPage(1); },
          },
        ]}
        onReset={resetFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <section>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-7 w-7 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <AdminTable columns={columns} data={paginatedLocations} rowKey={(l) => l.id} emptyMessage="No locations found." />
            <AdminPagination currentPage={page} totalPages={totalPages} totalItems={filteredLocations.length} itemsPerPage={PER_PAGE} onPageChange={setPage} />
          </>
        )}
      </section>

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setAddModalOpen(false)}>
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[14px] font-semibold text-gray-800">Add New Location</h3>
            {formError && <p className="mt-2 text-[12px] text-red-600">{formError}</p>}
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Location name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-[12px] outline-none focus:border-primary"
              />
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-[12px] outline-none focus:border-primary"
              >
                <option value="city">City</option>
                <option value="area">Area</option>
                <option value="society">Society</option>
              </select>
              {newType !== "city" && (
                <select
                  value={newParent}
                  onChange={(e) => setNewParent(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-[12px] outline-none focus:border-primary"
                >
                  <option value="">No parent</option>
                  {locations.filter((l) => l.type === "city").map((l) => (
                    <option key={l.id} value={l.slug}>{l.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setAddModalOpen(false)} className="rounded-md border border-gray-200 px-4 py-2 text-[11px] font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button type="button" onClick={handleCreate} disabled={saving} className="rounded-md bg-primary px-4 py-2 text-[11px] font-semibold text-white hover:opacity-90 disabled:opacity-50">
                {saving ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-[11px] text-gray-500">{label}</p>
        <p className="mt-0.5 text-[19px] font-bold leading-none text-gray-900">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

function PlusIcon() { return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>; }
function LocationIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s6.5-5.4 6.5-10.2a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z" /><circle cx="12" cy="10.8" r="2.4" /></svg>; }
function CityIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V5l8-3 8 3v16" /><path d="M8 9h1M8 13h1M8 17h1M15 9h1M15 13h1M15 17h1M10 21v-4h4v4" /></svg>; }
function AreaIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></svg>; }
function SocietyIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m3.5 10.5 8.5-7 8.5 7" /><path d="M5.5 9.5V20h13V9.5" /><path d="M9.5 20v-5h5v5" /></svg>; }
function TrashIcon() { return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></svg>; }
function StarIcon({ filled = false }: { filled?: boolean }) { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></svg>; }

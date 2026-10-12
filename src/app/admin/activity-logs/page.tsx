"use client";

import { useCallback, useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import {
  getActivityFilters,
  listActivity,
  type ActivityEntry,
} from "@/lib/api/activityLogs";

const EVENT_STYLE: Record<string, string> = {
  created: "bg-emerald-50 text-emerald-700",
  updated: "bg-blue-50 text-blue-700",
  deleted: "bg-red-50 text-red-700",
  login: "bg-gray-100 text-gray-600",
  logout: "bg-gray-100 text-gray-600",
  failed_login: "bg-amber-50 text-amber-700",
  permissions_updated: "bg-purple-50 text-purple-700",
};

/** Audit trail: who changed what, and when. */
export default function ActivityLogsPage() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 25, total: 0 });
  const [logs, setLogs] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [log, setLog] = useState("");
  const [event, setEvent] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (log) params.set("log", log);
      if (event) params.set("event", event);
      if (search.trim()) params.set("search", search.trim());
      params.set("page", String(page));

      const res = await listActivity(params.toString());
      setEntries(res.data);
      setMeta(res.meta);
      setError("");
    } catch {
      setError("Could not load activity. Check that you are signed in as an administrator.");
    } finally {
      setLoading(false);
    }
  }, [log, event, search, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    getActivityFilters()
      .then((f) => {
        setLogs(f.logs);
        setEvents(f.events);
      })
      .catch(() => {});
  }, []);

  const resetFilters = () => {
    setLog("");
    setEvent("");
    setSearch("");
    setPage(1);
  };

  const filtered = log || event || search.trim();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Activity Logs"
        description="Every change made in the admin panel, newest first."
        breadcrumbs={[{ label: "Access & Security" }, { label: "Activity Logs" }]}
      />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <input
            autoComplete="off"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by user name…"
            className="h-9 rounded-md border border-gray-200 px-3 text-[12px] outline-none focus:border-primary"
          />
          <select
            value={log}
            onChange={(e) => {
              setLog(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-md border border-gray-200 px-3 text-[12px] outline-none focus:border-primary"
          >
            <option value="">All modules</option>
            {logs.map((l) => (
              <option key={l} value={l}>
                {headline(l)}
              </option>
            ))}
          </select>
          <select
            value={event}
            onChange={(e) => {
              setEvent(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-md border border-gray-200 px-3 text-[12px] outline-none focus:border-primary"
          >
            <option value="">All actions</option>
            {events.map((e) => (
              <option key={e} value={e}>
                {headline(e)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={resetFilters}
            disabled={!filtered}
            className="h-9 rounded-md border border-gray-300 bg-white px-4 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <p className="px-6 py-16 text-center text-[13px] text-gray-500">Loading activity…</p>
        ) : entries.length === 0 ? (
          <p className="px-6 py-16 text-center text-[13px] text-gray-500">
            {filtered ? "No activity matches these filters." : "No activity recorded yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead className="bg-gray-50">
                <tr className="text-left text-[10.5px] uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">Who</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Changes</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-t border-gray-100 align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{entry.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{entry.causer}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10.5px] font-semibold ${
                          EVENT_STYLE[entry.event ?? ""] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {entry.eventLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-800">{entry.subjectTitle ?? "—"}</span>
                      <span className="mt-0.5 block text-[10.5px] text-gray-400">
                        {entry.logLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {entry.changes.length > 0 ? (
                        <ul className="space-y-0.5">
                          {entry.changes.map((c) => (
                            <li key={c.field} className="text-[11.5px]">
                              <span className="text-gray-500">{c.field}: </span>
                              <span className="text-gray-400 line-through">{c.from ?? "—"}</span>
                              <span className="text-gray-400"> → </span>
                              <span className="font-medium text-gray-800">{c.to ?? "—"}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-[11.5px] text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {meta.last_page > 1 && (
        <AdminPagination
          currentPage={meta.current_page}
          totalPages={meta.last_page}
          totalItems={meta.total}
          itemsPerPage={meta.per_page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

/** "failed_login" -> "Failed Login" */
function headline(value: string): string {
  return value
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

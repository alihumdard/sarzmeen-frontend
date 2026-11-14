"use client";

import { useEffect, useState } from "react";
import AdminFormField, {
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";
import {
  getAgentProfile,
  updateAgentProfile,
  type AgentProfile,
} from "@/lib/api/agentProfile";

/**
 * The bio and figures an agent's public page shows.
 *
 * An agency could already write its own description. An agent could not,
 * so a bio reached a public page only if an administrator typed it there,
 * and almost every agent's page carried an empty card.
 *
 * The name, phone and photograph are left to the account form above this
 * one, which already saves all three.
 */
export default function AgentProfileCard() {
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [years, setYears] = useState("");
  const [deals, setDeals] = useState("");
  const [office, setOffice] = useState("");

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getAgentProfile()
      .then((res) => {
        if (!active) return;
        setAgent(res.data);
        setTitle(res.data.title ?? "");
        setBio(res.data.bio ?? "");
        setYears(res.data.yearsExperience ? String(res.data.yearsExperience) : "");
        setDeals(res.data.dealsClosed ? String(res.data.dealsClosed) : "");
        setOffice(res.data.officeAddress ?? "");
      })
      .catch(() => {
        // An account that is not an agent simply has nothing to show here.
        if (active) setAgent(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!notice && !error) return;
    const t = setTimeout(() => {
      setNotice(null);
      setError(null);
    }, 3500);
    return () => clearTimeout(t);
  }, [notice, error]);

  if (loading || !agent) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    setError(null);

    try {
      const res = await updateAgentProfile({
        title,
        bio,
        /* Empty clears the figure rather than sending "" as a number. */
        yearsExperience: years === "" ? "" : years,
        dealsClosed: deals === "" ? "" : deals,
        officeAddress: office,
      });
      setAgent(res.data);
      setNotice("Your profile has been saved.");
    } catch (err) {
      setError((err as Error).message || "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={save}
      className="rounded-lg border border-border bg-white p-5 sm:p-6"
    >
      <h2 className="text-[15px] font-bold text-heading">Agent Profile</h2>
      <p className="mt-1 text-[12px] text-muted">
        What buyers see on your public page. A figure left empty is left off
        the page rather than shown as a nought.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <AdminFormField label="Job title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Sales Agent"
            className={adminInputClass}
          />
        </AdminFormField>

        <AdminFormField label="Office address">
          <input
            value={office}
            onChange={(e) => setOffice(e.target.value)}
            placeholder="e.g. Main Boulevard, Gulberg"
            className={adminInputClass}
          />
        </AdminFormField>

        <AdminFormField label="Years of experience">
          <input
            type="number"
            min={0}
            max={80}
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="e.g. 8"
            className={adminInputClass}
          />
        </AdminFormField>

        <AdminFormField label="Deals closed">
          <input
            type="number"
            min={0}
            value={deals}
            onChange={(e) => setDeals(e.target.value)}
            placeholder="e.g. 45"
            className={adminInputClass}
          />
        </AdminFormField>
      </div>

      <div className="mt-4">
        <AdminFormField label="About you">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            maxLength={5000}
            placeholder="The areas you know, the kind of property you handle, how you work."
            className={adminTextareaClass}
          />
        </AdminFormField>
        <p className="mt-1 text-[10.5px] text-gray-400">
          {bio.trim().length} / 5000
        </p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="h-10 shrink-0 rounded-md bg-primary px-5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>

        {notice && <span className="text-[12px] text-primary">{notice}</span>}
        {error && <span className="text-[12px] text-red-600">{error}</span>}
      </div>
    </form>
  );
}

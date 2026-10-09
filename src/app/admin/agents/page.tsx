"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { AgentData, listAgents, inviteAgent, updateAgent, deleteAgent } from "@/lib/api/agency";

type ModalMode = "invite" | "edit" | null;

export default function AgencyAgentsPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [modal, setModal] = useState<ModalMode>(null);
  const [editAgent, setEditAgent] = useState<AgentData | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // invite form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");

  // edit form
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listAgents(page);
      setAgents(res.data);
      setLastPage(res.meta.last_page);
      setTotal(res.meta.total);
    } catch {
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  const openInvite = () => {
    setName(""); setEmail(""); setPassword(""); setPhone(""); setTitle("");
    setError(""); setFieldErrors({});
    setModal("invite");
  };

  const openEdit = (agent: AgentData) => {
    setEditAgent(agent);
    setEditName(agent.name ?? "");
    setEditEmail(agent.email ?? "");
    setEditPhone(agent.phone ?? "");
    setEditPassword("");
    setEditTitle(agent.title ?? "");
    setEditBio(agent.bio ?? "");
    setEditAddress(agent.officeAddress ?? "");
    setError(""); setFieldErrors({});
    setModal("edit");
  };

  const closeModal = () => { setModal(null); setEditAgent(null); };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(""); setFieldErrors({});
    try {
      await inviteAgent({ name, email, password, phone: phone || undefined, title: title || undefined });
      closeModal();
      fetchAgents();
    } catch (err: unknown) {
      const apiErr = err as { message?: string; errors?: Record<string, string[]> };
      setError(apiErr.message ?? "Failed to invite agent");
      if (apiErr.errors) setFieldErrors(apiErr.errors);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAgent) return;
    setSaving(true); setError(""); setFieldErrors({});
    try {
      await updateAgent(editAgent.id, {
        name: editName || undefined,
        email: editEmail || undefined,
        phone: editPhone || undefined,
        password: editPassword || undefined,
        title: editTitle || undefined,
        bio: editBio || undefined,
        office_address: editAddress || undefined,
      });
      closeModal();
      fetchAgents();
    } catch (err: unknown) {
      const apiErr = err as { message?: string; errors?: Record<string, string[]> };
      setError(apiErr.message ?? "Failed to update agent");
      if (apiErr.errors) setFieldErrors(apiErr.errors);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (agent: AgentData) => {
    if (!confirm(`Remove ${agent.name} from your team? This will also delete their account.`)) return;
    try {
      await deleteAgent(agent.id);
      fetchAgents();
    } catch (err: unknown) {
      alert((err as { message?: string }).message ?? "Failed to remove agent");
    }
  };

  if (user?.role !== "agency") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Only agency accounts can manage team members.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Team</h1>
          <p className="mt-1 text-sm text-gray-500">{total} agent{total !== 1 ? "s" : ""} in your team</p>
        </div>
        <button
          onClick={openInvite}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          Add Agent
        </button>
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 rounded bg-gray-200" />
                  <div className="h-3 w-20 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white py-16">
          <svg className="mb-4 h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 5.5a3 3 0 0 1 0 5.8M17 14.5a5.5 5.5 0 0 1 3.5 5" /></svg>
          <p className="text-sm font-medium text-gray-600">No agents yet</p>
          <p className="mt-1 text-sm text-gray-400">Invite your first team member to get started</p>
          <button onClick={openInvite} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
            Add Agent
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map(agent => (
            <div key={agent.id} className="group relative rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-100">
                  {agent.avatar ? (
                    <Image src={agent.avatar} alt={agent.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-bold text-primary">
                      {agent.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  {agent.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white">
                      <svg className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-gray-900">{agent.name}</h3>
                  {agent.title && <p className="truncate text-xs text-gray-500">{agent.title}</p>}
                  <p className="mt-1 truncate text-xs text-gray-400">{agent.email}</p>
                </div>
              </div>

              {agent.phone && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 01-2.2 2A19.8 19.8 0 013 5.2 2 2 0 015 3h3a2 2 0 012 1.7 12.7 12.7 0 00.7 2.8 2 2 0 01-.5 2.1L8.1 11.7a16 16 0 006.2 6.2l2.1-2.1a2 2 0 012.1-.5 12.7 12.7 0 002.8.7A2 2 0 0122 18z" /></svg>
                  {agent.phone}
                </div>
              )}

              {(agent.specializations?.length > 0 || agent.languages?.length > 0) && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.specializations?.slice(0, 2).map(s => (
                    <span key={s} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{s}</span>
                  ))}
                  {agent.languages?.slice(0, 2).map(l => (
                    <span key={l} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">{l}</span>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                <div className="flex flex-1 items-center gap-3 text-xs text-gray-400">
                  <span>{agent.yearsExperience ?? 0} yrs exp</span>
                  <span>{agent.dealsClosed ?? 0} deals</span>
                </div>
                <button onClick={() => openEdit(agent)} className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700" title="Edit">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.8 2.8 0 114 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                </button>
                <button onClick={() => handleDelete(agent)} className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600" title="Remove">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40">Previous</button>
          <span className="text-sm text-gray-500">Page {page} of {lastPage}</span>
          <button disabled={page >= lastPage} onClick={() => setPage(p => p + 1)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40">Next</button>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeModal}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {modal === "invite" ? "Add New Agent" : `Edit ${editAgent?.name}`}
              </h2>
              <button onClick={closeModal} className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            {modal === "invite" ? (
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Full Name *</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name[0]}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email[0]}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Password *</label>
                  <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password[0]}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Job Title</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Agent" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50">
                    {saving ? "Inviting..." : "Add Agent"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" required value={editName} onChange={e => setEditName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name[0]}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                  <input type="email" required value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email[0]}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
                  <input type="password" minLength={8} value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="Leave empty to keep current" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password[0]}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                    <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Job Title</label>
                    <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="e.g. Senior Agent" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                    {fieldErrors.title && <p className="mt-1 text-xs text-red-500">{fieldErrors.title[0]}</p>}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Bio</label>
                  <textarea rows={3} value={editBio} onChange={e => setEditBio(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  {fieldErrors.bio && <p className="mt-1 text-xs text-red-500">{fieldErrors.bio[0]}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Office Address</label>
                  <input type="text" value={editAddress} onChange={e => setEditAddress(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  {fieldErrors.office_address && <p className="mt-1 text-xs text-red-500">{fieldErrors.office_address[0]}</p>}
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

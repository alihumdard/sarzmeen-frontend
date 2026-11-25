"use client";

import { useState } from "react";
import { submitSocietyMap } from "@/lib/api/societyMaps";
import { whatsappNumber } from "@/constants/navigation";

const field =
  "h-11 w-full rounded-xl border border-border bg-white px-3.5 text-[13px] text-heading outline-none transition-colors focus:border-primary";

/**
 * Where a society owner offers their map.
 *
 * No account needed: the people holding these maps are society offices
 * and developers, who would not register to send one in.
 */
export default function SubmitMapDialog() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const [societyName, setSocietyName] = useState("");
  const [cityName, setCityName] = useState("");
  const [noc, setNoc] = useState<"yes" | "no" | "unsure">("unsure");
  const [nocAuthority, setNocAuthority] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const close = () => {
    setOpen(false);
    /* Clear only after a send, so a failed attempt keeps what was typed. */
    if (reference) {
      setReference(null);
      setSocietyName("");
      setCityName("");
      setNoc("unsure");
      setNocAuthority("");
      setContactName("");
      setContactPhone("");
      setContactEmail("");
      setContactRole("");
      setNotes("");
      setImageFile(null);
      setDocumentFile(null);
      setPhotoFile(null);
    }
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    if (!imageFile) {
      setError("Please attach the map image.");
      return;
    }

    setSending(true);
    setError(null);

    try {
      const res = await submitSocietyMap({
        societyName: societyName.trim(),
        cityName: cityName.trim() || undefined,
        nocApproved: noc === "unsure" ? null : noc === "yes",
        nocAuthority: nocAuthority.trim() || undefined,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim() || undefined,
        contactRole: contactRole.trim() || undefined,
        notes: notes.trim() || undefined,
        imageFile,
        documentFile,
        photoFile,
      });

      setReference(res.reference);
    } catch (err) {
      const e2 = err as Error & { errors?: Record<string, string[]> };
      setError(
        Object.values(e2.errors ?? {}).flat()[0] ||
          e2.message ||
          "Could not send that. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Submit Your Society Map
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <h2 className="text-[18px] font-bold text-heading">
                  Submit your society map
                </h2>
                <p className="mt-1 text-[12.5px] text-muted">
                  Own or represent a society? Send us the map and we will
                  publish it after a quick check.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="shrink-0 rounded-full p-1 text-muted hover:bg-surface hover:text-heading"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {reference ? (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>

                <h3 className="mt-4 text-[17px] font-bold text-heading">
                  Map received
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-muted">
                  Your reference is{" "}
                  <span className="font-bold text-heading">{reference}</span>.
                  Our team will review the map and get in touch on the number
                  you gave.
                </p>

                <button
                  type="button"
                  onClick={close}
                  className="mt-6 h-11 rounded-xl bg-primary px-8 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={send} className="px-6 py-5">
                {error && (
                  <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12.5px] text-red-700">
                    {error}
                  </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-heading">
                      Society name <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      value={societyName}
                      onChange={(e) => setSocietyName(e.target.value)}
                      maxLength={160}
                      placeholder="e.g. Green Valley Housing Scheme"
                      className={field}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-heading">
                      City
                    </span>
                    <input
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      maxLength={100}
                      placeholder="e.g. Lahore"
                      className={field}
                    />
                  </label>
                </div>

                {/* The sender's claim, which an administrator checks. */}
                <fieldset className="mt-4">
                  <legend className="mb-2 text-[12.5px] font-semibold text-heading">
                    Is the society NOC approved?
                  </legend>

                  <div className="flex flex-wrap gap-2">
                    {([
                      ["yes", "Yes, approved"],
                      ["no", "Not yet"],
                      ["unsure", "Not sure"],
                    ] as const).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setNoc(value)}
                        className={`rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${
                          noc === value
                            ? "bg-primary text-white"
                            : "border border-border bg-white text-heading hover:border-primary"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {noc === "yes" && (
                    <input
                      value={nocAuthority}
                      onChange={(e) => setNocAuthority(e.target.value)}
                      maxLength={120}
                      placeholder="Approving authority, e.g. LDA, CDA, RDA"
                      className={`${field} mt-2.5`}
                    />
                  )}
                </fieldset>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-heading">
                      Map image <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => {
                        setImageFile(e.target.files?.[0] ?? null);
                        setError(null);
                      }}
                      className="w-full text-[12px] file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3.5 file:py-2 file:text-[12px] file:font-semibold file:text-white"
                    />
                    <span className="mt-1 block text-[11px] text-muted">
                      PNG or JPG, up to 12MB. Send the original, so plot
                      numbers stay readable when zoomed.
                    </span>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-heading">
                      PDF or document
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        setDocumentFile(e.target.files?.[0] ?? null)
                      }
                      className="w-full text-[12px] file:mr-3 file:rounded-lg file:border-0 file:bg-surface file:px-3.5 file:py-2 file:text-[12px] file:font-semibold file:text-heading"
                    />
                    <span className="mt-1 block text-[11px] text-muted">
                      Optional — the approved plan or NOC, if you have it.
                    </span>
                  </label>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-heading">
                      Your name <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      maxLength={120}
                      className={field}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-heading">
                      Phone / WhatsApp <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      maxLength={32}
                      placeholder="03XX XXXXXXX"
                      className={field}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-heading">
                      Email
                    </span>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      maxLength={160}
                      className={field}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-heading">
                      Your role
                    </span>
                    <input
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      maxLength={64}
                      placeholder="Owner, developer, marketing…"
                      className={field}
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-heading">
                    Your photo
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                    className="w-full text-[12px] file:mr-3 file:rounded-lg file:border-0 file:bg-surface file:px-3.5 file:py-2 file:text-[12px] file:font-semibold file:text-heading"
                  />
                  <span className="mt-1 block text-[11px] text-muted">
                    Optional — helps our team know who they are speaking to.
                  </span>
                </label>

                <label className="mt-4 block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-heading">
                    Anything else about the society
                  </span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={2000}
                    rows={3}
                    placeholder="Blocks, plot sizes, location, launch date…"
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-[13px] text-heading outline-none transition-colors focus:border-primary"
                  />
                </label>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                  {/* For anyone who would rather just talk to somebody. */}
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      "Assalam o Alaikum, I would like to submit a society map for Sarzameen.com.",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#25D366] px-4 text-[12.5px] font-semibold text-[#128C4A] transition-colors hover:bg-[#25D366]/10"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.9-2.9-1.6-4-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-1 1-1.2 2.3-.5 3.7.9 1.8 2.1 3.4 3.8 4.6 2.4 1.7 3.9 1.7 4.7 1.6.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4z" />
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
                    </svg>
                    Send on WhatsApp instead
                  </a>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={close}
                      className="h-11 rounded-xl px-4 text-[12.5px] font-semibold text-muted hover:text-heading"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className="h-11 rounded-xl bg-primary px-6 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {sending ? "Sending…" : "Submit map"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

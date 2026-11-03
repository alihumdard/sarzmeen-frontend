"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import {
  getThread,
  listConversations,
  sendMessage,
  type Conversation,
  type Message,
} from "@/lib/api/messages";

/**
 * The messages inbox, shared by the admin panel and the public site.
 *
 * Two panes: the threads on the left, the open one on the right. On a phone
 * only one shows at a time, because neither is usable at half a phone's
 * width — picking a thread swaps to it and Back returns to the list.
 */
export default function Messenger() {
  const [threads, setThreads] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  /* Refreshing after a send, where nothing can unmount mid-flight. */
  const loadList = useCallback(async () => {
    try {
      const res = await listConversations();
      setThreads(res.data);
    } catch {
      setError("Could not load your messages.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  /*
   * The first load runs as a promise chain rather than an awaited call, so
   * no state is set synchronously in the effect body, and `active` drops
   * the result if this unmounts while the request is still out.
   */
  useEffect(() => {
    let active = true;

    listConversations()
      .then((res) => {
        if (active) setThreads(res.data);
      })
      .catch(() => {
        if (active) setError("Could not load your messages.");
      })
      .finally(() => {
        if (active) setLoadingList(false);
      });

    return () => {
      active = false;
    };
  }, []);

  /* Opening a thread marks it read on the server, so clear its badge here too. */
  const open = useCallback(async (id: string) => {
    setActiveId(id);
    setLoadingThread(true);
    setError(null);
    try {
      const res = await getThread(id);
      setMessages(res.messages);
      setThreads((cur) =>
        cur.map((t) => (t.id === id ? { ...t, unreadCount: 0 } : t)),
      );
    } catch {
      setError("Could not open that conversation.");
    } finally {
      setLoadingThread(false);
    }
  }, []);

  /* A new message belongs at the bottom, in view. */
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = async () => {
    const text = draft.trim();
    if (!activeId || (!text && !file) || sending) return;

    setSending(true);
    setError(null);
    try {
      const res = await sendMessage(activeId, {
        // The body is required server-side, so an attachment alone still needs one.
        message: text || "(attachment)",
        attachment: file,
      });
      setMessages((cur) => [...cur, res.data]);
      setDraft("");
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
      // The list orders by last activity, so it is now stale.
      void loadList();
    } catch (err) {
      setError((err as Error).message || "Could not send that message.");
    } finally {
      setSending(false);
    }
  };

  const active = threads.find((t) => t.id === activeId) ?? null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex min-h-[520px] flex-col md:flex-row">
        {/* Thread list. Hidden on a phone once a thread is open. */}
        <aside
          className={`w-full shrink-0 border-border md:w-[300px] md:border-r ${
            activeId ? "hidden md:block" : "block"
          }`}
        >
          <header className="border-b border-border px-4 py-3">
            <h2 className="text-[13px] font-bold text-heading">Conversations</h2>
          </header>

          <div className="max-h-[560px] overflow-y-auto">
            {loadingList ? (
              <p className="px-4 py-10 text-center text-[12.5px] text-muted">
                Loading...
              </p>
            ) : threads.length === 0 ? (
              <p className="px-4 py-10 text-center text-[12.5px] text-muted">
                No conversations yet.
              </p>
            ) : (
              threads.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => void open(t.id)}
                  className={`flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-surface ${
                    t.id === activeId ? "bg-primary-light" : ""
                  }`}
                >
                  <Avatar
                    name={t.participant?.name ?? "?"}
                    src={t.participant?.avatar}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[12.5px] font-bold text-heading">
                        {t.participant?.name ?? "Unknown"}
                      </span>
                      {t.unreadCount > 0 && (
                        <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
                          {t.unreadCount}
                        </span>
                      )}
                    </span>

                    {t.property?.title && (
                      <span className="mt-0.5 block truncate text-[11px] text-primary">
                        {t.property.title}
                      </span>
                    )}

                    <span className="mt-0.5 block truncate text-[11.5px] text-muted">
                      {t.lastMessage?.body ?? "No messages yet"}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* The open thread. */}
        <section
          className={`flex min-w-0 flex-1 flex-col ${
            activeId ? "flex" : "hidden md:flex"
          }`}
        >
          {!activeId ? (
            <div className="flex flex-1 items-center justify-center px-6 py-16 text-center">
              <p className="text-[12.5px] text-muted">
                Pick a conversation to read it.
              </p>
            </div>
          ) : (
            <>
              <header className="flex items-center gap-3 border-b border-border px-4 py-3">
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  className="text-[12px] font-semibold text-primary md:hidden"
                >
                  &larr; Back
                </button>

                <Avatar
                  name={active?.participant?.name ?? "?"}
                  src={active?.participant?.avatar}
                />

                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-heading">
                    {active?.participant?.name ?? "Unknown"}
                  </p>
                  {active?.property?.title && (
                    <p className="truncate text-[11px] text-muted">
                      About: {active.property.title}
                    </p>
                  )}
                </div>
              </header>

              <div
                ref={scroller}
                className="flex-1 space-y-3 overflow-y-auto bg-surface px-4 py-4"
                style={{ maxHeight: 420 }}
              >
                {loadingThread ? (
                  <p className="py-10 text-center text-[12.5px] text-muted">
                    Loading...
                  </p>
                ) : messages.length === 0 ? (
                  <p className="py-10 text-center text-[12.5px] text-muted">
                    No messages in this conversation yet.
                  </p>
                ) : (
                  messages.map((m) => <Bubble key={m.id} message={m} />)
                )}
              </div>

              <footer className="border-t border-border px-4 py-3">
                {error && (
                  <p className="mb-2 text-[11.5px] text-red-600">{error}</p>
                )}

                {file && (
                  <p className="mb-2 flex items-center gap-2 text-[11.5px] text-muted">
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        if (fileInput.current) fileInput.current.value = "";
                      }}
                      className="font-semibold text-red-600"
                    >
                      Remove
                    </button>
                  </p>
                )}

                <div className="flex items-end gap-2">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      // Enter sends; Shift+Enter is a new line.
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void send();
                      }
                    }}
                    rows={2}
                    maxLength={2000}
                    placeholder="Write a message..."
                    className="min-h-[44px] flex-1 resize-none rounded-md border border-border px-3 py-2 text-[12.5px] text-text outline-none focus:border-primary"
                  />

                  <label className="cursor-pointer rounded-md border border-border px-3 py-2.5 text-[11.5px] font-semibold text-muted transition-colors hover:border-primary hover:text-primary">
                    Attach
                    <input
                      ref={fileInput}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => void send()}
                    disabled={sending || (!draft.trim() && !file)}
                    className="rounded-md bg-primary px-4 py-2.5 text-[11.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </footer>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function Bubble({ message }: { message: Message }) {
  const own = message.isOwn;

  return (
    <div className={`flex ${own ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[78%]">
        {!own && message.sender?.name && (
          <p className="mb-0.5 text-[10.5px] font-semibold text-muted">
            {message.sender.name}
          </p>
        )}

        <div
          className={`rounded-xl px-3.5 py-2.5 text-[12.5px] leading-5 ${
            own
              ? "rounded-br-sm bg-primary text-white"
              : "rounded-bl-sm border border-border bg-white text-text"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.body}</p>

          {message.attachment && (
            <a
              href={message.attachment}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-1.5 inline-block text-[11.5px] font-semibold underline ${
                own ? "text-white/90" : "text-primary"
              }`}
            >
              View attachment
            </a>
          )}
        </div>

        <p className={`mt-1 text-[10px] text-muted ${own ? "text-right" : ""}`}>
          {sentAt(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) {
    return (
      <SafeImage
        src={src}
        alt={name}
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-[11px] font-bold text-primary">
      {name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </span>
  );
}

/** Time for today, day-first date for anything older. */
function sentAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  const today = new Date();
  const sameDay =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  return sameDay
    ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  listNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
  describeNotification,
  relativeTime,
  notificationHref,
  type AppNotification,
} from "@/lib/api/notifications";
import { useAuth } from "@/context/AuthContext";
import { can } from "@/lib/permissions";

type AdminTopbarProps = {
  onMenuClick?: () => void;
};

const roleLabels: Record<string, string> = {
  admin: "Super Administrator",
  agency: "Agency",
  agent: "Agent",
  user: "Website User",
};



export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const { user, logout } = useAuth();
  const displayName = user?.name ?? "";
  const displayRole = user ? (roleLabels[user.role] ?? user.role) : "";
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRootRef = useRef<HTMLDivElement>(null);

  // Ctrl/Cmd+K jumps focus to the search field, matching the shortcut hint
  // shown next to it.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close whichever dropdown is open on an outside click or Escape.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRootRef.current && !menuRootRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [search, setSearch] = useState("");

  /*
   * Polled rather than pushed: there is no websocket layer, and a 30s badge
   * refresh is cheap next to the complexity of adding one.
   */
  useEffect(() => {
    let cancelled = false;

    const refreshCount = async () => {
      try {
        const count = await getUnreadCount();
        if (!cancelled) setUnreadCount(count);
      } catch {
        // A failed poll should not disturb the page.
      }
    };

    refreshCount();
    const timer = setInterval(refreshCount, 30_000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  // The list is only needed once the panel is actually opened.
  useEffect(() => {
    if (!notificationsOpen) return;

    let cancelled = false;
    listNotifications(10)
      .then((rows) => {
        if (!cancelled) setNotifications(rows.slice(0, 10));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [notificationsOpen]);

  const handleOpenNotification = async (n: AppNotification) => {
    if (!n.read) {
      setNotifications((cur) =>
        cur.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      try {
        await markAsRead(n.id);
      } catch {
        // Optimistic: the badge corrects itself on the next poll.
      }
    }

    const href = notificationHref(n);
    if (href) {
      setNotificationsOpen(false);
      router.push(href);
    }
  };

  const handleMarkAll = async () => {
    setNotifications((cur) => cur.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await markAllAsRead();
    } catch {
      // Same: the next poll restores the true count.
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    setSearch("");
    // Properties is the broadest admin list, so it is the sensible target.
    router.push(`/admin/properties?search=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-7">
        {/* Left Side */}
        <div className="flex min-w-0 items-center gap-4">
          {/* Mobile / Sidebar Toggle */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <MenuIcon />
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} role="search" className="relative hidden sm:block">
            <div className="flex h-10 w-[240px] items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-gray-400 transition-colors focus-within:border-primary">
              <SearchIcon />

              <input
                ref={searchInputRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search properties..."
                className="min-w-0 flex-1 bg-transparent text-[12px] text-gray-700 outline-none placeholder:text-gray-400"
              />

              <span className="hidden items-center rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[9px] font-medium text-gray-500 md:flex">
                Ctrl + K
              </span>
            </div>
          </form>

          {/* Mobile Search */}
          <button
            type="button"
            aria-label="Search"
            onClick={() => searchInputRef.current?.focus()}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 sm:hidden"
          >
            <SearchIcon />
          </button>
        </div>

        {/* Right Side */}
        <div ref={menuRootRef} className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => {
                setNotificationsOpen((value) => !value);
                setProfileOpen(false);
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <BellIcon />

              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="fixed left-4 right-4 top-[72px] z-40 max-h-[70vh] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg sm:absolute sm:left-auto sm:right-0 sm:top-full sm:z-auto sm:mt-2 sm:w-[300px] sm:max-h-none">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <p className="text-[12px] font-semibold text-gray-900">
                    Notifications
                  </p>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAll}
                      className="text-[10px] font-semibold text-primary hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-[11.5px] text-gray-400">
                      No notifications yet.
                    </p>
                  ) : (
                    notifications.map((notification) => {
                      const { title, detail } = describeNotification(notification);

                      return (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => handleOpenNotification(notification)}
                          className={`flex w-full items-start gap-2.5 border-b border-gray-50 px-4 py-3 text-left last:border-0 hover:bg-gray-50 ${
                            notificationHref(notification) ? "cursor-pointer" : "cursor-default"
                          }`}
                        >
                          <span
                            className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                              !notification.read ? "bg-primary" : "bg-transparent"
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="text-[11.5px] font-semibold text-gray-900">
                              {title}
                            </p>
                            {detail && (
                              <p className="mt-0.5 line-clamp-2 text-[11px] text-gray-500">
                                {detail}
                              </p>
                            )}
                            <p className="mt-1 text-[10px] text-gray-400">
                              {relativeTime(notification.createdAt)}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative ml-1">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((value) => !value);
                setNotificationsOpen(false);
              }}
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50"
            >
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={displayName}
                  width={40}
                  height={40}
                  className="h-9 w-9 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-primary/10 text-[12px] font-semibold text-primary">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}

              <div className="hidden text-left md:block">
                <p className="text-[12px] font-semibold text-gray-900">
                  {displayName}
                </p>

                <p className="mt-0.5 text-[9px] text-gray-500">
                  {displayRole}
                </p>
              </div>

              <ChevronDownIcon className="hidden h-4 w-4 text-gray-500 md:block" />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-[190px] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-[12px] font-semibold text-gray-900">
                    {displayName}
                  </p>

                  <p className="mt-1 text-[10px] text-gray-500">
                    {displayRole}
                  </p>
                </div>

                <Link
                  href="/admin/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full px-4 py-2.5 text-left text-[11px] text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  My Profile
                </Link>

                {/* Site-wide settings, so only shown to roles that can manage them. */}
                {can(user, "settings.manage") && (
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full px-4 py-2.5 text-left text-[11px] text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Account Settings
                  </Link>
                )}

                <div className="my-1 border-t border-gray-100" />

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="flex w-full px-4 py-2.5 text-left text-[11px] text-red-500 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------
   Icons
------------------------------------------------- */

function MenuIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
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

function BellIcon() {
  return (
    <svg
      className="h-[19px] w-[19px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function ChevronDownIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

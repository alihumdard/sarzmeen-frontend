"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type AdminTopbarProps = {
  onMenuClick?: () => void;
};

const mockNotifications = [
  {
    id: "n1",
    title: "New inquiry received",
    detail: "Ali Hassan asked about a 1 Kanal House in DHA Phase 6.",
    time: "5m ago",
    unread: true,
  },
  {
    id: "n2",
    title: "Property approved",
    detail: "\"3 Marla House for Sale\" is now live.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n3",
    title: "New agent registered",
    detail: "Capital Property Advisors signed up.",
    time: "Yesterday",
    unread: false,
  },
];

const mockMessages = [
  {
    id: "m1",
    name: "Usman Ghazi",
    preview: "Is the plot in Bahria Town still available?",
    time: "12m ago",
  },
  {
    id: "m2",
    name: "Ayesha Malik",
    preview: "Thanks for the quick response on the listing.",
    time: "3h ago",
  },
];

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

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
        setMessagesOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationsOpen(false);
        setMessagesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-7">
        {/* Left Side */}
        <div className="flex min-w-0 items-center gap-4">
          {/* Mobile / Sidebar Toggle */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open sidebar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <MenuIcon />
          </button>

          {/* Search */}
          <div className="relative hidden sm:block">
            <div className="flex h-10 w-[240px] items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-gray-400 transition-colors focus-within:border-primary">
              <SearchIcon />

              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search anything..."
                className="min-w-0 flex-1 bg-transparent text-[12px] text-gray-700 outline-none placeholder:text-gray-400"
              />

              <span className="hidden items-center rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[9px] font-medium text-gray-500 md:flex">
                Ctrl + K
              </span>
            </div>
          </div>

          {/* Mobile Search */}
          <button
            type="button"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 sm:hidden"
          >
            <SearchIcon />
          </button>
        </div>

        {/* Right Side */}
        <div ref={menuRootRef} className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Theme */}
          <button
            type="button"
            aria-label="Toggle theme"
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:flex"
          >
            <SunIcon />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => {
                setNotificationsOpen((value) => !value);
                setMessagesOpen(false);
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
                    <span className="text-[10px] font-medium text-primary">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-2.5 border-b border-gray-50 px-4 py-3 last:border-0 hover:bg-gray-50"
                    >
                      <span
                        className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                          notification.unread ? "bg-primary" : "bg-transparent"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-semibold text-gray-900">
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-500">
                          {notification.detail}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              aria-label="Messages"
              aria-expanded={messagesOpen}
              onClick={() => {
                setMessagesOpen((value) => !value);
                setNotificationsOpen(false);
                setProfileOpen(false);
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <MessageIcon />

              {mockMessages.length > 0 && (
                <span className="absolute right-1.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[8px] font-bold text-white">
                  {mockMessages.length}
                </span>
              )}
            </button>

            {messagesOpen && (
              <div className="absolute right-0 top-full mt-2 w-[280px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-[12px] font-semibold text-gray-900">
                    Messages
                  </p>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {mockMessages.map((message) => (
                    <div
                      key={message.id}
                      className="border-b border-gray-50 px-4 py-3 last:border-0 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[11.5px] font-semibold text-gray-900">
                          {message.name}
                        </p>
                        <p className="text-[10px] text-gray-400">{message.time}</p>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-gray-500">
                        {message.preview}
                      </p>
                    </div>
                  ))}
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
                setMessagesOpen(false);
              }}
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50"
            >
              <Image
                src="/images/agent-1.jpg"
                alt="Admin"
                width={40}
                height={40}
                className="h-9 w-9 rounded-full border border-gray-200 object-cover"
              />

              <div className="hidden text-left md:block">
                <p className="text-[12px] font-semibold text-gray-900">
                  Admin
                </p>

                <p className="mt-0.5 text-[9px] text-gray-500">
                  Super Administrator
                </p>
              </div>

              <ChevronDownIcon className="hidden h-4 w-4 text-gray-500 md:block" />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-[190px] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-[12px] font-semibold text-gray-900">
                    Admin
                  </p>

                  <p className="mt-1 text-[10px] text-gray-500">
                    Super Administrator
                  </p>
                </div>

                <Link
                  href="/admin"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full px-4 py-2.5 text-left text-[11px] text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  My Profile
                </Link>

                <Link
                  href="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full px-4 py-2.5 text-left text-[11px] text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  Account Settings
                </Link>

                <div className="my-1 border-t border-gray-100" />

                <Link
                  href="/login"
                  className="flex w-full px-4 py-2.5 text-left text-[11px] text-red-500 hover:bg-red-50"
                >
                  Logout
                </Link>
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

function SunIcon() {
  return (
    <svg
      className="h-[19px] w-[19px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="3.5" />

      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.93 19.07 1.41-1.41" />
      <path d="m17.66 6.34 1.41-1.41" />
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

function MessageIcon() {
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
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.4 8.4 0 0 1-3-.6L4 20l1.3-3.8A7.3 7.3 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7Z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
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

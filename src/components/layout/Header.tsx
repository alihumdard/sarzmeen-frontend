"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mainNavigation } from "@/constants/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronDownIcon,
  CloseIcon,
  GridViewIcon,
  MenuIcon,
  PlusCircleIcon,
  UserCircleIcon,
} from "@/components/ui/Icons";

export default function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close an open desktop dropdown on outside click or Escape.
  useEffect(() => {
    if (!openDropdown) return;

    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenDropdown(null);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openDropdown]);

  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    function handleEsc(e: KeyboardEvent) { if (e.key === "Escape") setUserMenuOpen(false); }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleEsc); };
  }, [userMenuOpen]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setOpenMobileGroup(null);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="container-page flex h-[67px] items-center justify-between gap-4 xl:grid xl:grid-cols-[auto_1fr_auto] xl:pl-[calc(2rem+10px)]">
        {/* Logo — icon + HTML wordmark, matching the footer brand mark
            (the source PNG bakes ".com" in near-black, which is fine on
            white here, but pairing it separately keeps both header and
            footer visually consistent). */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5"
          onClick={closeMobileMenu}
        >
          <Image
            src="/logos/sarzmeen-icon.png"
            alt=""
            width={590}
            height={799}
            priority
            className="h-8 w-auto sm:h-9"
          />
          <span className="text-xl font-bold text-heading sm:text-2xl">
            Sarzmeen<span className="text-primary">.com</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          ref={navRef}
          className="hidden items-center justify-self-center gap-1 xl:flex"
          aria-label="Main navigation"
        >
          {mainNavigation.map((item) =>
            item.children ? (
              <div key={item.name} className="relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === item.name}
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === item.name ? null : item.name,
                    )
                  }
                  className="flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-2 text-[13.5px] font-semibold text-heading transition-colors hover:bg-surface hover:text-primary"
                >
                  {item.name}
                  <ChevronDownIcon
                    className={`h-3.5 w-3.5 transition-transform ${
                      openDropdown === item.name ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown === item.name && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-white py-1.5 shadow-lg">
                    {item.children.map((child, index) => {
                      // The last entry is the catch-all link to the full
                      // listing, set apart so it reads as a way out rather
                      // than another filter.
                      const isViewAll = index === item.children!.length - 1;

                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setOpenDropdown(null)}
                          className={
                            isViewAll
                              ? "mt-1 block border-t border-border px-4 py-2 text-center text-[11.5px] font-semibold text-primary transition-colors hover:bg-primary-light"
                              : "block px-4 py-2.5 text-[13px] text-text transition-colors hover:bg-primary-light hover:text-primary"
                          }
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className="whitespace-nowrap rounded-md px-2.5 py-2 text-[13.5px] font-semibold text-heading transition-colors hover:bg-surface hover:text-primary"
              >
                {item.name}
              </Link>
            ),
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center justify-self-end gap-2.5 xl:flex">
          {user ? (
            <>
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 rounded-full border-[1.5px] border-primary/20 bg-primary-light/30 px-3 py-1.5 text-[13px] font-semibold text-heading transition-all hover:border-primary/40 hover:bg-primary-light/60"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  <ChevronDownIcon className={`h-3.5 w-3.5 text-muted transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-lg border border-border bg-white py-1.5 shadow-lg">
                    <div className="border-b border-border px-4 py-2.5">
                      <p className="truncate text-[13px] font-semibold text-heading">{user.name}</p>
                      <p className="truncate text-[11px] text-muted">{user.email}</p>
                    </div>
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text transition-colors hover:bg-primary-light hover:text-primary"
                    >
                      <GridViewIcon className="h-4 w-4" />
                      {user.role === "user" ? "My Properties" : "Dashboard"}
                    </Link>
                    <button
                      type="button"
                      onClick={() => { setUserMenuOpen(false); logout(); }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-text transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border-[1.5px] border-border px-3.5 py-2 text-[12.5px] font-semibold text-heading transition-colors hover:border-primary hover:text-primary"
              >
                <UserCircleIcon className="h-4.5 w-4.5" />
                Login
              </Link>

              <Link
                href="/register"
                className="whitespace-nowrap rounded-lg bg-heading px-3.5 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-heading/90"
              >
                Register
              </Link>
            </>
          )}

          <Link
            href="/properties/add"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_2px_10px_rgba(31,122,77,0.3)] transition-all hover:bg-primary-dark hover:shadow-[0_4px_14px_rgba(31,122,77,0.45)]"
          >
            <PlusCircleIcon className="h-[18px] w-[18px]" />
            Add Property
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-heading xl:hidden"
        >
          {mobileMenuOpen ? (
            <CloseIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-white xl:hidden">
          <nav
            className="container-page flex max-h-[calc(100vh-67px)] flex-col overflow-y-auto py-2"
            aria-label="Mobile navigation"
          >
            {mainNavigation.map((item) =>
              item.children ? (
                <div key={item.name} className="border-b border-border">
                  <button
                    type="button"
                    aria-expanded={openMobileGroup === item.name}
                    onClick={() =>
                      setOpenMobileGroup(
                        openMobileGroup === item.name ? null : item.name,
                      )
                    }
                    className="flex w-full items-center justify-between py-3.5 text-sm font-semibold text-heading"
                  >
                    {item.name}
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform ${
                        openMobileGroup === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openMobileGroup === item.name && (
                    <div className="pb-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={closeMobileMenu}
                          className="block py-2.5 pl-4 text-[13px] text-text hover:text-primary"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="border-b border-border py-3.5 text-sm font-semibold text-heading hover:text-primary"
                >
                  {item.name}
                </Link>
              ),
            )}

            <div className="flex flex-col gap-3 py-4">
              <Link
                href="/properties/add"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                <PlusCircleIcon className="h-[18px] w-[18px]" />
                Add Property
              </Link>

              {user ? (
                <>
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 rounded-full border-[1.5px] border-primary px-4 py-2.5 text-center text-sm font-semibold text-primary"
                  >
                    <GridViewIcon className="h-4 w-4" />
                    {user.role === "user" ? "My Properties" : "Dashboard"}
                  </Link>

                  <button
                    type="button"
                    onClick={() => { closeMobileMenu(); logout(); }}
                    className="flex items-center justify-center gap-2 rounded-full border-[1.5px] border-border px-4 py-2.5 text-center text-sm font-semibold text-heading"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border-[1.5px] border-primary px-4 py-2.5 text-center text-sm font-semibold text-primary"
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="flex flex-1 items-center justify-center rounded-full bg-heading px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

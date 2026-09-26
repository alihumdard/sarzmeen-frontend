"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mainNavigation } from "@/constants/navigation";
import {
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
  PlusCircleIcon,
  UserCircleIcon,
} from "@/components/ui/Icons";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

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
                  className="flex items-center gap-1 rounded-md px-3.5 py-2 text-[14px] font-semibold text-heading transition-colors hover:bg-surface hover:text-primary"
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
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-[13px] text-text transition-colors hover:bg-primary-light hover:text-primary"
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
                className="rounded-md px-3.5 py-2 text-[14px] font-semibold text-heading transition-colors hover:bg-surface hover:text-primary"
              >
                {item.name}
              </Link>
            ),
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center justify-self-end gap-3 xl:flex">
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-2 text-[14px] font-semibold text-heading transition-colors hover:text-primary"
          >
            <UserCircleIcon className="h-5 w-5" />
            Login
          </Link>

          <Link
            href="/register"
            className="px-2 text-[14px] font-semibold text-heading transition-colors hover:text-primary"
          >
            Register
          </Link>

          <Link
            href="/properties/add"
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_2px_10px_rgba(31,122,77,0.3)] transition-all hover:bg-primary-dark hover:shadow-[0_4px_14px_rgba(31,122,77,0.45)]"
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
                  className="flex flex-1 items-center justify-center rounded-full border-[1.5px] border-primary px-4 py-2.5 text-center text-sm font-semibold text-primary"
                >
                  Register
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

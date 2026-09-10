"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  { name: "Buy", href: "/properties?purpose=buy" },
  { name: "Rent", href: "/properties?purpose=rent" },
  { name: "Projects", href: "/projects" },
  { name: "Blogs", href: "/blog" },
  { name: "Locations", href: "/properties" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-white">
      <div className="mx-auto flex h-20 max-w-[var(--container-width)] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight text-[var(--color-primary)]">
            SARZMEEN
          </span>
          <span className="ml-0.5 text-sm font-semibold text-[var(--color-heading)]">
            .com
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-[var(--color-heading)] transition-colors hover:text-[var(--color-primary)]"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/properties/add"
            className="rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
          >
            Add Property
          </Link>

          <Link
            href="/login"
            className="rounded-md border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-heading)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            Login / Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-heading)] lg:hidden"
        >
          <span className="text-xl">{mobileMenuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-[var(--color-border)] bg-white lg:hidden">
          <nav className="mx-auto flex max-w-[var(--container-width)] flex-col px-4 py-4 sm:px-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-[var(--color-border)] py-3 text-sm font-medium text-[var(--color-heading)] last:border-0 hover:text-[var(--color-primary)]"
              >
                {item.name}
              </Link>
            ))}

            <div className="flex gap-3 pt-4">
              <Link
                href="/properties/add"
                className="flex-1 rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Add Property
              </Link>

              <Link
                href="/login"
                className="flex-1 rounded-md border border-[var(--color-border)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--color-heading)]"
              >
                Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
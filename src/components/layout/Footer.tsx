"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronRightIcon,
  EnvelopeIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  LocationPinIcon,
  PhoneIcon,
  SendIcon,
  YouTubeIcon,
} from "@/components/ui/Icons";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blogs", href: "/blog" },
];

const propertyLinks = [
  { label: "Houses", href: "/properties?type=house" },
  { label: "Plots", href: "/properties?type=residential-plot" },
  { label: "Commercial", href: "/properties?type=commercial-plot" },
  { label: "New Projects", href: "/projects" },
];

const areaLinks = [
  { label: "Bahria Town", href: "/properties?area=bahria-town" },
  { label: "DHA Lahore", href: "/properties?area=dha" },
  { label: "Johar Town", href: "/properties?area=johar-town" },
  { label: "Gulberg", href: "/properties?area=gulberg" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedInIcon },
  { label: "YouTube", href: "https://youtube.com", Icon: YouTubeIcon },
];

/** Small link column shared by Quick Links / Properties / Areas. */
function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold uppercase tracking-wide text-white">
        {title}
      </h3>

      <ul className="mt-4 flex flex-col gap-2.5 text-[13px] text-white/65">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group flex w-fit items-center gap-1 transition-colors hover:text-primary-light"
            >
              <ChevronRightIcon className="h-3 w-3 shrink-0 text-primary-light transition-transform duration-200 group-hover:translate-x-1" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    // No API yet — just acknowledges the submission.
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="bg-[#0d1f19] text-white">
      {/* Newsletter band */}
      <div className="bg-[linear-gradient(100deg,#155c39_0%,#1f7a4d_100%)]">
        <div className="container-page flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
              <SendIcon className="h-[18px] w-[18px] text-white" />
            </span>
            <div>
              <p className="text-sm font-bold text-white">
                Don&apos;t Miss Out on the Best Deals!
              </p>
              <p className="text-[12px] text-white/85">
                Subscribe for the latest Lahore property listings and price
                updates.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-sm shrink-0 gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              className="h-10 min-w-0 flex-1 rounded-md border-0 bg-white/95 px-3.5 text-[13px] text-heading outline-none placeholder:text-muted focus:ring-2 focus:ring-white/40"
            />
            <button
              type="submit"
              className="h-10 shrink-0 rounded-md bg-heading px-4 text-[13px] font-semibold text-white transition-colors hover:bg-black"
            >
              {subscribed ? "Subscribed" : "Subscribe Now"}
            </button>
          </form>
        </div>
      </div>

      {/* Columns */}
      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:gap-x-8 lg:flex lg:flex-nowrap lg:justify-between lg:gap-x-8">
          {/* Brand — the full logo file bakes ".com" in near-black, which
              disappears on this dark background, so the icon and wordmark
              are paired separately here instead. */}
          <div className="col-span-2 lg:w-[320px] lg:shrink-0">
            <Link href="/" className="inline-flex items-end gap-1">
              <Image
                src="/logos/sarzmeen-icon.png"
                alt=""
                width={590}
                height={799}
                className="h-7 w-auto"
              />
              <span className="text-lg font-bold text-white">
                Sarzmeen<span className="text-[#3DBB6E]">.com</span>
              </span>
            </Link>

            <p className="mt-3 text-[13px] leading-relaxed text-white/60">
              Sarzameen.com is Lahore&apos;s trusted real estate platform,
              connecting buyers and sellers with verified listings and
              genuine agents.
            </p>

            <div className="mt-4 flex items-center gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:shrink-0">
            <LinkColumn title="Quick Links" links={quickLinks} />
          </div>

          <div className="lg:shrink-0">
            <LinkColumn title="Properties" links={propertyLinks} />
          </div>

          <div className="lg:shrink-0">
            <LinkColumn title="Popular Areas" links={areaLinks} />
          </div>

          {/* Contact */}
          <div className="lg:w-[300px] lg:shrink-0">
            <h3 className="text-[13px] font-semibold uppercase tracking-wide text-white">
              Contact Info
            </h3>

            <div className="mt-4 flex flex-col gap-2.5 text-[13px] text-white/65">
              <p className="flex items-center gap-2">
                <PhoneIcon className="h-3.5 w-3.5 shrink-0 text-primary-light" />
                +92 300 1234567
              </p>
              <p className="flex items-center gap-2">
                <EnvelopeIcon className="h-3.5 w-3.5 shrink-0 text-primary-light" />
                info@sarzmeen.com
              </p>
              <p className="flex items-start gap-2">
                <LocationPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-light" />
                <span>123 Main Boulevard,
                  <br />
                  Lahore, Pakistan
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-4 text-[12px] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Sarzmeen.com. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms &amp; Conditions
            </Link>
            <span className="text-white/30">Made with ♥ in Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";
import PageBanner from "@/components/layout/PageBanner";
import StayUpdatedStrip from "@/components/layout/StayUpdatedStrip";
import {
  ArrowRightIcon,
  CheckIcon,
  EnvelopeIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  LocationPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SupportIcon,
  UsersIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Sarzameen.com for property guidance, listing support and real estate assistance across Pakistan.",
};

const contactChannels = [
  {
    Icon: PhoneIcon,
    title: "Call Us",
    value: "+92 300 1234567",
    detail: "Mon - Sat: 9:00 AM - 7:00 PM",
    href: "tel:+923001234567",
  },
  {
    Icon: WhatsAppIcon,
    title: "WhatsApp",
    value: "+92 300 1234567",
    detail: "We reply quickly",
    href: "https://wa.me/923001234567",
  },
  {
    Icon: EnvelopeIcon,
    title: "Email Us",
    value: "info@sarzameen.com",
    detail: "We'll respond within 24 hours",
    href: "mailto:info@sarzameen.com",
  },
  {
    Icon: LocationPinIcon,
    title: "Visit Us",
    value: "123 Main Boulevard, Lahore",
    detail: "Punjab, Pakistan",
    href: "https://maps.google.com/?q=123%20Main%20Boulevard%20Lahore",
  },
];

const socialLinks = [
  { Icon: FacebookIcon, label: "Facebook", href: "#" },
  { Icon: InstagramIcon, label: "Instagram", href: "#" },
  { Icon: LinkedInIcon, label: "LinkedIn", href: "#" },
  { Icon: YouTubeIcon, label: "YouTube", href: "#" },
];

const reasons = [
  {
    Icon: UsersIcon,
    title: "Expert Guidance",
    text: "Get professional advice from our real estate experts.",
  },
  {
    Icon: SupportIcon,
    title: "Quick Response",
    text: "We value your time and respond promptly.",
  },
  {
    Icon: ShieldCheckIcon,
    title: "Trusted Support",
    text: "Reliable & transparent support at every step.",
  },
  {
    Icon: CheckIcon,
    title: "Better Deals",
    text: "Find the best properties and exclusive opportunities.",
  },
];

const offices = [
  {
    city: "Lahore Office",
    addressLines: ["123 Main Boulevard,", "Lahore, Punjab"],
    phone: "+92 300 1234567",
    image: "/images/city-1.jpg",
  },
  {
    city: "Islamabad Office",
    addressLines: ["456 Blue Area,", "Islamabad Capital"],
    phone: "+92 300 1234568",
    image: "/images/project-1.jpg",
  },
  {
    city: "Karachi Office",
    addressLines: ["789 Clifton, Block 5,", "Karachi, Sindh"],
    phone: "+92 300 1234569",
    image: "/images/interior-1.jpg",
  },
  {
    city: "Rawalpindi Office",
    addressLines: ["101 Commercial Road,", "Rawalpindi, Punjab"],
    phone: "+92 300 1234570",
    image: "/images/property-1.jpg",
  },
];

const faqs = [
  {
    q: "How can I list my property on Sarzameen.com?",
    a: "Create an account, go to \"Add Property\" and fill in your listing details. Our team reviews and publishes it within 24 hours.",
  },
  {
    q: "How long does it take to sell a property?",
    a: "It varies by location and price, but verified listings on Sarzameen.com typically get inquiries within the first week.",
  },
  {
    q: "Is there any fee for listing a property?",
    a: "Basic listings are free. Featured placements have a small fee — details are shown before you confirm.",
  },
  {
    q: "Do you provide property verification?",
    a: "Yes, our team verifies ownership documents and listing details before a property is marked as Verified.",
  },
  {
    q: "How can I contact customer support?",
    a: "Use the form on this page, call or WhatsApp us directly, or email info@sarzameen.com — we typically reply within a few hours.",
  },
  {
    q: "In which cities is Sarzameen.com available?",
    a: "We currently cover Lahore, Islamabad, Karachi, Rawalpindi, Faisalabad and Multan, with more cities being added regularly.",
  },
];


export default function ContactPage() {
  return (
    <main>
      <PageBanner
        title="We're Here to Help You"
        description="Have a question or need assistance? Our team is ready to help you find the right property or solve any queries."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
        image="/images/interior-1.jpg"
      />

      <section className="bg-white py-8 sm:py-10">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
            {/* Send Us a Message */}
            <section className="rounded-lg border border-border bg-white p-5 shadow-[0_12px_34px_rgba(15,35,28,0.08)] sm:p-6">
              <div>
                <h2 className="text-[20px] font-bold text-heading">
                  Send Us a Message
                </h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  Fill out the form and our team will get back to you as soon
                  as possible.
                </p>
              </div>

              <ContactForm />
            </section>

            {/* Get In Touch */}
            <aside className="rounded-lg border border-border bg-white p-5 shadow-[0_12px_34px_rgba(15,35,28,0.08)] sm:p-6">
              <h2 className="text-[20px] font-bold text-heading">
                Get In Touch
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                Reach out to us through any of these channels.
              </p>

              <div className="mt-6 space-y-5">
                {contactChannels.map(({ Icon, title, value, detail, href }) => (
                  <a
                    key={title}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group flex gap-4 rounded-md p-1 transition-colors hover:bg-primary-light"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-bold text-heading">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-heading">
                        {value}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-muted">
                        {detail}
                      </span>
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-7 border-t border-border pt-5">
                <p className="text-[13px] font-bold text-heading">Follow Us</p>
                <div className="mt-3 flex gap-2.5">
                  {socialLinks.map(({ Icon, label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-primary transition-colors hover:bg-primary-dark"
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* Why Contact Sarzameen */}
          <section className="mt-6 rounded-lg border border-primary/10 bg-surface p-5 sm:p-6">
            <h2 className="text-center text-[18px] font-bold text-heading">
              Why Contact Sarzameen?
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {reasons.map(({ Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-heading">
                      {title}
                    </h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      {/* Our Offices */}
      <section className="bg-white pb-10">
        <div className="container-page">
          <div className="text-center">
            <h2 className="text-[22px] font-bold text-heading">
              Our Offices
            </h2>
            <p className="mt-1.5 text-[13px] text-muted">
              Visit our offices in major cities across Pakistan.
            </p>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {offices.map((office) => (
              <article
                key={office.city}
                className="overflow-hidden rounded-lg border border-border bg-white"
              >
                <div className="relative h-28">
                  <Image
                    src={office.image}
                    alt={office.city}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_40%,rgba(0,0,0,0.3)_100%)]" />
                </div>
                <div className="p-4">
                  <h3 className="text-[14px] font-bold text-heading">
                    {office.city}
                  </h3>
                  <p className="mt-2 flex gap-2 text-[12px] leading-relaxed text-muted">
                    <LocationPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>
                      {office.addressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-[12px] text-muted">
                    <PhoneIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {office.phone}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Head office map */}
          <section className="relative mt-6 overflow-hidden rounded-lg border border-border bg-white">
            <div className="relative h-[230px] bg-[#edf2ee]">
              <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(90deg,rgba(31,122,77,0.12)_1px,transparent_1px),linear-gradient(180deg,rgba(31,122,77,0.12)_1px,transparent_1px)] [background-size:44px_44px]" />
              <div className="absolute left-[12%] top-[30%] h-1.5 w-[70%] -rotate-3 rounded-full bg-white/80 shadow-sm" />
              <div className="absolute left-[8%] top-[62%] h-1.5 w-[80%] rotate-2 rounded-full bg-white/80 shadow-sm" />
              <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-[0_10px_25px_rgba(31,122,77,0.34)]">
                <LocationPinIcon className="h-6 w-6" />
              </div>

              {/* Zoom controls */}
              <div className="absolute bottom-4 right-4 flex flex-col overflow-hidden rounded-md border border-border bg-white shadow-sm">
                <button
                  type="button"
                  aria-label="Zoom in"
                  className="flex h-8 w-8 items-center justify-center border-b border-border text-heading transition-colors hover:bg-surface"
                >
                  +
                </button>
                <button
                  type="button"
                  aria-label="Zoom out"
                  className="flex h-8 w-8 items-center justify-center text-heading transition-colors hover:bg-surface"
                >
                  −
                </button>
              </div>
            </div>

            <div className="absolute left-4 top-4 max-w-[260px] rounded-lg bg-white p-4 shadow-[0_10px_26px_rgba(15,35,28,0.14)]">
              <h3 className="text-[13px] font-bold text-heading">
                Sarzameen Head Office
              </h3>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">
                123 Main Boulevard, Lahore, Punjab, Pakistan
              </p>
              <Link
                href="https://maps.google.com/?q=123%20Main%20Boulevard%20Lahore"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-md border border-primary px-3 py-2 text-[12px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Get Directions
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white pb-10">
        <div className="container-page">
          <h2 className="text-center text-[22px] font-bold text-heading">
            Frequently Asked Questions
          </h2>

          <div className="mx-auto mt-7 grid max-w-[980px] gap-3 lg:grid-cols-2">
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-md border border-border bg-white px-4 py-3.5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-semibold text-heading marker:content-none">
                  {q}
                  <span className="shrink-0 text-primary transition-transform group-open:rotate-180">
                    ⌄
                  </span>
                </summary>
                <p className="mt-3 text-[12px] leading-relaxed text-muted">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <StayUpdatedStrip theme="dark" background="white" />
    </main>
  );
}

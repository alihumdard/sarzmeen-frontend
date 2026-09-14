import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[linear-gradient(180deg,#0d1f19_0%,#10241d_100%)] text-white">
      <div className="container-page py-16">
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-[1.6fr_0.8fr_0.8fr_0.9fr]">
          {/* Brand — the full logo file bakes ".com" in near-black, which
              disappears on this dark background, so the icon and wordmark
              are paired separately here instead. */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/logos/sarzmeen-icon.png"
                alt=""
                width={1155}
                height={665}
                className="h-9 w-auto"
              />
              <span className="text-xl font-bold text-white">
                Sarzmeen<span className="text-[#3DBB6E]">.com</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
              Your trusted destination for discovering properties and real
              estate opportunities across Pakistan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Quick Links
            </h3>

            <div className="mt-5 flex flex-col gap-3.5 text-sm text-white/65">
              <Link href="/" className="w-fit transition-colors hover:text-primary-light">
                Home
              </Link>
              <Link href="/properties" className="w-fit transition-colors hover:text-primary-light">
                Properties
              </Link>
              <Link href="/projects" className="w-fit transition-colors hover:text-primary-light">
                Projects
              </Link>
              <Link href="/blog" className="w-fit transition-colors hover:text-primary-light">
                Blogs
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Company
            </h3>

            <div className="mt-5 flex flex-col gap-3.5 text-sm text-white/65">
              <Link href="/about" className="w-fit transition-colors hover:text-primary-light">
                About Us
              </Link>
              <Link href="/contact" className="w-fit transition-colors hover:text-primary-light">
                Contact Us
              </Link>
              <Link href="/login" className="w-fit transition-colors hover:text-primary-light">
                Login
              </Link>
              <Link href="/register" className="w-fit transition-colors hover:text-primary-light">
                Register
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Contact
            </h3>

            <div className="mt-5 flex flex-col gap-3.5 text-sm text-white/65">
              <p>Pakistan</p>
              <p>Phone: +92 XXX XXXXXXX</p>
              <p>Email: info@sarzmeen.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Sarzmeen.com. All rights reserved.</p>

          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
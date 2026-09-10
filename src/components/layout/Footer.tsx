import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#10241d] text-white">
      <div className="mx-auto max-w-[var(--container-width)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold text-white">
              SARZMEEN<span className="text-[var(--color-primary)]">.com</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-300">
              Your trusted destination for discovering properties and real
              estate opportunities across Pakistan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-300">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <Link href="/properties" className="hover:text-white">
                Properties
              </Link>
              <Link href="/projects" className="hover:text-white">
                Projects
              </Link>
              <Link href="/blog" className="hover:text-white">
                Blogs
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              Company
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-300">
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact Us
              </Link>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>
              <Link href="/register" className="hover:text-white">
                Register
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              Contact
            </h3>

            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <p>Pakistan</p>
              <p>Phone: +92 XXX XXXXXXX</p>
              <p>Email: info@sarzmeen.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[var(--container-width)] flex-col gap-2 px-4 py-5 text-sm text-gray-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Sarzmeen.com. All rights reserved.</p>

          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
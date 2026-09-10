import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[var(--container-width)] px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-[var(--color-primary)]">404</p>

      <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">
        Page not found
      </h1>

      <p className="mt-3 text-[var(--color-text)]">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
      >
        Back to home
      </Link>
    </main>
  );
}

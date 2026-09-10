"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-[var(--container-width)] px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--color-heading)]">
        Something went wrong
      </h1>

      <p className="mt-3 text-[var(--color-text)]">
        {error.message || "An unexpected error occurred."}
      </p>

      <button
        onClick={reset}
        className="mt-8 rounded-md bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
      >
        Try again
      </button>
    </main>
  );
}

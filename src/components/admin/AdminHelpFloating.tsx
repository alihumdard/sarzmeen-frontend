"use client";

export default function AdminHelpFloating() {
  return (
    <div className="fixed bottom-5 right-5 z-[90] hidden w-[270px] rounded-xl border border-emerald-900/30 bg-[#062d2b] p-4 shadow-2xl lg:block">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-900/40 text-emerald-300">
          <HeadsetIcon />
        </div>

        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-white">
            Need Help?
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-gray-300">
            Check our documentation or contact support team.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="mt-3 h-9 w-full rounded-lg bg-[#208b59] text-[11px] font-semibold text-white transition-colors hover:bg-[#269d67]"
      >
        Visit Help Center
      </button>
    </div>
  );
}

function HeadsetIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 13a8 8 0 0 1 16 0" />
      <path d="M4 13v4a2 2 0 0 0 2 2h2v-6H4ZM20 13v4a2 2 0 0 1-2 2h-2v-6h4Z" />
      <path d="M16 19c0 1.1-1.8 2-4 2" />
    </svg>
  );
}
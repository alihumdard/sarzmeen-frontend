import { GoogleIcon } from "@/components/ui/Icons";

type SocialAuthButtonsProps = {
  /** Used in the accessible label, e.g. "Sign in" or "Sign up". */
  action: string;
};

/**
 * The "or continue with" row shared by both auth forms.
 *
 * V1 has no OAuth wiring — these are buttons, not links, so nothing
 * navigates until the Laravel endpoints exist.
 */
export default function SocialAuthButtons({ action }: SocialAuthButtonsProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] text-muted">or continue with</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        aria-label={`${action} with Google`}
        className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-full border border-border bg-white py-3 text-[13px] font-medium text-heading transition-colors hover:border-primary hover:text-primary"
      >
        <GoogleIcon className="h-[18px] w-[18px] shrink-0" />
        Continue with Google
      </button>
    </div>
  );
}

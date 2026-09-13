import { AppleIcon, FacebookIcon, GoogleIcon } from "@/components/ui/Icons";

const providers = [
  { name: "Google", Icon: GoogleIcon, iconClass: "" },
  { name: "Facebook", Icon: FacebookIcon, iconClass: "text-[#1877F2]" },
  { name: "Apple", Icon: AppleIcon, iconClass: "text-heading" },
];

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

      <div className="mt-4 grid grid-cols-3 gap-3">
        {providers.map(({ name, Icon, iconClass }) => (
          <button
            key={name}
            type="button"
            aria-label={`${action} with ${name}`}
            className="flex items-center justify-center gap-2 rounded-md border border-border bg-white py-2.5 text-[12px] font-medium text-heading transition-colors hover:border-primary hover:text-primary"
          >
            <Icon className={`h-4 w-4 shrink-0 ${iconClass}`} />
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

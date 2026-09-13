/**
 * Inline SVG icons used across the site.
 *
 * These are plain stroke icons that inherit `currentColor`, so colour is
 * controlled with a normal Tailwind text-* class on the parent or on the icon.
 * Keeping them here avoids pulling in an icon package for the handful we need.
 */

type IconProps = {
  className?: string;
};

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function UserCircleIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="10" r="3.2" />
      <path d="M5.8 19.2a7 7 0 0 1 12.4 0" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/** Hero trust strip — "Verified Properties" */
export function VerifiedBadgeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.6l2.4 1.8 3-.1 1 2.8 2.4 1.7-1 2.8 1 2.8-2.4 1.7-1 2.8-3-.1L12 21.4l-2.4-1.8-3 .1-1-2.8L3.2 15l1-2.8-1-2.8 2.4-1.7 1-2.8 3 .1z" />
      <path d="m8.8 12.1 2.1 2.1 4.3-4.3" />
    </svg>
  );
}

/** Hero trust strip — "Trusted Agents" */
export function TrustedAgentIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="9.6" r="2.9" />
      <path d="M6.3 18.6a6.6 6.6 0 0 1 11.4 0" />
    </svg>
  );
}

/** Hero trust strip — "Easy & Secure" */
export function EasySecureIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.5" y="3.5" width="15" height="17" rx="2.5" />
      <path d="M9 3.5h6v2.2H9z" />
      <path d="m9.2 12.4 2 2 3.6-3.6" />
    </svg>
  );
}

/** Hero trust strip — "Best Investment" */
export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.8 4.8 5.9v5.4c0 4.3 3 8.3 7.2 9.9 4.2-1.6 7.2-5.6 7.2-9.9V5.9z" />
      <path d="m9 12 2.1 2.1L15.2 10" />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

/** Favourite toggle on a property card. Filled when saved. */
export function HeartIcon({
  className,
  filled = false,
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20.3s-7.4-4.6-7.4-9.6a4.2 4.2 0 0 1 7.4-2.7 4.2 4.2 0 0 1 7.4 2.7c0 5-7.4 9.6-7.4 9.6z" />
    </svg>
  );
}

/** Property card spec — covered area. */
export function AreaIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9V4h5M20 15v5h-5" />
      <rect x="4" y="4" width="16" height="16" rx="1.5" opacity="0.45" />
    </svg>
  );
}

/** Property card spec — bedrooms. */
export function BedIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 18v-5.5h18V18" />
      <path d="M3 12.5V7M21 18v1.5M3 18v1.5" />
      <path d="M6.5 12.5v-2.2A1.3 1.3 0 0 1 7.8 9h8.4a1.3 1.3 0 0 1 1.3 1.3v2.2" />
    </svg>
  );
}

/** Property card spec — bathrooms. */
export function BathIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 11.5h17v2.2a4.3 4.3 0 0 1-4.3 4.3H7.8a4.3 4.3 0 0 1-4.3-4.3z" />
      <path d="M6.2 11.5V6.3A2 2 0 0 1 8.2 4.3a2 2 0 0 1 2 2" />
      <path d="M7 18v1.8M17 18v1.8" />
    </svg>
  );
}

export function PlusCircleIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8.2v7.6M8.2 12h7.6" />
    </svg>
  );
}

/** Sell/Rent banner stat — properties listed. */
export function HomeStatIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 11.2 12 4.2l8.5 7" />
      <path d="M5.6 10.4V20h12.8v-9.6" />
      <path d="M10 20v-4.6h4V20" />
    </svg>
  );
}

/** Sell/Rent banner stat — satisfied clients. */
export function SmileStatIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.6" />
      <path d="M8.6 14.2a4.2 4.2 0 0 0 6.8 0" />
      <path d="M9.4 9.6h.01M14.6 9.6h.01" />
    </svg>
  );
}

/** Sell/Rent banner stat — trusted agents. */
export function AgentStatIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="7.6" r="3.4" />
      <path d="M5.8 20a6.2 6.2 0 0 1 12.4 0" />
      <path d="M4.6 8.4 3 6.8M19.4 8.4 21 6.8" />
    </svg>
  );
}

/** Project card — category line marker. */
export function LocationPinIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s6.5-5.4 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.6 12 21 12 21z" />
      <circle cx="12" cy="10.6" r="2.4" />
    </svg>
  );
}

/** Why Choose — wide range of listings. */
export function ListingsIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.4 10.6 12 4l8.6 6.6" />
      <path d="M5.6 9.8V20h12.8V9.8" />
      <path d="M9.4 20v-5h5.2v5" />
    </svg>
  );
}

/** Why Choose — verified & trusted. */
export function VerifiedTrustIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.6" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

/** Why Choose — smart search filters. */
export function SmartSearchIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="m16 16 3.6 3.6" />
      <path d="M8.4 9.6h4.8M9.6 12.2h2.4" />
    </svg>
  );
}

/** Why Choose — expert support. */
export function SupportIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.2a7 7 0 0 0-7 7v3.4" />
      <path d="M19 13.6v-3.4a7 7 0 0 0-2.2-5.1" />
      <rect x="3" y="12.6" width="3.6" height="5.4" rx="1.6" />
      <rect x="17.4" y="12.6" width="3.6" height="5.4" rx="1.6" />
      <path d="M19.2 18v.8a2.4 2.4 0 0 1-2.4 2.4H13" />
    </svg>
  );
}

/** Blog card meta — publish date. */
export function CalendarIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.6" y="5.2" width="16.8" height="15.2" rx="2" />
      <path d="M3.6 9.8h16.8M8.4 3.6v3.2M15.6 3.6v3.2" />
    </svg>
  );
}

/** Blog card meta — reading time. */
export function ReadTimeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4V12l3 1.8" />
    </svg>
  );
}

/** CTA strip — trailing arrow on the button. */
/** Contact form — "Send Message" button. */
export function SendIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 3 3 10.6l7.4 3 3 7.4z" />
      <path d="M21 3 10.4 13.6" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}

/** Listing toolbar — grid view toggle. */
export function GridViewIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="7.4" height="7.4" rx="1.4" />
      <rect x="13.1" y="3.5" width="7.4" height="7.4" rx="1.4" />
      <rect x="3.5" y="13.1" width="7.4" height="7.4" rx="1.4" />
      <rect x="13.1" y="13.1" width="7.4" height="7.4" rx="1.4" />
    </svg>
  );
}

/** Listing toolbar — list view toggle. */
export function ListViewIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </svg>
  );
}

/** Newsletter box. */
export function EnvelopeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.8" y="5.2" width="18.4" height="13.6" rx="2" />
      <path d="m3.6 6.6 8.4 6 8.4-6" />
    </svg>
  );
}

/** Sidebar promo — "Looking to Invest in Property?" */
export function InvestIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.6 20.4h16.8" />
      <path d="M6.4 20.4v-6.2M11 20.4V9.6M15.6 20.4v-8.4M20 20.4V6.2" />
      <path d="m5.2 9.4 4.6-3.8 3.4 2.4 5.6-4.4" />
      <path d="M15.4 3.6h3.4v3.2" />
    </svg>
  );
}

/** About — Our Mission. */
export function TargetIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.4 12a8.4 8.4 0 1 1-4.6-7.5" />
      <path d="M16.4 12a4.4 4.4 0 1 1-2.6-4" />
      <path d="m11.6 12 8-8M16.8 4.2l.4 2.6 2.6.4" />
    </svg>
  );
}

/** About — Our Vision. */
export function EyeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.6 12S6.4 5.6 12 5.6 21.4 12 21.4 12 17.6 18.4 12 18.4 2.6 12 2.6 12z" />
      <circle cx="12" cy="12" r="3.1" />
    </svg>
  );
}

/** About stats — verified properties. */
export function BuildingIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.2" y="3.2" width="11" height="17.6" rx="1.4" />
      <path d="M15.2 9.4h4.6v11.4H4.2" />
      <path d="M7.4 7h1.6M11 7h1.6M7.4 10.6h1.6M11 10.6h1.6M7.4 14.2h1.6M11 14.2h1.6" />
    </svg>
  );
}

/** About stats — trusted agents. */
export function UsersIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9.2" cy="8.4" r="3.2" />
      <path d="M3.4 19.2a5.8 5.8 0 0 1 11.6 0" />
      <path d="M16 5.6a3.2 3.2 0 0 1 0 6" />
      <path d="M17.4 13.8a5.8 5.8 0 0 1 3.2 5.4" />
    </svg>
  );
}

/** About stats — cities covered. */
export function HandshakeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m2.8 13.4 3.4-3.4 3 2.6 2.8-2.6 3 2.6 3-3" />
      <path d="m9.2 12.6 2.6 2.6 1.6-1.4 2.2 2 1.6-1.4" />
      <path d="M2.8 9.6 6.2 6.2h3.4M21.2 9.6 17.8 6.2h-3.2" />
    </svg>
  );
}

/** About stats — years of excellence. */
export function AwardIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="9" r="5.4" />
      <path d="m8.4 13.6-1.6 6.8 5.2-2.6 5.2 2.6-1.6-6.8" />
    </svg>
  );
}

/** Why Choose — transparency (document). */
export function DocumentIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 3.2H6.8a1.6 1.6 0 0 0-1.6 1.6v14.4a1.6 1.6 0 0 0 1.6 1.6h10.4a1.6 1.6 0 0 0 1.6-1.6V8z" />
      <path d="M14 3.2V8h4.8" />
      <path d="M8.6 12.6h6.8M8.6 16h4.6" />
    </svg>
  );
}

/** Why Choose — smart technology (gear). */
export function GearIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 2.8v2.4M12 18.8v2.4M4.5 12H2.1M21.9 12h-2.4M6.7 6.7 5 5M19 19l-1.7-1.7M6.7 17.3 5 19M19 5l-1.7 1.7" />
    </svg>
  );
}

/** Why Choose — dedicated support (headset). */
export function HeadsetIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.6 14v-2a7.4 7.4 0 0 1 14.8 0v2" />
      <rect x="2.6" y="13.4" width="3.8" height="5.6" rx="1.6" />
      <rect x="17.6" y="13.4" width="3.8" height="5.6" rx="1.6" />
      <path d="M19.4 19v.6a2.4 2.4 0 0 1-2.4 2.4h-2.8" />
    </svg>
  );
}

/** Why Choose — best deals (thumbs up). */
export function ThumbsUpIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7.4 20.4V10.2l4.2-7a2 2 0 0 1 2.8 2v4.6h4.4a2 2 0 0 1 2 2.4l-1.4 6.6a2 2 0 0 1-2 1.6z" />
      <rect x="2.8" y="10.2" width="4.6" height="10.2" rx="1.2" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M3 9.5h4v11H3zm7 0h3.8v1.5h.05a4.17 4.17 0 0 1 3.75-2.06c4 0 4.75 2.64 4.75 6.06v5.5h-4v-4.88c0-1.16-.02-2.66-1.62-2.66-1.63 0-1.88 1.27-1.88 2.58v4.96h-4z" />
    </svg>
  );
}

/** Team section — "Join Our Team" button. */
export function UserPlusIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9.4" cy="8.2" r="3.4" />
      <path d="M3.4 19.4a6 6 0 0 1 12 0" />
      <path d="M18.6 8.6v4.8M21 11h-4.8" />
    </svg>
  );
}

/** Listing row — call the agent. */
export function PhoneIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.6 16.9v2.6a1.7 1.7 0 0 1-1.9 1.7 17.2 17.2 0 0 1-7.5-2.7 16.9 16.9 0 0 1-5.2-5.2A17.2 17.2 0 0 1 3.3 5.7 1.7 1.7 0 0 1 5 3.8h2.6a1.7 1.7 0 0 1 1.7 1.5c.1.8.3 1.6.6 2.4a1.7 1.7 0 0 1-.4 1.8l-1.1 1.1a13.6 13.6 0 0 0 5.1 5.1l1.1-1.1a1.7 1.7 0 0 1 1.8-.4c.8.3 1.6.5 2.4.6a1.7 1.7 0 0 1 1.5 1.7z" />
    </svg>
  );
}

/** Filled tick shown beside a verified listing title. */
export function VerifiedTickIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.2 14.3 4l2.9-.1.9 2.7 2.3 1.7-1 2.7 1 2.7-2.3 1.7-.9 2.7-2.9-.1L12 21.8 9.7 20l-2.9.1-.9-2.7-2.3-1.7 1-2.7-1-2.7 2.3-1.7.9-2.7 2.9.1z" />
      <path
        d="m8.9 12 2 2 4.2-4.2"
        fill="none"
        stroke="#fff"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Filters panel — reset all. */
export function ResetIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 5.4v4.8h4.8" />
      <path d="M4.9 14a7.6 7.6 0 1 0 1.8-7.9L3.5 9" />
    </svg>
  );
}

/** Detail header — share this listing. */
export function ShareIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="17.8" cy="5.6" r="2.8" />
      <circle cx="6.2" cy="12" r="2.8" />
      <circle cx="17.8" cy="18.4" r="2.8" />
      <path d="m8.7 10.7 6.6-3.7M8.7 13.3l6.6 3.7" />
    </svg>
  );
}

/** Detail header — add to compare. */
export function CompareIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.4v17.2" />
      <path d="M6.4 7.6H3.2l3.2 6.4 3.2-6.4zM17.6 7.6h-3.2l3.2 6.4 3.2-6.4z" />
      <path d="M4.6 7.6 12 5.4l7.4 2.2" />
    </svg>
  );
}

/** Detail header — view counter. */
export function EyeCountIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.6 12S6.4 5.6 12 5.6 21.4 12 21.4 12 17.6 18.4 12 18.4 2.6 12 2.6 12z" />
      <circle cx="12" cy="12" r="2.9" />
    </svg>
  );
}

/** Price box — living rooms. */
export function SofaIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.4 11.4V8.2a2 2 0 0 1 2-2h11.2a2 2 0 0 1 2 2v3.2" />
      <path d="M3 13a1.9 1.9 0 0 1 3.8 0v2.2h10.4V13A1.9 1.9 0 0 1 21 13v4.4H3z" />
      <path d="M6 17.4v1.8M18 17.4v1.8" />
    </svg>
  );
}

/** Price box — kitchens. */
export function KitchenIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.2" y="3.4" width="15.6" height="17.2" rx="2" />
      <path d="M4.2 10.4h15.6" />
      <path d="M7.6 6.2h2M7.6 14.2h2M14.4 14.2h2" />
    </svg>
  );
}

/** Price box / quick facts — car parking. */
export function CarIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.6 15.4v2.2M19.4 15.4v2.2" />
      <path d="M3 15.4v-3l1.9-4.2a1.8 1.8 0 0 1 1.7-1.1h10.8a1.8 1.8 0 0 1 1.7 1.1L21 12.4v3z" />
      <path d="M4.4 12.4h15.2" />
      <circle cx="7.4" cy="15.4" r="1.1" />
      <circle cx="16.6" cy="15.4" r="1.1" />
    </svg>
  );
}

/** Quick facts — area size. */
export function AreaSizeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.4 20.6V3.4h17.2" />
      <path d="m7 17 4.2-4.2 2.6 2.6L20 9.2" />
      <path d="M20 13.2V9.2h-4" />
    </svg>
  );
}

/** Quick facts — property status. */
export function StatusIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.4" y="5.4" width="17.2" height="13.2" rx="2" />
      <circle cx="12" cy="12" r="2.9" />
      <path d="M7.6 5.4V3.6M16.4 5.4V3.6" />
    </svg>
  );
}

/** Quick facts — furnishing. */
export function FurnishingIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.6 12.4V7.6a2 2 0 0 1 2-2h12.8a2 2 0 0 1 2 2v4.8" />
      <rect x="3.6" y="12.4" width="16.8" height="5" rx="1.6" />
      <path d="M6.6 17.4v1.6M17.4 17.4v1.6" />
      <path d="M8 12.4V9.6h8v2.8" />
    </svg>
  );
}

/** Highlights list — plain tick. */
export function CheckIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4.8 12.6 4.6 4.6L19.2 7.4" />
    </svg>
  );
}

/** Nearby place — park. */
export function TreeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20.6v-5.2" />
      <path d="M12 3.4 6.6 11h3L6 15.4h12L14.4 11h3z" />
    </svg>
  );
}

/** Nearby place — road. */
export function RoadIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7.6 3.6 4.6 20.4M16.4 3.6l3 16.8" />
      <path d="M12 4.6v2.8M12 10.6v2.8M12 16.6v2.8" />
    </svg>
  );
}

/** Nearby place — airport. */
export function PlaneIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.2 3.6a1.8 1.8 0 0 1 3.6 0v5.2l7.2 4.2v2.4l-7.2-2.2v4l2.4 1.8v1.8L12 19.6l-4.2 1.2v-1.8l2.4-1.8v-4L3 15.4V13l7.2-4.2z" />
    </svg>
  );
}

/** Nearby place — mall. */
export function ShopIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9.4h16v9.4a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 18.8z" />
      <path d="M3.2 9.4 5 4.4h14l1.8 5" />
      <path d="M9.4 13.4h5.2" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 21v-7.6h2.6l.4-3h-3v-1.9c0-.87.24-1.46 1.5-1.46h1.6V4.34A21 21 0 0 0 13.9 4.2c-2.3 0-3.9 1.4-3.9 4v2.2H7.4v3H10V21z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="16.9" cy="7.1" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YouTubeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21.6 7.6a2.7 2.7 0 0 0-1.9-1.9C18 5.2 12 5.2 12 5.2s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.6 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.4 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.4M9.9 15.2V8.8L15.5 12z" />
    </svg>
  );
}

/** Auth forms — password field. */
export function LockIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.4" y="10.4" width="15.2" height="10.2" rx="2" />
      <path d="M8 10.4V7.6a4 4 0 0 1 8 0v2.8" />
    </svg>
  );
}

/** Auth forms — reveal the password. */
export function EyeOffIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.9 5.9a9.4 9.4 0 0 1 2.1-.3c5.6 0 9.4 6.4 9.4 6.4a17 17 0 0 1-2.6 3.4M6.2 6.8A17 17 0 0 0 2.6 12S6.4 18.4 12 18.4a9 9 0 0 0 3.9-.9" />
      <path d="M10 10a2.9 2.9 0 0 0 4 4" />
      <path d="m3.4 3.4 17.2 17.2" />
    </svg>
  );
}

/** Auth — login submit button. */
export function LoginArrowIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.6 3.4h3.6a2 2 0 0 1 2 2v13.2a2 2 0 0 1-2 2h-3.6" />
      <path d="M9.6 16.4 14 12 9.6 7.6" />
      <path d="M14 12H3.6" />
    </svg>
  );
}

/** Brand mark for the Google sign-in button. */
export function GoogleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.68-.06-1.33-.17-1.96H12v3.71h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.89-1.74 2.98-4.3 2.98-7.28"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.59A10 10 0 0 0 12 22"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.9a6 6 0 0 1 0-3.8V7.51H3.06a10 10 0 0 0 0 8.98z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.99 14.7 2 12 2a10 10 0 0 0-8.94 5.51L6.4 10.1C7.2 7.74 9.4 5.98 12 5.98"
      />
    </svg>
  );
}

/** Brand mark for the Apple sign-in button. */
export function AppleIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.5 12.9c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.14-2.7.8-3.4.8s-1.8-.8-2.9-.78c-1.5.02-2.9.87-3.7 2.2-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.25 1.2-.05 1.6-.75 3-.75s1.8.75 3 .72c1.24-.02 2.02-1.1 2.78-2.2.87-1.26 1.23-2.48 1.25-2.54-.03-.01-2.4-.92-2.42-3.65M14.3 5.6c.64-.78 1.07-1.86.95-2.94-.92.04-2.03.61-2.69 1.38-.59.69-1.11 1.79-.97 2.85 1.02.08 2.07-.52 2.71-1.29" />
    </svg>
  );
}

/** Auth benefits — property alerts. */
export function BellIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18.4 16.4V10.6a6.4 6.4 0 1 0-12.8 0v5.8L4 18.4h16z" />
      <path d="M10.2 18.4a1.9 1.9 0 0 0 3.6 0" />
    </svg>
  );
}

/** Auth benefits — market insights. */
export function ChartIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.6 20.4h16.8" />
      <rect x="5.8" y="12.4" width="3.4" height="8" rx="1" />
      <rect x="12" y="7.6" width="3.4" height="12.8" rx="1" />
      <rect x="17" y="4.2" width="3.4" height="16.2" rx="1" />
    </svg>
  );
}

/** Auth benefits — personalised experience. */
export function StarIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3.6 2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.9l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85z" />
    </svg>
  );
}

/** Auth form footer — data security note. */
export function ShieldLockIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.8 4.8 5.9v5.4c0 4.3 3 8.3 7.2 9.9 4.2-1.6 7.2-5.6 7.2-9.9V5.9z" />
      <rect x="9.4" y="10.8" width="5.2" height="4.4" rx="1" />
      <path d="M10.6 10.8V9.6a1.4 1.4 0 0 1 2.8 0v1.2" />
    </svg>
  );
}

/** Auth benefits — saved properties. */
export function SaveHomeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.6 10.6 12 4l8.4 6.6" />
      <path d="M5.8 9.8V20h12.4V9.8" />
      <path d="M12 16.6s-2.6-1.6-2.6-3.4a1.5 1.5 0 0 1 2.6-.95 1.5 1.5 0 0 1 2.6.95c0 1.8-2.6 3.4-2.6 3.4z" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.26-8.24M8.53 7.33c-.17 0-.44.06-.67.31s-.88.86-.88 2.1.9 2.43 1.03 2.6c.12.16 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.19s.21-1.08.15-1.19-.23-.17-.48-.29-1.48-.73-1.71-.81-.4-.13-.56.12-.65.81-.79.98-.29.18-.54.06-1.06-.39-2.02-1.24c-.75-.67-1.25-1.49-1.4-1.74s-.01-.39.11-.51c.11-.11.25-.29.37-.44s.17-.25.25-.41.04-.31-.02-.44-.56-1.35-.76-1.85c-.2-.48-.41-.42-.56-.42z" />
    </svg>
  );
}

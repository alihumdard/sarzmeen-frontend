import {
  BellIcon,
  ChartIcon,
  EnvelopeIcon,
  SaveHomeIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@/components/ui/Icons";

const benefits = [
  {
    Icon: SaveHomeIcon,
    title: "Save Properties",
    description: "Save your favorite properties and view them anytime.",
  },
  {
    Icon: BellIcon,
    title: "Property Alerts",
    description: "Get instant alerts for new properties that match your needs.",
  },
  {
    Icon: EnvelopeIcon,
    title: "Manage Inquiries",
    description: "Track all your inquiries and conversations in one place.",
  },
  {
    Icon: ChartIcon,
    title: "Market Insights",
    description: "Get latest market updates and insights to make smart choices.",
  },
  {
    Icon: StarIcon,
    title: "Personalized Experience",
    description: "Get recommendations tailored to your preferences.",
  },
  {
    Icon: ShieldCheckIcon,
    title: "Secure & Trusted",
    description: "Your data is safe with us. We value your privacy.",
  },
];

/** Six-up reasons row sitting below the auth card. */
export default function AuthBenefits() {
  return (
    <section className="bg-surface py-14">
      <div className="container-page">
        <p className="text-center text-[11px] font-bold tracking-[0.12em] text-primary">
          WHY JOIN SARZAMEEN?
        </p>

        <h2 className="mt-3 text-center text-[24px] font-bold text-heading sm:text-[27px]">
          Your Property Journey Made Better
        </h2>

        <ul className="mt-10 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-6">
          {benefits.map(({ Icon, title, description }) => (
            <li
              key={title}
              className="flex flex-col items-center px-4 text-center lg:border-r lg:border-border lg:last:border-r-0"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                <Icon className="h-6 w-6" />
              </span>

              <h3 className="mt-4 text-[13px] font-bold text-heading">
                {title}
              </h3>

              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

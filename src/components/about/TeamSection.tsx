import Image from "next/image";
import Link from "next/link";
import { LinkedInIcon, UserPlusIcon } from "@/components/ui/Icons";
import { team } from "@/constants/aboutContent";

const MEMBER_PHOTO = "/images/team-1.jpg";

export default function TeamSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute -left-32 top-40 h-72 w-72 rounded-full bg-primary-light/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-primary-light/15 blur-3xl" />

      <div className="container-page relative">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-primary/30" />

            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              {team.eyebrow}
            </p>

            <span className="h-px w-10 bg-primary/30" />
          </div>

          <h2 className="mt-4 text-[28px] font-bold leading-tight text-heading sm:text-[34px] lg:text-[38px]">
            {team.heading}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[13px] leading-6 text-muted sm:text-[14px]">
            A passionate team committed to making real estate simpler,
            transparent and more accessible for everyone in Pakistan.
          </p>
        </div>

        {/* Team Cards */}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.members.map((member) => (
            <li
              key={member.id}
              className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative h-[250px] overflow-hidden bg-surface sm:h-[270px]">
                <Image
                  src={MEMBER_PHOTO}
                  alt={member.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />

                {/* Image overlay */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />

                {/* LinkedIn */}
                <Link
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on LinkedIn`}
                  className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary shadow-md transition-all duration-200 hover:bg-primary hover:text-white"
                >
                  <LinkedInIcon className="h-4 w-4" />
                </Link>
              </div>

              {/* Content */}
              <div className="flex min-h-[165px] flex-col items-center px-5 py-6 text-center">
                <h3 className="text-[16px] font-bold text-heading">
                  {member.name}
                </h3>

                <p className="mt-1.5 text-[12px] font-medium text-primary">
                  {member.role}
                </p>

                {/* Small divider */}
                <span className="mt-4 h-[2px] w-9 rounded-full bg-primary/40" />

                {/* Description */}
                <p className="mt-4 text-[12px] leading-5 text-muted">
                  {getMemberDescription(member.role)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-3.5 text-[13px] font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <UserPlusIcon className="h-4 w-4" />

            <span>Join Our Team</span>

            <span className="text-base transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function getMemberDescription(role: string) {
  switch (role) {
    case "Chief Executive Officer":
      return "Driving Sarzameen's vision and building a better real estate experience across Pakistan.";

    case "Chief Operating Officer":
      return "Ensuring seamless operations and an exceptional experience for our users.";

    case "Head of Sales":
      return "Helping clients discover the right property opportunities with confidence.";

    case "Head of Marketing":
      return "Building Sarzameen's brand and connecting our platform with a growing community.";

    default:
      return "Helping make property buying, selling and investing simpler for everyone.";
  }
}
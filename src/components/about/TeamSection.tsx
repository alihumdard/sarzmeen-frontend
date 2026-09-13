import Image from "next/image";
import Link from "next/link";
import { LinkedInIcon, UserPlusIcon } from "@/components/ui/Icons";
import { team } from "@/constants/aboutContent";

/**
 * Placeholder portrait — every member points at the same file for now.
 * Drop your own photo at this path and all cards pick it up; once the API
 * provides team records each member brings its own URL.
 */
const MEMBER_PHOTO = "/images/team-1.jpg";

export default function TeamSection() {
  return (
    <section className="bg-white pb-14">
      <div className="container-page">
        <p className="text-center text-[11px] font-bold tracking-[0.12em] text-primary">
          {team.eyebrow}
        </p>

        <h2 className="mt-3 text-center text-[24px] font-bold text-heading sm:text-[28px]">
          {team.heading}
        </h2>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.members.map((member) => (
            <li
              key={member.id}
              className="overflow-hidden rounded-lg border border-border bg-white"
            >
              <div className="relative h-[190px]">
                <Image
                  src={MEMBER_PHOTO}
                  alt={member.name}
                  fill
                  sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col items-center p-4 text-center">
                <h3 className="text-[14px] font-bold text-heading">
                  {member.name}
                </h3>

                <p className="mt-1 text-[11px] text-muted">{member.role}</p>

                <Link
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on LinkedIn`}
                  className="mt-3 flex h-7 w-7 items-center justify-center rounded bg-primary-light text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  <LinkedInIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 rounded-md border border-border bg-white px-6 py-3 text-[12px] font-semibold text-heading transition-colors hover:border-primary hover:text-primary"
          >
            <UserPlusIcon className="h-4 w-4" />
            Join Our Team
          </Link>
        </div>
      </div>
    </section>
  );
}

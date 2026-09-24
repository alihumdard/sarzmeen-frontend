import {
  AwardIcon,
  BuildingIcon,
  HandshakeIcon,
  SmileStatIcon,
  UsersIcon,
} from "@/components/ui/Icons";
import AnimatedCounter from "@/components/about/AnimatedCounter";
import { aboutStats } from "@/constants/aboutContent";

/** Icons in the same order as the stats in the content file. */
const statIcons = [
  BuildingIcon,
  UsersIcon,
  SmileStatIcon,
  HandshakeIcon,
  AwardIcon,
];

export default function AboutStats() {
  return (
    <section className="bg-white pb-14">
      <div className="container-page">
        <dl className="grid grid-cols-2 gap-y-8 rounded-lg border border-border bg-white px-4 py-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0">
          {aboutStats.map((stat, index) => {
            const Icon = statIcons[index];

            return (
              <div
                key={stat.id}
                className="flex items-center justify-center gap-3 px-2 lg:border-r lg:border-border lg:last:border-r-0"
              >
                <Icon className="h-8 w-8 shrink-0 text-primary" />

                <div className="min-w-0">
                  <dd className="text-[20px] font-bold leading-none text-heading">
                    <AnimatedCounter value={stat.value} />
                  </dd>
                  <dt className="mt-1.5 truncate text-[11px] text-muted">
                    {stat.label}
                  </dt>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

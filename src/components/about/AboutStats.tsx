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
        <dl className="grid grid-cols-2 place-items-center gap-y-8 rounded-lg border border-border bg-white px-4 py-8 sm:grid-cols-3 sm:place-items-stretch lg:grid-cols-5 lg:gap-y-0">
          {aboutStats.map((stat, index) => {
            const Icon = statIcons[index];

            return (
              /*
                Side by side the labels had nowhere to go and were truncated
                to "Verified Properti…". Stacked and centred on a phone they
                fit whole; the row returns from sm: where there is width for
                it.
              */
              <div
                key={stat.id}
                className="flex flex-col items-center gap-2 px-2 text-center sm:flex-row sm:gap-3 sm:text-left lg:border-r lg:border-border lg:last:border-r-0"
              >
                <Icon className="h-8 w-8 shrink-0 text-primary" />

                <div className="min-w-0">
                  <dd className="text-[20px] font-bold leading-none text-heading">
                    <AnimatedCounter value={stat.value} />
                  </dd>
                  <dt className="mt-1.5 text-[11px] leading-4 text-muted">
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

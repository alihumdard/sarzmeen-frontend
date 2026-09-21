/**
 * Placeholder client reviews for the home page testimonials section.
 *
 * Same shape a "reviews" API endpoint would return later — avatar, name,
 * city, rating, quote and a relative timestamp — so swapping this constant
 * for a real fetch later is a one-line change in Testimonials.tsx. Avatars
 * are placeholder photos (i.pravatar.cc, allow-listed in next.config.ts);
 * swap for real uploaded photos once reviews have a backend.
 */

export type Testimonial = {
  id: string;
  avatar: string;
  name: string;
  city: string;
  rating: number;
  purchase: string;
  quote: string;
  timeAgo: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    avatar: "https://i.pravatar.cc/150?img=23",
    name: "Mubashir Ali",
    city: "Lahore",
    rating: 5,
    purchase: "Bought a 1 Kanal House in DHA Phase 6",
    quote:
      "Sarzmeen made buying our first house stress-free. Every listing was exactly as described, and the agent stayed with us till the final transfer. Highly recommend them to anyone buying in Lahore.",
    timeAgo: "5 months ago",
  },
  {
    id: "t2",
    avatar: "https://i.pravatar.cc/150?img=41",
    name: "Chand Butt",
    city: "Lahore",
    rating: 5,
    purchase: "Invested in Bahria Orchard Apartments",
    quote:
      "I compared five different portals before deciding — Sarzmeen had the most accurate pricing and the verified badge actually meant something. The support team followed up at every step.",
    timeAgo: "5 months ago",
  },
  {
    id: "t3",
    avatar: "https://i.pravatar.cc/150?img=8",
    name: "Hussnain Hussain",
    city: "Islamabad",
    rating: 5,
    purchase: "Rented an office in Blue Area",
    quote:
      "These are truly professional agents with a very cooperative team. Found a commercial space within a week — the filters saved me hours of scrolling through irrelevant listings.",
    timeAgo: "4 months ago",
  },
  {
    id: "t4",
    avatar: "https://i.pravatar.cc/150?img=56",
    name: "Usman Ghazi",
    city: "Karachi",
    rating: 4,
    purchase: "Sold a plot in Bahria Town Karachi",
    quote:
      "Listed my plot on a Monday, had three serious buyers by Thursday. The team followed up on every inquiry so I didn't have to chase anyone myself.",
    timeAgo: "3 months ago",
  },
  {
    id: "t5",
    avatar: "https://i.pravatar.cc/150?img=29",
    name: "Ayesha Malik",
    city: "Lahore",
    rating: 5,
    purchase: "Bought a 5 Marla Plot in DHA Phase 9",
    quote:
      "Transparent pricing, no hidden agent fees, and the documentation support was excellent for a first-time buyer like me. Couldn't have asked for a smoother process.",
    timeAgo: "2 months ago",
  },
  {
    id: "t6",
    avatar: "https://i.pravatar.cc/150?img=62",
    name: "Zain Abbas",
    city: "Multan",
    rating: 5,
    purchase: "Bought a 3 Marla House",
    quote:
      "The property matched every photo and detail from the listing. Genuinely the most reliable real estate experience I've had online — will use Sarzmeen again.",
    timeAgo: "1 month ago",
  },
];

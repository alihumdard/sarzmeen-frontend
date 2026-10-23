/**
 * Copy for the Services page. Kept here, like the About page content, so the
 * wording can be edited in one place and moved to the CMS later.
 */

export const servicesIntro = {
  eyebrow: "WHAT WE DO",
  heading: "Services for Buyers, Sellers and Developers",
  paragraphs: [
    "Sarzameen.com is more than a listing site. We work with buyers finding their first home, owners selling without an agent, and developers launching a project — each needs something different from us.",
    "Everything below is handled by our own team in Lahore. Tell us what you are working on and we will say plainly whether we can help.",
  ],
};

export type Service = {
  id: string;
  title: string;
  summary: string;
  /** What the client actually receives. */
  points: string[];
  /** Icon key, mapped to an icon from the shared library. */
  icon:
    | "handshake"
    | "document"
    | "search"
    | "globe"
    | "camera"
    | "chart";
  /** One-line outcome, shown under the title. */
  outcome: string;
  /** The two we lead with; these get a wider card at the top of the grid. */
  featured?: boolean;
};

export const services: Service[] = [
  {
    id: "property-dealing",
    outcome: "From first viewing to transfer",
    title: "Property Dealing",
    summary:
      "Buying, selling or renting — we handle the search, the viewings and the paperwork that follows.",
    points: [
      "Shortlists built around your budget and the areas you are considering",
      "Viewings arranged and attended with you",
      "Registry and ownership checks before any token is paid",
      "Negotiation and transfer handled end to end",
    ],
    icon: "handshake",
    featured: true,
  },
  {
    id: "payment-plans",
    outcome: "A schedule your buyers can read",
    title: "Payment Plan Creation",
    summary:
      "Structured instalment plans for developers, worked out to the rupee and ready to publish.",
    points: [
      "Booking, confirmation, instalments, balloons and possession split across any duration",
      "Plans checked both ways — set a percentage or a monthly figure and the rest follows",
      "A schedule your buyers can read, download and compare",
      "Published straight to your project page on Sarzameen.com",
    ],
    icon: "document",
    featured: true,
  },
  {
    id: "seo",
    outcome: "Found by people already searching",
    title: "SEO & Digital Marketing",
    summary:
      "Getting your project found by people already searching for it.",
    points: [
      "Keyword research for the areas and property types you sell in",
      "Page titles, descriptions and content written for search",
      "Technical fixes: speed, mobile, indexing and structured data",
      "Monthly reporting on rankings and enquiries, not vanity numbers",
    ],
    icon: "search",
  },
  {
    id: "websites",
    outcome: "A site your team can run",
    title: "Property Website Development",
    summary:
      "Listing websites for agencies and developers, built the way this one is.",
    points: [
      "Property and project listings with search, filters and enquiry forms",
      "An admin panel your team can run without a developer",
      "Payment plan calculators and downloadable schedules",
      "Fast on a phone, which is where most of your buyers are",
    ],
    icon: "globe",
  },
  {
    id: "photography",
    outcome: "Listings people actually open",
    title: "Photography & Virtual Tours",
    summary:
      "Listings with good photographs get opened. The rest get scrolled past.",
    points: [
      "Professional interior and exterior photography",
      "Drone footage for plots, societies and high-rise projects",
      "Video walkthroughs for the listing and for social media",
      "Images sized and optimised for the web, ready to upload",
    ],
    icon: "camera",
  },
  {
    id: "advisory",
    outcome: "A straight answer before you commit",
    title: "Investment Advisory",
    summary:
      "An honest read on what an area is doing before you commit to it.",
    points: [
      "Area-by-area price trends and rental yields",
      "Developer track record and possession risk",
      "Comparison of projects on total cost, not headline price",
      "A written recommendation you can act on or ignore",
    ],
    icon: "chart",
  },
];

/**
 * Figures for the band under the intro. Deliberately plain claims we can
 * stand behind, not invented numbers.
 */
export const servicesStats = [
  { value: "6", label: "Services under one roof" },
  { value: "Lahore", label: "Our own team, on the ground" },
  { value: "End to end", label: "Search through to transfer" },
  { value: "No fee", label: "Until we have something for you" },
];

export const servicesCta = {
  heading: "Not sure which of these you need?",
  description:
    "Tell us what you are trying to do and we will point you at the right one — or tell you if we are not the right people for it.",
  buttonLabel: "Get in touch",
  buttonHref: "/contact",
};

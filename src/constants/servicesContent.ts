/**
 * Copy around the Services page. The services themselves are admin-managed
 * and come from the API; what is left here is the surrounding wording.
 */

export const servicesIntro = {
  eyebrow: "WHAT WE DO",
  heading: "Services for Buyers, Sellers and Developers",
  paragraphs: [
    "Sarzameen.com is more than a listing site. We work with buyers finding their first home, owners selling without an agent, and developers launching a project — each needs something different from us.",
    "Everything below is handled by our own team in Lahore. Tell us what you are working on and we will say plainly whether we can help.",
  ],
};

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

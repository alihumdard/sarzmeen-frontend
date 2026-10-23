/**
 * Header navigation.
 *
 * Edit the labels/links here and both the desktop nav and the mobile menu
 * update together — the Header component never hardcodes a menu item.
 */

export type NavChild = {
  name: string;
  href: string;
  /**
   * Renders set apart at the foot of the dropdown — "View All Properties"
   * reads as a way out of the menu rather than another choice within it.
   * Marked rather than inferred from position, so an ordinary last entry
   * keeps the normal style.
   */
  isFooterLink?: boolean;
};

export type NavItem = {
  name: string;
  href: string;
  children?: NavChild[];
};

export const mainNavigation: NavItem[] = [
  {
    /*
     * `purpose=buy` is not one of the API's purposes (sale/rent/installment)
     * and `type=home` is not a type slug, so these links filtered nothing.
     * Each now carries the slugs its group actually covers.
     */
    name: "Buy Properties",
    href: "/properties?purpose=sale",
    children: [
      {
        name: "Homes for Sale",
        href: "/properties?purpose=sale&type=house,villa,townhouse,duplex,upper-portion,lower-portion,farm-house",
      },
      {
        name: "Plots for Sale",
        href: "/properties?purpose=sale&type=residential-plot,commercial-plot,agricultural-land,industrial-land,plot-file",
      },
      {
        name: "Commercial for Sale",
        href: "/properties?purpose=sale&type=shop,office,showroom,factory,warehouse,building,commercial-plaza",
      },
      // Sits last so the dropdown always offers a way to the full listing.
      { name: "View All Properties", href: "/properties", isFooterLink: true },
    ],
  },
  { name: "Rent", href: "/rent" },
  { name: "Projects", href: "/projects" },
  { name: "Agents", href: "/agents" },
  { name: "Blogs", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  {
    /*
     * A heading rather than a link to any one page, so further pages can
     * join it without crowding the header. Sits last, where its dropdown
     * has room to open without covering other items.
     */
    name: "More",
    href: "/services",
    children: [
      { name: "Payment Plan Calculator", href: "/calculator" },
      { name: "Media", href: "/media" },
      { name: "Services", href: "/services" },
    ],
  },
];

/** Sales/support number used by the floating WhatsApp button. */
export const whatsappNumber = "923001234567";

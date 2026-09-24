/**
 * Header navigation.
 *
 * Edit the labels/links here and both the desktop nav and the mobile menu
 * update together — the Header component never hardcodes a menu item.
 */

export type NavChild = {
  name: string;
  href: string;
};

export type NavItem = {
  name: string;
  href: string;
  children?: NavChild[];
};

export const mainNavigation: NavItem[] = [
  {
    name: "Buy Properties",
    href: "/properties?purpose=buy",
    children: [
      { name: "Homes for Sale", href: "/properties?purpose=buy&type=home" },
      { name: "Plots for Sale", href: "/properties?purpose=buy&type=plot" },
      {
        name: "Commercial for Sale",
        href: "/properties?purpose=buy&type=commercial",
      },
    ],
  },
  { name: "Projects", href: "/projects" },
  { name: "Agents", href: "/agents" },
  { name: "Blogs", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

/** Sales/support number used by the floating WhatsApp button. */
export const whatsappNumber = "923001234567";

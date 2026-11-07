export const site = {
  name: "Dr. Joab Odhiambo",
  fullName: "Dr. Joab Onyango Odhiambo",
  tagline: "Actuary | Public Policy Analyst | Educator",
  description:
    "Award-winning actuary, public policy analyst and educator. Research, publications, and e-learning courses in actuarial science, data science and public policy.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "G-H1FN104STH",
  contact: {
    email: "profjodhiambo@gmail.com",
    phone: "+254 104 552 943",
    phoneHref: "tel:+254104552943",
    affiliation: "University of Nairobi",
  },
  instituteUrl: "https://jodhiamboinstitute.co.ke",
  designer: { name: "Tasflex Tech", url: "https://designers.tasflex.co.ke/" },
} as const;

export type NavItem = { href: string; label: string };

export const mainNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/expertise", label: "Expertise" },
  { href: "/publications", label: "Publications" },
  { href: "/courses", label: "Courses" },
  { href: "/pricing", label: "Pricing" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export type SocialNetwork = "facebook" | "linkedin" | "instagram" | "x" | "bluesky" | "tiktok";

export const socialLinks: { network: SocialNetwork; label: string; href: string }[] = [
  { network: "facebook", label: "Facebook", href: "https://web.facebook.com/onyango.ratego" },
  { network: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/dr-joab-o-22b91752/" },
  { network: "instagram", label: "Instagram", href: "https://www.instagram.com/dr_jodhiambo/" },
  { network: "x", label: "X (Twitter)", href: "https://x.com/Dr_Jodhiambo" },
  // TODO: confirm this handle. The original link used "bluesky.app", which is not
  // Bluesky's domain; profiles live at bsky.app/profile/<handle>.
  { network: "bluesky", label: "Bluesky", href: "https://bsky.app/profile/profjoab.bluesky.social" },
  { network: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@dr_joab" },
];

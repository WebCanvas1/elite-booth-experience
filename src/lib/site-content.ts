import { DEFAULT_PACKAGES, type Package } from "./packages";

export type AboutContent = {
  eyebrow: string;
  heading: string;
  body: string;
  highlights: string[];
  image: string;
};

export type ContactContent = {
  heading: string;
  subtext: string;
  phone: string;
  email: string;
  location: string;
  instagram: string;
  facebook: string;
};

export type SiteContent = {
  packages: Package[];
  gallery: string[];
  about: AboutContent;
  contact: ContactContent;
};

export const DEFAULT_GALLERY: string[] = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=900&q=80",
];

export const DEFAULT_ABOUT: AboutContent = {
  eyebrow: "About Us",
  heading: "Making your celebration unforgettable",
  body:
    "At Elite MagicBooth, we believe every event deserves more than just photos — it deserves memories that last. From intimate baby showers to grand weddings and polished corporate functions, our team brings warmth, style, and a touch of magic to every booking. Our friendly attendants, curated themed props, high-quality prints, fully custom templates, instant SMS & QR sharing, and beautiful digital galleries make sure your guests leave smiling.",
  highlights: [
    "Premium Photobooth Hire",
    "Friendly Attendants",
    "Custom Templates",
    "Melbourne Events",
  ],
  image:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
};

export const DEFAULT_CONTACT: ContactContent = {
  heading: "Let's create something magical",
  subtext:
    "Tell us about your event and we'll craft the perfect photobooth experience. Quotes returned within 24 hours.",
  phone: "0419 678 189",
  email: "elitemagicbooth@gmail.com",
  location: "Melbourne, Victoria",
  instagram: "",
  facebook: "",
};

export const DEFAULT_CONTENT: SiteContent = {
  packages: DEFAULT_PACKAGES,
  gallery: DEFAULT_GALLERY,
  about: DEFAULT_ABOUT,
  contact: DEFAULT_CONTACT,
};

export function mergeContent(partial: Partial<SiteContent> | null | undefined): SiteContent {
  if (!partial) return DEFAULT_CONTENT;
  return {
    packages: Array.isArray(partial.packages) && partial.packages.length ? partial.packages : DEFAULT_PACKAGES,
    gallery: Array.isArray(partial.gallery) && partial.gallery.length ? partial.gallery : DEFAULT_GALLERY,
    about: { ...DEFAULT_ABOUT, ...(partial.about || {}) },
    contact: { ...DEFAULT_CONTACT, ...(partial.contact || {}) },
  };
}

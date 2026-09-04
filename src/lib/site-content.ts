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

export type EventItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export type PastEventItem = {
  id: string;
  title: string;
  date: string;
  coverImage: string;
  galleryUrl: string;
  passcode?: string;
  note: string;
};

export type EventVideoItem = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  featured?: boolean;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type AddOnItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  popular: boolean;
};

export type BackdropItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  popular: boolean;
};

export type ReviewItem = {
  id: string;
  name: string;
  rating: number;
  eventType: string;
  review: string;
};

export type PolicySection = {
  id: string;
  heading: string;
  body: string;
};

export type PolicyContent = {
  heading: string;
  intro: string;
  sections: PolicySection[];
};

export type SiteContent = {
  packages: Package[];
  gallery: string[];
  about: AboutContent;
  contact: ContactContent;
  events: EventItem[];
  pastEvents: PastEventItem[];
  eventVideos: EventVideoItem[];
  addOns: AddOnItem[];
  backdrops: BackdropItem[];
  faqs: FAQItem[];
  reviews: ReviewItem[];
  terms: PolicyContent;
  privacy: PolicyContent;
  googleReviewLink: string;
  googleReviewsEmbedCode: string;
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

const evt = (title: string, description: string, image: string): EventItem => ({
  id: title.toLowerCase().replace(/\s+/g, "-"),
  title,
  description,
  image,
});

export const DEFAULT_EVENTS: EventItem[] = [
  evt("Weddings", "Timeless photobooth moments for your big day.", "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80"),
  evt("Birthdays", "Make every birthday a magical celebration.", "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80"),
  evt("Corporate Events", "Polished, branded experiences for teams & guests.", "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=80"),
  evt("Engagements", "Capture the joy of saying yes.", "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80"),
  evt("Baby Showers", "Soft, joyful memories for growing families.", "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80"),
  evt("School Formals", "Glamorous keepsakes for a night to remember.", "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80"),
  evt("Bridal Showers", "Elegant moments for the bride-to-be.", "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80"),
  evt("Cultural Events", "Celebrate tradition with style and prints to keep.", "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=900&q=80"),
  evt("Christmas Parties", "Festive fun for family, friends & coworkers.", "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=900&q=80"),
  evt("Private Parties", "Whatever the occasion — we bring the magic.", "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80"),
];

export const DEFAULT_PAST_EVENTS: PastEventItem[] = [
  {
    id: "sample-event",
    title: "Sample Event Gallery",
    date: "March 2026",
    coverImage:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    galleryUrl: "https://your-cloud-gallery-link.com",
    passcode: "",
    note: "Password protected gallery. Please use the password shared with you.",
  },
];

export const DEFAULT_EVENT_VIDEOS: EventVideoItem[] = [
  {
    id: "featured-event-highlight",
    title: "Featured Event Highlight",
    description:
      "A short highlight video showing the photobooth experience, guest reactions and the fun atmosphere created at an event.",
    youtubeUrl: "",
    videoUrl: "",
    thumbnailUrl: "",
    featured: true,
  },
  {
    id: "wedding-booth-moments",
    title: "Wedding Booth Moments",
    description:
      "A glimpse of guests enjoying the booth, props, prints and instant memories at a wedding celebration.",
    youtubeUrl: "",
    videoUrl: "",
    thumbnailUrl: "",
  },
  {
    id: "party-photo-booth-fun",
    title: "Party Photo Booth Fun",
    description:
      "Fun event moments captured through the photobooth experience.",
    youtubeUrl: "",
    videoUrl: "",
    thumbnailUrl: "",
  },
];

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "booking-process",
    question: "How do I book Elite MagicBooth?",
    answer:
      "Simply submit an enquiry through the website and we’ll get back to you with availability, package options, and booking details.",
  },
  {
    id: "event-setup",
    question: "How much space do you need for setup?",
    answer:
      "We generally require a safe, level setup area with access to power. Exact space requirements may depend on the selected booth, backdrop, and add-ons.",
  },
  {
    id: "gallery-access",
    question: "How do guests access event photos?",
    answer:
      "Event galleries can be shared through a secure cloud gallery link. Password details can be provided if required.",
  },
  {
    id: "customisation",
    question: "Can the photo template be customised?",
    answer:
      "Yes, photo templates can be customised to suit your event theme, colours, names, branding, or special occasion.",
  },
];

const ad = (title: string, description: string, price: string, image: string, popular = false): AddOnItem => ({
  id: title.toLowerCase().replace(/\s+/g, "-"),
  title,
  description,
  price,
  image,
  popular,
});

export const DEFAULT_ADDONS: AddOnItem[] = [
  ad("Audio Guest Book", "Vintage phone for heartfelt voice messages.", "$250", "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&w=900&q=80", true),
  ad("Red Carpet & Bollards", "Welcome guests in true VIP style.", "$120", "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80"),
  ad("Designer Scrapbook Album", "Hand-finished keepsake of every print.", "$95", "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=900&q=80"),
  ad("Extra Prints", "Double prints for every photo strip.", "$80", "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=80"),
  ad("Neon Signs", "Custom glow for that wow moment.", "From $180", "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80"),
  ad("Custom Props", "Tailored props themed to your event.", "$60", "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80"),
  ad("Instant Sharing", "SMS & QR sharing for every guest.", "Included", "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80"),
  ad("Additional Event Hours", "Extend the fun beyond your package.", "$120 / hr", "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80"),
];

export const DEFAULT_BACKDROPS: BackdropItem[] = [];

const sec = (heading: string, body: string): PolicySection => ({
  id: heading.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  heading,
  body,
});

export const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: "1",
    name: "Sarah M.",
    rating: 5,
    eventType: "Wedding",
    review:
      "Elite MagicBooth made our wedding unforgettable. The booth looked amazing and our guests absolutely loved it.",
  },
  {
    id: "2",
    name: "Daniel R.",
    rating: 5,
    eventType: "Birthday Party",
    review:
      "Professional service, great communication and fantastic quality prints. Highly recommend!",
  },
  {
    id: "3",
    name: "Emily T.",
    rating: 5,
    eventType: "Corporate Event",
    review:
      "A huge hit at our corporate event. The custom branding was perfect.",
  },
];

export const DEFAULT_TERMS: PolicyContent = {
  heading: "Terms & Conditions",
  intro:
    "Please read these Terms & Conditions carefully before booking with Elite MagicBooth. By placing a booking you agree to be bound by the terms below.",
  sections: [
    sec("Booking Confirmation", "A booking is confirmed only after we receive a signed booking form and the required deposit. Until both are received, dates remain provisional."),
    sec("Deposits & Payments", "A non-refundable deposit of 25% is required to secure your date. The remaining balance is due no later than 7 days prior to the event."),
    sec("Late Bookings", "Bookings made within 14 days of the event require full payment upfront. Availability for short-notice bookings cannot be guaranteed."),
    sec("Cancellation & Refund Policy", "Deposits are non-refundable. Cancellations made within 14 days of the event will be charged the full balance. Rescheduling is offered subject to availability."),
    sec("Liability Disclaimer", "Elite MagicBooth is not liable for any indirect, incidental, or consequential loss arising from the use of our services, including delays caused by venue or third-party issues."),
    sec("Intellectual Property Ownership", "All templates, design assets, and software remain the intellectual property of Elite MagicBooth. Photos taken belong to the client for personal use."),
    sec("Access & Setup Requirements", "The venue must provide safe, level access, a power outlet within 5m, and a clear 3m x 3m setup space. Additional setup time may be required for upstairs venues."),
    sec("Social Media & Marketing Usage", "We may use event images for portfolio and social media purposes unless the client opts out in writing prior to the event."),
    sec("Equipment Damage Responsibility", "The client is responsible for any damage to our equipment caused by guests, the venue, or unsafe conditions during the event."),
    sec("Event Timing & Overtime", "Idle and operating hours start at the agreed time. Overtime is billed at $120 per hour and is subject to attendant availability."),
    sec("Force Majeure", "Elite MagicBooth is not liable for failure to perform due to events beyond our reasonable control, including extreme weather, illness, power outages, or government restrictions."),
  ],
};

export const DEFAULT_PRIVACY: PolicyContent = {
  heading: "Privacy Policy",
  intro:
    "Your privacy matters to us. This policy explains how Elite MagicBooth collects, uses, and protects your personal information.",
  sections: [
    sec("Information We Collect", "We collect information you provide directly to us such as your name, email, phone number, event details, and any messages sent through our enquiry form."),
    sec("How Enquiry Data Is Used", "Enquiry data is used solely to respond to your request, provide quotes, manage your booking, and improve our service."),
    sec("Data Storage & Security", "Your information is stored securely with industry-standard safeguards. We never sell your personal information to third parties."),
    sec("Marketing Communications", "We may occasionally send you updates or offers. You can opt out at any time by replying to any email or contacting us directly."),
    sec("Third-Party Services", "We use trusted third-party services (e.g. email delivery, hosting) that may process limited information under their own privacy policies."),
    sec("Cookies", "Our website may use minimal cookies to improve performance and analytics. You can disable cookies in your browser settings at any time."),
    sec("Contact Information", "For any privacy-related questions, contact us at elitemagicbooth@gmail.com or call 0419 678 189."),
    sec("Your Rights", "You have the right to access, correct, or request deletion of your personal information at any time by contacting us."),
  ],
};

export const DEFAULT_CONTENT: SiteContent = {
  packages: DEFAULT_PACKAGES,
  gallery: DEFAULT_GALLERY,
  about: DEFAULT_ABOUT,
  contact: DEFAULT_CONTACT,
  events: DEFAULT_EVENTS,
  pastEvents: DEFAULT_PAST_EVENTS,
  eventVideos: DEFAULT_EVENT_VIDEOS,
  addOns: DEFAULT_ADDONS,
  backdrops: DEFAULT_BACKDROPS,
  faqs: DEFAULT_FAQS,
  reviews: DEFAULT_REVIEWS,
  terms: DEFAULT_TERMS,
  privacy: DEFAULT_PRIVACY,
  googleReviewLink: "",
  googleReviewsEmbedCode: "",
};

export function mergeContent(
  partial: Partial<SiteContent> | null | undefined
): SiteContent {
  if (!partial) return DEFAULT_CONTENT;

  return {
    packages:
      Array.isArray(partial.packages) && partial.packages.length
        ? partial.packages
        : DEFAULT_PACKAGES,

    gallery:
      Array.isArray(partial.gallery) && partial.gallery.length
        ? partial.gallery
        : DEFAULT_GALLERY,

    about: { ...DEFAULT_ABOUT, ...(partial.about || {}) },

    contact: { ...DEFAULT_CONTACT, ...(partial.contact || {}) },

    events:
      Array.isArray(partial.events) && partial.events.length
        ? partial.events
        : DEFAULT_EVENTS,

    pastEvents:
      Array.isArray(partial.pastEvents) && partial.pastEvents.length
        ? partial.pastEvents
        : DEFAULT_PAST_EVENTS,

    eventVideos:
      Array.isArray(partial.eventVideos) && partial.eventVideos.length
        ? partial.eventVideos
        : DEFAULT_EVENT_VIDEOS,

    addOns:
      Array.isArray(partial.addOns) && partial.addOns.length
        ? partial.addOns
        : DEFAULT_ADDONS,

    backdrops:
      Array.isArray(partial.backdrops)
        ? partial.backdrops
        : DEFAULT_BACKDROPS,

    faqs:
      Array.isArray(partial.faqs) && partial.faqs.length
        ? partial.faqs
        : DEFAULT_FAQS,

    reviews:
      Array.isArray(partial.reviews) && partial.reviews.length
        ? partial.reviews
        : DEFAULT_REVIEWS,

    terms: partial.terms
      ? {
          ...DEFAULT_TERMS,
          ...partial.terms,
          sections:
            Array.isArray(partial.terms.sections) &&
            partial.terms.sections.length
              ? partial.terms.sections
              : DEFAULT_TERMS.sections,
        }
      : DEFAULT_TERMS,

    privacy: partial.privacy
      ? {
          ...DEFAULT_PRIVACY,
          ...partial.privacy,
          sections:
            Array.isArray(partial.privacy.sections) &&
            partial.privacy.sections.length
              ? partial.privacy.sections
              : DEFAULT_PRIVACY.sections,
        }
      : DEFAULT_PRIVACY,

    googleReviewLink:
      typeof partial.googleReviewLink === "string"
        ? partial.googleReviewLink
        : DEFAULT_CONTENT.googleReviewLink,

    googleReviewsEmbedCode:
      typeof partial.googleReviewsEmbedCode === "string"
        ? partial.googleReviewsEmbedCode
        : DEFAULT_CONTENT.googleReviewsEmbedCode,
  };
}

export type Package = {
  id: string;
  name: string;
  price: number;
  image: string;
  features: string[];
  popular?: boolean;
};

export const DEFAULT_PACKAGES: Package[] = [
  {
    id: "basic",
    name: "Basic",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    features: [
      "3 Hour Event Coverage",
      "Unlimited Print Sessions, 2 copies per session",
      "Friendly On-site Attendant",
      "Backdrop Included",
      "Themed Event Props",
      "Original Images provided Post-Event via digital gallery, email, or USB",
      "Customised 2x6 Photo Templates",
      "Set Up & Removal Included",
      "Custom Start / Welcome Screen",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 600,
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
    features: [
      "4 Hour Event Coverage",
      "Unlimited Print Sessions, 2 copies per session",
      "Friendly On-site Attendant",
      "Backdrop Included",
      "Themed Event Props",
      "Original Images provided Post-Event via digital gallery, email, or USB",
      "Customised 2x6 Photo Templates",
      "Set Up & Removal Included",
      "Sharing via SMS or QR Code",
      "Custom Start Screen Design",
      "Designer Scrapbook Album",
    ],
  },
  {
    id: "classic",
    name: "Classic",
    price: 700,
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    features: [
      "5 Hour Event Coverage",
      "Unlimited Print Sessions, 2 copies per session",
      "Friendly On-site Attendant",
      "Backdrop Included",
      "Themed Event Props",
      "Customised 2x6 Photo Templates",
      "Set Up & Removal Included",
      "Designer Scrapbook Album",
      "Custom Start / Welcome Screen",
      "Sharing via SMS or QR Code",
      "Original Images provided Post-Event via digital gallery, email, or USB",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: 800,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    features: [
      "6 Hour Event Coverage",
      "Unlimited Print Sessions, 2 copies per session",
      "Friendly On-site Attendant",
      "Backdrop Included",
      "Themed Event Props",
      "Original Images provided Post-Event via digital gallery, email, or USB",
      "Customised 2x6 Photo Templates",
      "Set Up & Removal Included",
      "Sharing via SMS or QR Code",
      "Custom Start / Welcome Screen",
      "Designer Scrapbook Album",
    ],
  },
];

export const ADMIN_USERNAME = "MagicBooth";
export const ADMIN_PASSWORD = "Melbourne@2026";

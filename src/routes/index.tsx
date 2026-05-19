import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, Phone, Mail, MapPin, Camera, Sparkles, Heart, Users, ArrowRight, Star } from "lucide-react";
import { toast } from "sonner";
import heroImg from "@/assets/hero.jpg";
import logo from "@/assets/logo.png";
import { DEFAULT_PACKAGES, type Package } from "@/lib/packages";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elite MagicBooth — Premium Photobooth Hire Melbourne" },
      {
        name: "description",
        content:
          "Premium photobooth hire in Melbourne for weddings, birthdays, corporate events & more. Unlimited prints, custom templates, props, backdrops & digital sharing.",
      },
      { property: "og:title", content: "Elite MagicBooth — Premium Photobooth Hire" },
      { property: "og:description", content: "Stylish photobooth experiences for unforgettable events in Melbourne." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Home,
});

const GALLERY = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=900&q=80",
];

function Home() {
  const [packages, setPackages] = useState<Package[]>(DEFAULT_PACKAGES);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((d: { packages?: Package[] }) => {
        if (d.packages?.length) setPackages(d.packages);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <SiteHeader />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-beige">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Elite MagicBooth photobooth setup" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center w-full">
          <div className="text-foreground animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-card/80 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-widest text-gold mb-6 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" /> Melbourne's Premium Photobooth
            </div>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6">
              Premium Photobooth Hire for{" "}
              <span className="text-gradient-gold italic">Unforgettable</span> Events
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Elite MagicBooth delivers stylish photobooth experiences with unlimited prints,
              custom templates, designer props, elegant backdrops, and instant digital sharing —
              tailored to your event.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#packages"
                className="inline-flex items-center gap-2 rounded-full gradient-gold px-7 py-3.5 font-semibold text-ink shadow-luxe hover:scale-105 transition-transform"
              >
                View Packages
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-card/80 backdrop-blur px-7 py-3.5 font-semibold text-foreground hover:bg-gold hover:text-ink transition"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Camera, label: "Unlimited Prints" },
          { icon: Sparkles, label: "Custom Templates" },
          { icon: Heart, label: "Designer Props" },
          { icon: Users, label: "Friendly Attendants" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="text-center p-6 rounded-3xl bg-card border border-border/60 shadow-luxe/30">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full gradient-gold mb-4">
              <Icon className="h-6 w-6 text-ink" />
            </div>
            <p className="font-serif text-lg">{label}</p>
          </div>
        ))}
      </section>

      {/* Gallery */}
      <section id="gallery" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Moments captured</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">A Gallery of Joy</h2>
          <p className="text-muted-foreground">
            From wedding celebrations to corporate galas — a glimpse of the moments we love creating.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GALLERY.map((src, i) => (
            <div
              key={src}
              className={`overflow-hidden rounded-3xl shadow-luxe ${
                i % 5 === 0 ? "row-span-2 aspect-[3/5]" : "aspect-square"
              }`}
            >
              <img
                src={src}
                alt={`Event moment ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-beige py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80"
              alt="About Elite MagicBooth"
              loading="lazy"
              className="rounded-3xl shadow-luxe w-full aspect-[4/5] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 hidden md:block bg-card rounded-2xl p-6 shadow-luxe border border-border max-w-[220px]">
              <p className="text-3xl font-serif text-gradient-gold">500+</p>
              <p className="text-sm text-muted-foreground">events styled across Melbourne</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">About Us</p>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Making your celebration <span className="italic text-gradient-gold">unforgettable</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At Elite MagicBooth, we believe every event deserves more than just photos — it deserves
              memories that last. From intimate baby showers to grand weddings and polished corporate
              functions, our team brings warmth, style, and a touch of magic to every booking.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our friendly attendants, curated themed props, high-quality prints, fully custom
              templates, instant SMS &amp; QR sharing, and beautiful digital galleries make sure your
              guests leave smiling — and your memories live on long after the night ends.
            </p>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              {["Friendly attendants", "Themed props", "Quality prints", "Custom templates", "SMS / QR sharing", "Digital galleries"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Tailored packages</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">Choose Your Experience</h2>
          <p className="text-muted-foreground">
            Transparent pricing, premium inclusions. Every package can be tailored to your event.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, i) => (
            <div
              key={pkg.id}
              className={`group relative flex flex-col rounded-3xl bg-card border border-border overflow-hidden shadow-luxe hover:-translate-y-2 transition-transform duration-500 ${
                i === 3 ? "ring-2 ring-gold" : ""
              }`}
            >
              {i === 3 && (
                <span className="absolute top-4 right-4 z-10 rounded-full gradient-gold px-3 py-1 text-xs font-semibold text-ink">
                  Most Popular
                </span>
              )}
              <div className="aspect-[4/3] overflow-hidden">
                <img src={pkg.image} alt={pkg.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-serif text-2xl mb-1">{pkg.name}</h3>
                <p className="text-4xl font-serif text-gradient-gold mb-5">${pkg.price}</p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>{f}</span></li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="mt-auto inline-flex items-center justify-center rounded-full gradient-gold px-5 py-3 text-sm font-semibold text-ink hover:scale-105 transition-transform"
                >
                  Enquire Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <ContactSection packages={packages} />

      <SiteFooter />
    </div>
  );
}

function ContactSection({ packages }: { packages: Package[] }) {
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Thank you! We'll be in touch within 24 hours.");
    }, 600);
  };

  return (
    <section id="contact" className="bg-beige text-foreground py-24">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Get in touch</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-6">
            Let's create something <span className="italic text-gradient-gold">magical</span>
          </h2>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Tell us about your event and we'll craft the perfect photobooth experience.
            Quotes returned within 24 hours.
          </p>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <span className="h-10 w-10 inline-flex items-center justify-center rounded-full gradient-gold text-ink flex-shrink-0"><Phone className="h-4 w-4" /></span>
              <div><p className="text-xs uppercase tracking-widest text-gold">Phone</p><a href="tel:0419678189" className="text-foreground hover:text-gold">0419 678 189</a></div>
            </li>
            <li className="flex items-start gap-4">
              <span className="h-10 w-10 inline-flex items-center justify-center rounded-full gradient-gold text-ink flex-shrink-0"><Mail className="h-4 w-4" /></span>
              <div><p className="text-xs uppercase tracking-widest text-gold">Email</p><a href="mailto:elitemagicbooth@gmail.com" className="text-foreground hover:text-gold">elitemagicbooth@gmail.com</a></div>
            </li>
            <li className="flex items-start gap-4">
              <span className="h-10 w-10 inline-flex items-center justify-center rounded-full gradient-gold text-ink flex-shrink-0"><MapPin className="h-4 w-4" /></span>
              <div><p className="text-xs uppercase tracking-widest text-gold">Location</p><p className="text-foreground">Melbourne, Victoria</p></div>
            </li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-3 bg-card text-foreground rounded-3xl p-8 md:p-10 shadow-luxe space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" type="tel" />
            <Field label="Event Date" name="date" type="date" />
            <SelectField label="Event Type" name="eventType" options={["Wedding", "Birthday", "Corporate", "Baby Shower", "Engagement", "Party", "Other"]} />
            <SelectField label="Preferred Package" name="package" options={packages.map((p) => p.name)} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Message</label>
            <textarea name="message" rows={4} className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition" placeholder="Tell us about your event..." />
          </div>
          <button disabled={submitting} type="submit" className="w-full inline-flex items-center justify-center rounded-full gradient-gold px-6 py-4 font-semibold text-ink shadow-luxe hover:scale-[1.02] transition-transform disabled:opacity-60">
            {submitting ? "Sending..." : "Get a Quote"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
      />
    </div>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
      <select
        name={name}
        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
      >
        <option value="">Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
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
      <Hero />


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
                <Link
                  to="/enquire"
                  className="mt-auto inline-flex items-center justify-center rounded-full gradient-gold px-5 py-3 text-sm font-semibold text-ink hover:scale-105 transition-transform"
                >
                  Enquire Now
                </Link>
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

function Hero() {
  const imgRef = useRef<HTMLImageElement>(null);

  // Subtle parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return;
      const y = Math.min(window.scrollY, 600);
      imgRef.current.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(${1 + y * 0.0004})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pre-generated bokeh particles (deterministic so SSR matches client)
  const particles = Array.from({ length: 22 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const left = (seed / 233280) * 100;
    const size = 6 + ((i * 13) % 18);
    const delay = (i * 0.7) % 14;
    const duration = 14 + ((i * 5) % 12);
    const tx = ((i % 2 === 0 ? 1 : -1) * (20 + (i * 7) % 60));
    return { left, size, delay, duration, tx, key: i };
  });

  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-beige isolate">
      {/* Background image with subtle zoom + parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={imgRef}
          src={heroImg}
          alt="Elegant photobooth at a luxury wedding reception"
          className="w-full h-[115%] object-cover animate-hero-zoom will-change-transform"
        />
        {/* Warm cinematic gradient overlays — keep image visible, text legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/55 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        <div
          className="absolute inset-0 opacity-60 mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(60% 60% at 20% 30%, oklch(0.92 0.08 85 / 0.5), transparent 60%), radial-gradient(50% 50% at 85% 75%, oklch(0.78 0.11 80 / 0.35), transparent 65%)",
          }}
        />
      </div>

      {/* Floating bokeh particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.key}
            className="absolute bottom-[-40px] rounded-full bg-gradient-to-br from-[oklch(0.92_0.08_85)] to-[oklch(0.78_0.11_80)] blur-[2px]"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: 0.5,
              ["--tx" as string]: `${p.tx}px`,
              animation: `particleFloat ${p.duration}s linear ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center w-full z-10">
        {/* Left: text */}
        <div className="text-foreground">
          <div
            className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold mb-6 animate-fade-up"
            style={{ animationDelay: "0.05s" }}
          >
            <Sparkles className="h-3.5 w-3.5" /> Melbourne · Luxury Photobooth
          </div>

          <h1
            className="font-serif text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.25rem] leading-[1.02] mb-6 animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            Capture Every <br className="hidden sm:block" />
            Celebration in <span className="shimmer-text italic">Style</span>
          </h1>

          <p
            className="text-base sm:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Premium photobooth experiences for weddings, birthdays, corporate events
            &amp; special occasions — unlimited prints, designer props, and instant
            digital sharing, beautifully tailored to your event.
          </p>

          <div
            className="flex flex-wrap gap-4 animate-fade-up"
            style={{ animationDelay: "0.45s" }}
          >
            <a
              href="#packages"
              className="group relative inline-flex items-center gap-2 rounded-full gradient-gold px-7 py-4 font-semibold text-ink shadow-luxe overflow-hidden transition-transform hover:scale-105 animate-pulse-glow"
            >
              <span className="relative z-10">View Packages</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full glass-card px-7 py-4 font-semibold text-foreground hover:text-ink hover:bg-gold transition"
            >
              Book Your Event
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Trust row */}
          <div
            className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
              <span className="ml-1 font-medium text-foreground">5.0</span>
            </div>
            <span className="h-4 w-px bg-border" />
            <span><strong className="text-foreground">500+</strong> events styled</span>
            <span className="h-4 w-px bg-border hidden sm:inline-block" />
            <span className="hidden sm:inline">Unlimited prints · QR sharing</span>
          </div>
        </div>

        {/* Right: floating glass image card */}
        <div className="relative hidden lg:block animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-luxe ring-1 ring-gold/30">
            <img
              src={heroImg}
              alt="Guests enjoying Elite MagicBooth"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </div>

          {/* Floating logo badge */}
          <div className="absolute -top-6 -left-6 glass-card rounded-2xl p-3 shadow-luxe animate-float">
            <img src={logo} alt="Elite MagicBooth" className="h-14 w-14 rounded-full" />
          </div>

          {/* Floating stat card */}
          <div
            className="absolute -bottom-6 -right-6 glass-card rounded-2xl px-5 py-4 shadow-luxe animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            <p className="text-xs uppercase tracking-widest text-gold mb-1">Loved by</p>
            <p className="font-serif text-2xl text-foreground">500+ Events</p>
            <p className="text-xs text-muted-foreground">across Melbourne</p>
          </div>
        </div>
      </div>

      {/* Curved wave transition */}
      <svg
        className="absolute bottom-0 left-0 w-full text-background z-10"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,64 C240,112 480,112 720,80 C960,48 1200,16 1440,48 L1440,120 L0,120 Z"
        />
      </svg>
    </section>
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

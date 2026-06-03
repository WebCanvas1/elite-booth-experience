import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, Phone, Mail, MapPin, Camera, Sparkles, Heart, Users, ArrowRight, Star, Instagram, Facebook, ExternalLink, Calendar } from "lucide-react";
import { toast } from "sonner";
import heroImg from "@/assets/hero.jpg";
import logo from "@/assets/logo.png";
import { type Package } from "@/lib/packages";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Toaster } from "@/components/ui/sonner";
import { useSiteContent } from "@/hooks/use-site-content";
import type { ContactContent, PastEventItem } from "@/lib/site-content";
import { EventVideos } from "@/components/EventVideos";

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

function Home() {
  const content = useSiteContent();
  const {
    packages,
    gallery,
    about,
    contact,
    events,
    addOns,
    pastEvents,
    faqs,
    eventVideos,
    googleReviewsEmbedCode,
  } = content;

  const [selectedGallery, setSelectedGallery] = useState<PastEventItem | null>(null);
  const [galleryPasscode, setGalleryPasscode] = useState("");
  const [galleryError, setGalleryError] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <SiteHeader />

      <Hero />

      {/* Packages */}
      <section id="packages" className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Tailored packages</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">Choose Your Experience</h2>
          <p className="text-muted-foreground">
            Transparent pricing, premium inclusions. Every package can be tailored to your event.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {packages.map((pkg, i) => (
            <div
              key={pkg.id}
              className={`group relative flex flex-col rounded-3xl bg-card border border-border overflow-hidden shadow-luxe hover:-translate-y-2 transition-transform duration-500 ${
                i === 3 ? "ring-2 ring-gold" : ""
              }`}
            >
              {i === 3 && (
                <span className="absolute top-4 left-4 z-10 rounded-full gradient-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink shadow-luxe">
                  Most Popular
                </span>
              )}

              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={pkg.image} alt={pkg.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-3 right-3 inline-flex items-baseline gap-1 rounded-full gradient-gold px-4 py-2 shadow-luxe">
                  <span className="text-xs font-semibold text-ink/80">$</span>
                  <span className="font-serif text-2xl font-bold text-ink leading-none">{pkg.price}</span>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <h3 className="font-serif text-2xl sm:text-[1.75rem] font-bold text-foreground mb-3 tracking-tight">{pkg.name}</h3>

                <ul className="space-y-2 text-sm text-muted-foreground mb-5 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/enquire"
                  search={{ package: pkg.name }}
                  className="mt-auto inline-flex items-center justify-center rounded-full gradient-gold px-5 py-3.5 text-sm font-bold text-ink shadow-luxe hover:scale-105 transition-transform"
                >
                  Enquire Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add-Ons */}
      <section id="addons" className="bg-beige py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Premium extras</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-4">Add-Ons</h2>
            <p className="text-muted-foreground">Elevate your event with elegant optional extras, hand-picked to add extra magic.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {addOns.map((a) => (
              <div key={a.id} className="group relative flex flex-col rounded-3xl bg-card border border-border overflow-hidden shadow-luxe hover:-translate-y-1.5 transition-transform duration-500">
                {a.popular && (
                  <span className="absolute top-4 left-4 z-10 rounded-full gradient-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink shadow-luxe">
                    Popular
                  </span>
                )}

                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  {a.price && (
                    <div className="absolute bottom-3 right-3 rounded-full bg-card/95 backdrop-blur px-3 py-1.5 text-sm font-semibold text-foreground shadow-luxe border border-border">
                      {a.price}
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-2">{a.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{a.description}</p>

                  <Link
                    to="/enquire"
                    search={{ package: a.title }}
                    className="mt-5 inline-flex items-center justify-center rounded-full gradient-gold px-5 py-3 text-sm font-bold text-ink shadow-luxe hover:scale-105 transition-transform"
                  >
                    Enquire Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/enquire" className="inline-flex items-center gap-2 rounded-full gradient-gold px-7 py-3.5 font-semibold text-ink shadow-luxe hover:scale-105 transition">
              Build Your Package <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Events We Cover */}
      <section id="events" className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Occasions</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-4">Events We Cover</h2>
          <p className="text-muted-foreground">From intimate gatherings to grand celebrations — we bring the magic.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {events.map((ev) => (
            <div key={ev.id} className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-luxe aspect-[3/4] border border-border">
              <img src={ev.image} alt={ev.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-white">
                <h3 className="font-serif text-base sm:text-lg leading-tight mb-1">{ev.title}</h3>
                {ev.description && (
                  <p className="text-xs text-white/80 leading-snug hidden sm:block">{ev.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Event Galleries */}
      <section id="event-galleries" className="bg-beige py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">
              Event Galleries
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-4">
              Past Events
            </h2>

            <p className="text-muted-foreground">
              View selected event galleries from previous events.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="group rounded-3xl bg-card border border-border overflow-hidden shadow-luxe hover:-translate-y-1.5 transition-transform duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 text-gold" />
                    <span>{event.date}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                    {event.title}
                  </h3>

                  {event.note && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {event.note}
                    </p>
                  )}

                  {event.galleryUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGallery(event);
                        setGalleryPasscode("");
                        setGalleryError("");
                      }}
                      className="inline-flex items-center gap-2 rounded-full gradient-gold px-5 py-3 text-sm font-bold text-ink shadow-luxe hover:scale-105 transition-transform"
                    >
                      View Gallery
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Videos */}
      <EventVideos videos={eventVideos} />

      <section id="about" className="bg-beige py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative">
            <img
              src={about.image}
              alt={about.heading}
              loading="lazy"
              className="rounded-3xl shadow-luxe w-full aspect-[4/5] object-cover"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">{about.eyebrow}</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-6 leading-tight">
              {about.heading}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
              {about.body}
            </p>

            {about.highlights.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {about.highlights.map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-gold flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Moments captured</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-4">A Gallery of Joy</h2>
          <p className="text-muted-foreground">
            From wedding celebrations to corporate galas — a glimpse of the moments we love creating.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {gallery.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className={`overflow-hidden rounded-2xl sm:rounded-3xl shadow-luxe ${
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

      {/* Google Reviews */}
      {googleReviewsEmbedCode && (
        <section id="reviews" className="bg-beige py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">
                Reviews
              </p>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-4">
                What Our Clients Say
              </h2>

              <p className="text-muted-foreground">
                Real reviews from happy customers.
              </p>
            </div>

            <div
              className="bg-card rounded-3xl border border-border shadow-luxe p-4 overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: googleReviewsEmbedCode,
              }}
            />
          </div>
        </section>
      )}

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { icon: Camera, label: "Unlimited Prints" },
          { icon: Sparkles, label: "Custom Templates" },
          { icon: Heart, label: "Designer Props" },
          { icon: Users, label: "Friendly Attendants" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="text-center p-5 sm:p-6 rounded-3xl bg-card border border-border/60 shadow-luxe/30">
            <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full gradient-gold mb-3 sm:mb-4">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-ink" />
            </div>
            <p className="font-serif text-base sm:text-lg">{label}</p>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-beige py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">
              FAQ
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Quick answers to common questions about bookings, galleries and event setup.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="bg-card border border-border rounded-2xl p-5 shadow-luxe/30"
              >
                <summary className="cursor-pointer font-serif text-xl text-foreground">
                  {faq.question}
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          {content.googleReviewLink && (
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground mb-4">Loved your experience with us?</p>
              <a
                href={content.googleReviewLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full gradient-gold px-7 py-3.5 font-semibold text-ink shadow-luxe hover:scale-105 transition"
              >
                <Star className="h-4 w-4 fill-ink" />
                Leave a Google Review
              </a>
            </div>
          )}
        </div>
      </section>

      {selectedGallery && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => {
            setSelectedGallery(null);
            setGalleryPasscode("");
            setGalleryError("");
          }}
        >
          <div
            className="bg-card rounded-3xl shadow-luxe border border-border w-full max-w-md p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl text-foreground mb-2">
              Enter Gallery Passcode
            </h3>

            <p className="text-sm text-muted-foreground mb-5">
              Please enter the passcode provided for this event gallery.
            </p>

            {!selectedGallery.passcode ? (
              <p className="rounded-2xl bg-destructive/10 text-destructive px-4 py-3 text-sm">
                Passcode not set. Please contact the event organiser.
              </p>
            ) : (
              <>
                <input
                  value={galleryPasscode}
                  onChange={(e) => {
                    setGalleryPasscode(e.target.value);
                    setGalleryError("");
                  }}
                  placeholder="Enter passcode"
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                />

                {galleryError && (
                  <p className="text-sm text-destructive mt-3">
                    {galleryError}
                  </p>
                )}
              </>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setSelectedGallery(null);
                  setGalleryPasscode("");
                  setGalleryError("");
                }}
                className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted transition"
              >
                Cancel
              </button>

              {selectedGallery.passcode && (
                <button
                  type="button"
                  onClick={() => {
                    const entered = galleryPasscode.trim().toLowerCase();
                    const expected = selectedGallery.passcode?.trim().toLowerCase();

                    if (entered && expected && entered === expected) {
                      window.open(
                        selectedGallery.galleryUrl,
                        "_blank",
                        "noopener,noreferrer"
                      );
                      setSelectedGallery(null);
                      setGalleryPasscode("");
                      setGalleryError("");
                    } else {
                      setGalleryError("Incorrect passcode. Please try again.");
                    }
                  }}
                  className="flex-1 rounded-full gradient-gold px-5 py-3 text-sm font-bold text-ink shadow-luxe hover:scale-105 transition-transform"
                >
                  Access Gallery
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <ContactSection packages={packages} contact={contact} googleReviewLink={content.googleReviewLink} />

      <ScrollToTopButton />

      <SiteFooter />
    </div>
  );
}

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full gradient-gold text-ink shadow-luxe flex items-center justify-center text-2xl font-bold hover:scale-110 transition"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

function Hero() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return;
      const y = Math.min(window.scrollY, 600);
      imgRef.current.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(${1 + y * 0.0004})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-ink isolate">
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={imgRef}
          src={heroImg}
          alt="Elegant photobooth at a luxury wedding reception"
          className="w-full h-[115%] object-cover animate-hero-zoom will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        <div
          className="absolute inset-0 opacity-50 mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(60% 60% at 20% 30%, oklch(0.92 0.08 85 / 0.45), transparent 60%), radial-gradient(50% 50% at 85% 75%, oklch(0.78 0.11 80 / 0.35), transparent 65%)",
          }}
        />
      </div>

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

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center w-full z-10">
        <div className="text-white" style={{ textShadow: "0 2px 24px rgba(0,0,0,0.55)" }}>
          <div
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold mb-6 animate-fade-up"
            style={{ animationDelay: "0.05s" }}
          >
            <Sparkles className="h-3.5 w-3.5" /> Melbourne · Luxury Photobooth
          </div>

          <h1
            className="font-serif font-semibold text-white text-[2.5rem] sm:text-5xl lg:text-6xl xl:text-[4.5rem] leading-[1.05] mb-6 animate-fade-up"
            style={{ animationDelay: "0.15s", textShadow: "0 4px 30px rgba(0,0,0,0.7)" }}
          >
            Turning Every Event Into{" "}
            <span className="shimmer-text italic">Unforgettable Memories</span>
          </h1>

          <p
            className="text-base sm:text-lg text-white/90 max-w-xl mb-8 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.3s", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
          >
            Luxury photobooth experiences for weddings, birthdays, corporate events
            &amp; celebrations — unlimited prints, designer props, and instant
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

            <Link
              to="/enquire"
              search={{ package: "Elite" }}
              className="group inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/30 px-7 py-4 font-semibold text-white hover:text-ink hover:bg-gold transition"
            >
              Book Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div
            className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/80 animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
              <span className="ml-1 font-medium text-white">5.0</span>
            </div>
            <span className="h-4 w-px bg-white/30 hidden sm:inline-block" />
            <span className="hidden sm:inline">Unlimited prints · QR sharing</span>
          </div>
        </div>

        <div className="relative hidden lg:block animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-luxe ring-1 ring-gold/30">
            <img
              src={heroImg}
              alt="Guests enjoying Elite MagicBooth"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </div>

          <div className="absolute -top-6 -left-6 glass-card rounded-2xl p-3 shadow-luxe animate-float">
            <img src={logo} alt="Elite MagicBooth" className="h-14 w-14 rounded-full" />
          </div>
        </div>
      </div>

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

function ContactSection({ packages, contact, googleReviewLink }: { packages: Package[]; contact: ContactContent; googleReviewLink: string }) {
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

  const telHref = `tel:${contact.phone.replace(/\s+/g, "")}`;

  return (
    <section id="contact" className="bg-beige text-foreground py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 grid lg:grid-cols-5 gap-10 md:gap-12">
        <div className="lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Get in touch</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-6 leading-tight">
            {contact.heading}
          </h2>
          <p className="text-muted-foreground mb-8 md:mb-10 leading-relaxed">
            {contact.subtext}
          </p>

          <ul className="space-y-5">
            {contact.phone && (
              <li className="flex items-start gap-4">
                <span className="h-10 w-10 inline-flex items-center justify-center rounded-full gradient-gold text-ink flex-shrink-0"><Phone className="h-4 w-4" /></span>
                <div className="min-w-0"><p className="text-xs uppercase tracking-widest text-gold">Phone</p><a href={telHref} className="text-foreground hover:text-gold break-all">{contact.phone}</a></div>
              </li>
            )}

            {contact.email && (
              <li className="flex items-start gap-4">
                <span className="h-10 w-10 inline-flex items-center justify-center rounded-full gradient-gold text-ink flex-shrink-0"><Mail className="h-4 w-4" /></span>
                <div className="min-w-0"><p className="text-xs uppercase tracking-widest text-gold">Email</p><a href={`mailto:${contact.email}`} className="text-foreground hover:text-gold break-all">{contact.email}</a></div>
              </li>
            )}

            {contact.location && (
              <li className="flex items-start gap-4">
                <span className="h-10 w-10 inline-flex items-center justify-center rounded-full gradient-gold text-ink flex-shrink-0"><MapPin className="h-4 w-4" /></span>
                <div><p className="text-xs uppercase tracking-widest text-gold">Location</p><p className="text-foreground">{contact.location}</p></div>
              </li>
            )}
          </ul>

          {(contact.instagram || contact.facebook || googleReviewLink) && (
            <div className="flex flex-wrap gap-3 mt-6">
              {contact.instagram && (
                <a href={contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="h-11 w-11 inline-flex items-center justify-center rounded-full border border-border bg-card hover:text-gold hover:border-gold transition">
                  <Instagram className="h-4 w-4" />
                </a>
              )}

              {contact.facebook && (
                <a href={contact.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="h-11 w-11 inline-flex items-center justify-center rounded-full border border-border bg-card hover:text-gold hover:border-gold transition">
                  <Facebook className="h-4 w-4" />
                </a>
              )}

              {googleReviewLink && (
                <a
                  href={googleReviewLink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Leave a Google Review"
                  className="inline-flex items-center gap-2 rounded-full gradient-gold px-5 py-2.5 text-sm font-semibold text-ink shadow-luxe hover:scale-105 transition"
                >
                  <Star className="h-4 w-4 fill-ink" />
                  Leave a Google Review
                </a>
              )}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-3 bg-card text-foreground rounded-3xl p-6 sm:p-8 md:p-10 shadow-luxe space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" type="tel" />
            <Field label="Event Date" name="date" type="date" />
            <SelectField label="Event Type" name="eventType" options={["Wedding", "Birthday", "Corporate", "Baby Shower", "Engagement", "Party", "Other"]} />
            <SelectField label="Preferred Package" name="package" options={packages.map((p) => p.name)} />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Message</label>
            <textarea name="message" rows={4} className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition" placeholder="Tell us about your event..." />
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
        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
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
        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
      >
        <option value="">Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

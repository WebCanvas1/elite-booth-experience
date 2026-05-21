import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Phone, Mail, MapPin, Sparkles, Check, Instagram, Facebook } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Toaster } from "@/components/ui/sonner";
import { DEFAULT_PACKAGES, type Package } from "@/lib/packages";

export const Route = createFileRoute("/enquire")({
  validateSearch: (search: Record<string, unknown>) => ({
    package: typeof search.package === "string" ? search.package : "",
  }),
  head: () => ({
    meta: [
      { title: "Book Your Photobooth Experience — Elite MagicBooth" },
      {
        name: "description",
        content:
          "Enquire about premium photobooth hire in Melbourne for weddings, birthdays, corporate events and celebrations. Get a tailored quote within 24 hours.",
      },
      { property: "og:title", content: "Book Your Photobooth Experience — Elite MagicBooth" },
      { property: "og:description", content: "Tell us about your event and we'll get back to you shortly." },
    ],
  }),
  component: EnquirePage,
});

const EVENT_TYPES = ["Wedding", "Birthday", "Corporate", "Baby Shower", "Engagement", "Party", "Other"];

function EnquirePage() {
  const search = Route.useSearch();
  const selectedPackage = search.package || "";

  const [packages, setPackages] = useState<Package[]>(DEFAULT_PACKAGES);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((d: { packages?: Package[] }) => {
        if (d.packages?.length) setPackages(d.packages);
      })
      .catch(() => {});
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      form.reset();

      toast.success("Enquiry sent! We'll be in touch within 24 hours.");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <SiteHeader />

      <section className="relative pt-20 pb-8 overflow-hidden bg-beige">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(50% 50% at 20% 20%, oklch(0.92 0.08 85 / 0.5), transparent 60%), radial-gradient(50% 50% at 85% 85%, oklch(0.85 0.10 80 / 0.35), transparent 65%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold mb-3 animate-fade-up">
            <Sparkles className="h-3.5 w-3.5" /> Enquire Today
          </div>

          <h1
            className="font-serif text-3xl md:text-5xl mb-2 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Book Your <span className="italic text-gradient-gold">Photobooth Experience</span>
          </h1>

          <p
            className="text-muted-foreground text-base max-w-2xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Tell us about your event and we'll get back to you shortly with a tailored quote.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-5 gap-6">
        <aside className="lg:col-span-2 space-y-4 order-2 lg:order-1">
          <div className="rounded-3xl bg-card border border-border shadow-luxe p-6">
            <h2 className="font-serif text-2xl mb-2">Elite MagicBooth</h2>

            <p className="text-sm text-muted-foreground mb-5">
              Melbourne's premium photobooth experience for unforgettable events.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <span className="h-10 w-10 inline-flex items-center justify-center rounded-full gradient-gold text-ink flex-shrink-0">
                  <Phone className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-xs uppercase tracking-widest text-gold">Phone</p>
                  <a href="tel:0419678189" className="text-foreground hover:text-gold">
                    0419 678 189
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="h-10 w-10 inline-flex items-center justify-center rounded-full gradient-gold text-ink flex-shrink-0">
                  <Mail className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-xs uppercase tracking-widest text-gold">Email</p>
                  <a
                    href="mailto:elitemagicbooth@gmail.com"
                    className="text-foreground hover:text-gold break-all"
                  >
                    elitemagicbooth@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="h-10 w-10 inline-flex items-center justify-center rounded-full gradient-gold text-ink flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-xs uppercase tracking-widest text-gold">Location</p>
                  <p className="text-foreground">Melbourne, Victoria</p>
                </div>
              </li>
            </ul>

            <div className="mt-6 pt-5 border-t border-border flex items-center gap-3">
              <a
                aria-label="Instagram"
                href="#"
                className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-beige hover:bg-gold hover:text-ink transition"
              >
                <Instagram className="h-4 w-4" />
              </a>

              <a
                aria-label="Facebook"
                href="#"
                className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-beige hover:bg-gold hover:text-ink transition"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </aside>

        <form
          onSubmit={onSubmit}
          className="lg:col-span-3 order-1 lg:order-2 relative rounded-3xl bg-card/80 backdrop-blur-xl border border-border shadow-luxe p-5 md:p-6 space-y-3 animate-fade-up"
        >
          {submitted && (
            <div className="rounded-2xl bg-gold/15 border border-gold/40 px-4 py-3 text-sm flex items-center gap-2">
              <Check className="h-4 w-4 text-gold" />
              Thanks! Your enquiry has been received — we'll reply within 24 hours.
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Full Name" name="name" required maxLength={100} />
            <Field label="Email Address" name="email" type="email" required maxLength={255} />
            <Field label="Phone Number" name="phone" type="tel" maxLength={30} />
            <SelectField label="Event Type" name="eventType" options={EVENT_TYPES} required />
            <Field label="Event Date" name="date" type="date" required />
            <Field label="Event Location" name="location" required maxLength={200} />

            <div className="md:col-span-2">
              <SelectField
                label="Package Interested In"
                name="package"
                options={packages.map((p) => p.name)}
                defaultValue={selectedPackage}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Additional Notes / Message
            </label>

            <textarea
              name="message"
              rows={3}
              maxLength={1000}
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
              placeholder="Tell us a bit more about your event..."
            />
          </div>

          <button
            disabled={submitting}
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-full gradient-gold px-6 py-3 font-semibold text-ink shadow-luxe hover:scale-[1.02] transition-transform disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Enquiry"}
          </button>
        </form>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </label>

      <input
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </label>

      <select
        name={name}
        required={required}
        defaultValue={defaultValue || ""}
        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
      >
        <option value="">Select...</option>

        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Instagram, Facebook, Star } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSiteContent } from "@/hooks/use-site-content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const linkClass =
    "text-white hover:text-[#d4af37] transition-colors";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#111111]/90 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 group min-w-0"
          onClick={() => setOpen(false)}
        >
          <img
            src={logo}
            alt="Elite MagicBooth"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full ring-1 ring-gold/50 group-hover:ring-gold transition flex-shrink-0"
          />

          <span className="font-serif text-[17px] sm:text-xl md:text-2xl leading-none tracking-wide whitespace-nowrap">
            <span className="text-white font-semibold">
              Elite
            </span>{" "}
            <span className="text-[#d4af37] italic font-semibold">
              MagicBooth
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium">
          <a href="/#packages" className={linkClass}>Packages</a>
          <a href="/#addons" className={linkClass}>Add-Ons</a>
          <a href="/#events" className={linkClass}>Events</a>
          <a href="/#about" className={linkClass}>About</a>
          <a href="/#gallery" className={linkClass}>Gallery</a>
          <Link to="/enquire" className={linkClass}>Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/enquire"
            className="hidden sm:inline-flex items-center gap-2 rounded-full gradient-gold px-4 md:px-5 py-2 md:py-2.5 text-xs sm:text-sm font-semibold text-ink shadow-luxe hover:scale-105 transition-transform"
          >
            Book Now
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-[#1a1a1a] text-white"
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#111111]/95 backdrop-blur">
          <nav className="px-4 py-4 flex flex-col gap-1 text-base">
            {[
              { href: "/#packages", label: "Packages" },
              { href: "/#addons", label: "Add-Ons" },
              { href: "/#events", label: "Events" },
              { href: "/#about", label: "About" },
              { href: "/#gallery", label: "Gallery" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 px-2 rounded-xl text-white hover:bg-white/5 hover:text-[#d4af37] transition"
              >
                {l.label}
              </a>
            ))}

            <Link
              to="/enquire"
              onClick={() => setOpen(false)}
              className="py-3 px-2 rounded-xl text-white hover:bg-white/5 hover:text-[#d4af37] transition"
            >
              Contact
            </Link>

            <Link to="/terms" onClick={() => setOpen(false)} className="py-3 px-2 rounded-xl text-white/80 hover:bg-white/5 hover:text-[#d4af37] transition text-sm">
              Terms & Conditions
            </Link>
            <Link to="/privacy" onClick={() => setOpen(false)} className="py-3 px-2 rounded-xl text-white/80 hover:bg-white/5 hover:text-[#d4af37] transition text-sm">
              Privacy Policy
            </Link>


            <Link
              to="/enquire"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full gradient-gold py-3 font-semibold text-ink shadow-luxe"
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { contact } = useSiteContent();
  const telHref = `tel:${contact.phone.replace(/\s+/g, "")}`;

  return (
    <footer className="bg-beige text-foreground mt-20 md:mt-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid md:grid-cols-3 gap-10 md:gap-12">
        <div>
          <h3 className="font-serif text-2xl md:text-3xl text-gradient-gold mb-3">
            Elite MagicBooth
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Premium photobooth experiences for unforgettable events across{" "}
            {contact.location || "Melbourne"}.
          </p>

          {(contact.instagram || contact.facebook) && (
            <div className="flex gap-3 mt-4">
              {contact.instagram && (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border bg-card hover:text-gold hover:border-gold transition"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}

              {contact.facebook && (
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border bg-card hover:text-gold hover:border-gold transition"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">
            Contact
          </h4>

          <ul className="space-y-2 text-sm text-muted-foreground">
            {contact.location && <li>{contact.location}</li>}

            {contact.phone && (
              <li>
                <a href={telHref} className="hover:text-gold">
                  {contact.phone}
                </a>
              </li>
            )}

            {contact.email && (
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-gold break-all"
                >
                  {contact.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">
            Explore
          </h4>

          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/#packages" className="hover:text-gold">Packages</a></li>
            <li><a href="/#addons" className="hover:text-gold">Add-Ons</a></li>
            <li><a href="/#events" className="hover:text-gold">Events We Cover</a></li>
            <li><a href="/#about" className="hover:text-gold">About</a></li>
            <li><a href="/#gallery" className="hover:text-gold">Gallery</a></li>
            <li><Link to="/enquire" className="hover:text-gold">Get a Quote</Link></li>
            <li><Link to="/terms" className="hover:text-gold">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link to="/" className="hover:text-gold">Back to Home</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Elite MagicBooth. All rights reserved.
          </p>

          <Link
            to="/admin"
            className="hover:text-gold opacity-70 hover:opacity-100 transition"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}

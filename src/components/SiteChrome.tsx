import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Elite MagicBooth" className="h-10 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="/#gallery" className="hover:text-gold transition-colors">Gallery</a>
          <a href="/#about" className="hover:text-gold transition-colors">About</a>
          <a href="/#packages" className="hover:text-gold transition-colors">Packages</a>
          <a href="/#contact" className="hover:text-gold transition-colors">Contact</a>
        </nav>
        <a
          href="/#contact"
          className="inline-flex items-center gap-2 rounded-full gradient-gold px-5 py-2.5 text-sm font-semibold text-ink shadow-luxe hover:scale-105 transition-transform"
        >
          Book Now
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-beige text-foreground mt-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-serif text-3xl text-gradient-gold mb-3">Elite MagicBooth</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Premium photobooth experiences for unforgettable events across Melbourne.
          </p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Melbourne, Victoria</li>
            <li><a href="tel:0419678189" className="hover:text-gold">0419 678 189</a></li>
            <li><a href="mailto:elitemagicbooth@gmail.com" className="hover:text-gold">elitemagicbooth@gmail.com</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/#packages" className="hover:text-gold">Packages</a></li>
            <li><a href="/#gallery" className="hover:text-gold">Gallery</a></li>
            <li><a href="/#contact" className="hover:text-gold">Get a Quote</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Elite MagicBooth. All rights reserved.</p>
          <Link to="/admin" className="hover:text-gold opacity-70 hover:opacity-100 transition">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, ExternalLink } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { useSiteContent } from "@/hooks/use-site-content";
import type { PastEventItem } from "@/lib/site-content";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Past Event Galleries | Elite MagicBooth Melbourne" },
      { name: "description", content: "Browse past event galleries from Elite MagicBooth weddings, parties and celebrations in Melbourne." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const content = useSiteContent();
  const { pastEvents } = content;
  const [selectedGallery, setSelectedGallery] = useState<PastEventItem | null>(null);
  const [galleryPasscode, setGalleryPasscode] = useState("");
  const [galleryError, setGalleryError] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="pt-20">
        {content.isContentLoading ? (
          <div className="min-h-[55vh] flex items-center justify-center text-muted-foreground" role="status">Loading event galleries…</div>
        ) : content.contentLoadError ? (
          <div className="min-h-[55vh] flex flex-col items-center justify-center gap-5 px-5 text-center">
            <p>We couldn't load the event galleries right now.</p>
            <button type="button" className="rounded-full gradient-gold px-6 py-3 font-semibold text-ink" onClick={() => window.location.reload()}>Try again</button>
          </div>
        ) : (
          <>
      {/* Event Galleries */}
      <section
        id="event-galleries"
        className="bg-beige py-16 md:py-24 scroll-mt-24"
      >
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


            {pastEvents.length === 0 && <p className="px-5 pb-16 text-center text-muted-foreground">New event galleries will be added here soon.</p>}
          </>
        )}
        <div className="text-center py-8"><Link to="/" className="text-gold hover:underline">← Back to Home</Link></div>
      </main>
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

      <SiteFooter />
    </div>
  );
}

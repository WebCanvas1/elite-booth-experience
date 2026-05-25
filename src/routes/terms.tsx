import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { useSiteContent } from "@/hooks/use-site-content";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Elite MagicBooth" },
      { name: "description", content: "Booking terms, deposits, cancellation and liability policies for Elite MagicBooth photobooth hire." },
      { property: "og:title", content: "Terms & Conditions — Elite MagicBooth" },
      { property: "og:description", content: "Read our booking terms and conditions before booking your photobooth." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { terms } = useSiteContent();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="pt-32 pb-20 md:pb-24">
        <section className="max-w-3xl mx-auto px-5 sm:px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3 text-center">Legal</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-center mb-5">{terms.heading}</h1>
          <p className="text-muted-foreground text-center mb-10 leading-relaxed">{terms.intro}</p>

          <Accordion type="multiple" className="bg-card border border-border rounded-3xl shadow-luxe/30 px-3 sm:px-5">
            {terms.sections.map((s) => (
              <AccordionItem key={s.id} value={s.id} className="border-border">
                <AccordionTrigger className="text-left font-serif text-lg sm:text-xl text-foreground hover:no-underline py-5">
                  {s.heading}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line text-[15px]">
                  {s.body}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { type Package } from "@/lib/packages";
import { verifyAdminCredentials } from "@/lib/admin-auth.server";
import {
  DEFAULT_CONTENT,
  mergeContent,
  type SiteContent,
  type AboutContent,
  type ContactContent,
  type EventItem,
  type PastEventItem,
  type AddOnItem,
  type PolicyContent,
  type PolicySection,
} from "@/lib/site-content";


// ============================================================
// Cloudflare KV access for full site content.
// Binding "PHOTOBOOTH_KV" is configured in wrangler.jsonc.
// In production (Cloudflare Workers), `env.PHOTOBOOTH_KV` is the KVNamespace.
// In local dev without a configured KV, falls back to memory.
// Single key stores packages, gallery, about, contact as JSON.
// ============================================================
const KV_KEY = "site:v1";
const LEGACY_PACKAGES_KEY = "packages:v1";

let memoryStore: SiteContent | null = null;

type KVLike = {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string) => Promise<void>;
};

async function getKV(): Promise<KVLike | null> {
  try {
    // @ts-expect-error - cloudflare:workers is provided at runtime by @cloudflare/vite-plugin
    const mod = (await import(/* @vite-ignore */ "cloudflare:workers").catch(() => null)) as
      | { env?: Record<string, unknown> }
      | null;
    const binding = mod?.env?.PHOTOBOOTH_KV as KVLike | undefined;
    return binding ?? null;
  } catch {
    return null;
  }
}

async function readContent(): Promise<SiteContent> {
  const kv = await getKV();
  if (kv) {
    const raw = await kv.get(KV_KEY);
    if (raw) {
      try {
        return mergeContent(JSON.parse(raw) as Partial<SiteContent>);
      } catch {
        // fall through
      }
    }
    // Legacy: prior version stored just packages array
    const legacy = await kv.get(LEGACY_PACKAGES_KEY);
    if (legacy) {
      try {
        const pkgs = JSON.parse(legacy) as Package[];
        return mergeContent({ packages: pkgs });
      } catch {
        // ignore
      }
    }
    return DEFAULT_CONTENT;
  }
  return memoryStore ?? DEFAULT_CONTENT;
}

async function writeContent(content: SiteContent): Promise<void> {
  const kv = await getKV();
  if (kv) {
    await kv.put(KV_KEY, JSON.stringify(content));
  } else {
    memoryStore = content;
  }
}

// Cap on stored image data URL size (~2MB raw) to keep KV values reasonable.
const MAX_IMG = 2_500_000;

function sanitizePackages(input: unknown): Package[] {
  if (!Array.isArray(input)) return DEFAULT_CONTENT.packages;
  return input.map((p) => {
    const pkg = p as Partial<Package>;
    return {
      id: String(pkg.id || crypto.randomUUID()),
      name: String(pkg.name || "").slice(0, 100),
      price: Number(pkg.price) || 0,
      image: String(pkg.image || "").slice(0, MAX_IMG),
      features: Array.isArray(pkg.features)
        ? pkg.features.map((f) => String(f).slice(0, 300)).slice(0, 50)
        : [],
    };
  });
}

function sanitizeGallery(input: unknown): string[] {
  if (!Array.isArray(input)) return DEFAULT_CONTENT.gallery;
  return input
    .map((s) => String(s || "").slice(0, MAX_IMG))
    .filter((s) => s.length > 0)
    .slice(0, 60);
}

function sanitizeAbout(input: unknown): AboutContent {
  const a = (input || {}) as Partial<AboutContent>;
  return {
    eyebrow: String(a.eyebrow ?? DEFAULT_CONTENT.about.eyebrow).slice(0, 80),
    heading: String(a.heading ?? DEFAULT_CONTENT.about.heading).slice(0, 200),
    body: String(a.body ?? DEFAULT_CONTENT.about.body).slice(0, 3000),
    highlights: Array.isArray(a.highlights)
      ? a.highlights.map((h) => String(h).slice(0, 80)).slice(0, 12)
      : DEFAULT_CONTENT.about.highlights,
    image: String(a.image ?? DEFAULT_CONTENT.about.image).slice(0, MAX_IMG),
  };
}

function sanitizeContact(input: unknown): ContactContent {
  const c = (input || {}) as Partial<ContactContent>;
  return {
    heading: String(c.heading ?? DEFAULT_CONTENT.contact.heading).slice(0, 200),
    subtext: String(c.subtext ?? DEFAULT_CONTENT.contact.subtext).slice(0, 600),
    phone: String(c.phone ?? "").slice(0, 40),
    email: String(c.email ?? "").slice(0, 120),
    location: String(c.location ?? "").slice(0, 120),
    instagram: String(c.instagram ?? "").slice(0, 200),
    facebook: String(c.facebook ?? "").slice(0, 200),
  };
}

function sanitizeEvents(input: unknown): EventItem[] {
  if (!Array.isArray(input)) return DEFAULT_CONTENT.events;
  return input.slice(0, 30).map((e) => {
    const x = e as Partial<EventItem>;
    return {
      id: String(x.id || crypto.randomUUID()).slice(0, 80),
      title: String(x.title || "").slice(0, 100),
      description: String(x.description || "").slice(0, 400),
      image: String(x.image || "").slice(0, MAX_IMG),
    };
  });
}


function sanitizePastEvents(input: unknown): PastEventItem[] {
  if (!Array.isArray(input)) return DEFAULT_CONTENT.pastEvents;

  return input.slice(0, 50).map((e) => {
    const x = e as Partial<PastEventItem>;

    return {
      id: String(x.id || crypto.randomUUID()).slice(0, 80),
      title: String(x.title || "").slice(0, 120),
      date: String(x.date || "").slice(0, 80),
      coverImage: String(x.coverImage || "").slice(0, MAX_IMG),
      galleryUrl: String(x.galleryUrl || "").slice(0, 500),
      note: String(x.note || "").slice(0, 500),
    };
  });
}

function sanitizeAddOns(input: unknown): AddOnItem[] {
  if (!Array.isArray(input)) return DEFAULT_CONTENT.addOns;
  return input.slice(0, 40).map((a) => {
    const x = a as Partial<AddOnItem>;
    return {
      id: String(x.id || crypto.randomUUID()).slice(0, 80),
      title: String(x.title || "").slice(0, 100),
      description: String(x.description || "").slice(0, 400),
      price: String(x.price || "").slice(0, 40),
      image: String(x.image || "").slice(0, MAX_IMG),
      popular: Boolean(x.popular),
    };
  });
}

function sanitizePolicy(input: unknown, fallback: PolicyContent): PolicyContent {
  const p = (input || {}) as Partial<PolicyContent>;
  const sections: PolicySection[] = Array.isArray(p.sections)
    ? p.sections.slice(0, 40).map((s) => {
        const x = s as Partial<PolicySection>;
        return {
          id: String(x.id || crypto.randomUUID()).slice(0, 80),
          heading: String(x.heading || "").slice(0, 200),
          body: String(x.body || "").slice(0, 5000),
        };
      })
    : fallback.sections;
  return {
    heading: String(p.heading ?? fallback.heading).slice(0, 200),
    intro: String(p.intro ?? fallback.intro).slice(0, 2000),
    sections,
  };
}

export const Route = createFileRoute("/api/content")({
  server: {
    handlers: {
      GET: async () => {
        const content = await readContent();
        return new Response(JSON.stringify(content), {
          headers: { "content-type": "application/json" },
        });
      },
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as
          | (Partial<SiteContent> & { email?: string; password?: string })
          | null;
        const email = (body?.email || "").trim().toLowerCase();
        const password = body?.password || "";
        const authed = body ? await verifyAdminCredentials(email, password) : false;
        if (!authed) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }
        const current = await readContent();
        const clean: SiteContent = {
          packages: body!.packages !== undefined ? sanitizePackages(body!.packages) : current.packages,
          gallery: body!.gallery !== undefined ? sanitizeGallery(body!.gallery) : current.gallery,
          about: body!.about !== undefined ? sanitizeAbout(body!.about) : current.about,
          contact: body!.contact !== undefined ? sanitizeContact(body!.contact) : current.contact,
          events: body!.events !== undefined ? sanitizeEvents(body!.events) : current.events,
          pastEvents: body!.pastEvents !== undefined ? sanitizePastEvents(body!.pastEvents) : current.pastEvents,
          addOns: body!.addOns !== undefined ? sanitizeAddOns(body!.addOns) : current.addOns,
          terms: body!.terms !== undefined ? sanitizePolicy(body!.terms, DEFAULT_CONTENT.terms) : current.terms,
          privacy: body!.privacy !== undefined ? sanitizePolicy(body!.privacy, DEFAULT_CONTENT.privacy) : current.privacy,
        };
        await writeContent(clean);
        return new Response(JSON.stringify({ ok: true, content: clean }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { DEFAULT_PACKAGES, ADMIN_PASSWORD, ADMIN_USERNAME, type Package } from "@/lib/packages";

// ============================================================
// Cloudflare KV access.
// Binding "PHOTOBOOTH_KV" is configured in wrangler.jsonc.
// In production (Cloudflare Workers), `env.PHOTOBOOTH_KV` is the KVNamespace.
// In local dev without a configured KV, we gracefully fall back to memory.
// ============================================================
const KV_KEY = "packages:v1";

// In-memory fallback for local dev when no KV binding is available.
let memoryStore: Package[] | null = null;

type KVLike = {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string) => Promise<void>;
};

async function getKV(): Promise<KVLike | null> {
  try {
    // Dynamic import so non-CF environments don't crash at module load.
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

async function readPackages(): Promise<Package[]> {
  const kv = await getKV();
  if (kv) {
    const raw = await kv.get(KV_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as Package[];
      } catch {
        // fall through to defaults
      }
    }
    return DEFAULT_PACKAGES;
  }
  return memoryStore ?? DEFAULT_PACKAGES;
}

async function writePackages(pkgs: Package[]): Promise<void> {
  const kv = await getKV();
  if (kv) {
    await kv.put(KV_KEY, JSON.stringify(pkgs));
  } else {
    memoryStore = pkgs;
  }
}

export const Route = createFileRoute("/api/packages")({
  server: {
    handlers: {
      GET: async () => {
        const pkgs = await readPackages();
        return new Response(JSON.stringify({ packages: pkgs }), {
          headers: { "content-type": "application/json" },
        });
      },
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as
          | { username?: string; password?: string; packages?: Package[] }
          | null;
        if (!body || body.username !== ADMIN_USERNAME || body.password !== ADMIN_PASSWORD) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }
        if (!Array.isArray(body.packages)) {
          return new Response(JSON.stringify({ error: "Invalid payload" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
        // Basic shape validation
        const clean: Package[] = body.packages.map((p) => ({
          id: String(p.id || crypto.randomUUID()),
          name: String(p.name || "").slice(0, 100),
          price: Number(p.price) || 0,
          image: String(p.image || "").slice(0, 1000),
          features: Array.isArray(p.features)
            ? p.features.map((f) => String(f).slice(0, 300)).slice(0, 50)
            : [],
        }));
        await writePackages(clean);
        return new Response(JSON.stringify({ ok: true, packages: clean }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});

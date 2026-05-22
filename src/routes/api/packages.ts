import { createFileRoute } from "@tanstack/react-router";
import { DEFAULT_PACKAGES, type Package } from "@/lib/packages";
import { verifyAdminCredentials } from "@/lib/admin-auth.server";

// ============================================================
// LEGACY endpoint kept for backward compatibility.
// New code should use /api/content which returns the full site content
// (packages, gallery, about, contact) stored in Cloudflare KV under
// the binding PHOTOBOOTH_KV (see wrangler.jsonc).
// ============================================================
const KV_KEY = "site:v1";
const LEGACY_KEY = "packages:v1";

let memoryStore: Package[] | null = null;

type KVLike = {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string) => Promise<void>;
};

async function getKV(): Promise<KVLike | null> {
  try {
    // @ts-expect-error - cloudflare:workers is provided at runtime
    const mod = (await import(/* @vite-ignore */ "cloudflare:workers").catch(() => null)) as
      | { env?: Record<string, unknown> }
      | null;
    return (mod?.env?.PHOTOBOOTH_KV as KVLike | undefined) ?? null;
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
        const parsed = JSON.parse(raw) as { packages?: Package[] };
        if (Array.isArray(parsed.packages) && parsed.packages.length) return parsed.packages;
      } catch { /* ignore */ }
    }
    const legacy = await kv.get(LEGACY_KEY);
    if (legacy) {
      try { return JSON.parse(legacy) as Package[]; } catch { /* ignore */ }
    }
    return DEFAULT_PACKAGES;
  }
  return memoryStore ?? DEFAULT_PACKAGES;
}

async function writePackages(pkgs: Package[]): Promise<void> {
  const kv = await getKV();
  if (kv) {
    // Merge into the unified site content blob.
    const raw = await kv.get(KV_KEY);
    let content: Record<string, unknown> = {};
    if (raw) {
      try { content = JSON.parse(raw); } catch { content = {}; }
    }
    content.packages = pkgs;
    await kv.put(KV_KEY, JSON.stringify(content));
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
          | { email?: string; password?: string; packages?: Package[] }
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
        if (!Array.isArray(body!.packages)) {
          return new Response(JSON.stringify({ error: "Invalid payload" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
        const clean: Package[] = body!.packages.map((p) => ({
          id: String(p.id || crypto.randomUUID()),
          name: String(p.name || "").slice(0, 100),
          price: Number(p.price) || 0,
          image: String(p.image || "").slice(0, 2_500_000),
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

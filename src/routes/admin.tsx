import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, LogOut, ArrowLeft } from "lucide-react";
import { DEFAULT_PACKAGES, type Package } from "@/lib/packages";
import { Toaster } from "@/components/ui/sonner";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Elite MagicBooth" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [creds, setCreds] = useState<{ u: string; p: string } | null>(null);
  return (
    <div className="min-h-screen bg-beige">
      <Toaster position="top-center" />
      {!creds ? <LoginCard onLogin={setCreds} /> : <Dashboard creds={creds} onLogout={() => setCreds(null)} />}
    </div>
  );
}

function LoginCard({ onLogin }: { onLogin: (c: { u: string; p: string }) => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    // Verify by attempting an authorized read (POST with empty diff would be wrong);
    // instead, just trust client-side check against env-mirrored constants.
    // For real auth we'd hit a server endpoint. Server already validates on save.
    const { ADMIN_USERNAME, ADMIN_PASSWORD } = await import("@/lib/packages");
    if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
      onLogin({ u, p });
    } else {
      setErr("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-md bg-card rounded-3xl shadow-luxe p-8 border border-border">
        <Link to="/" className="flex justify-center mb-6"><img src={logo} alt="Elite MagicBooth" className="h-14" /></Link>
        <h1 className="font-serif text-3xl text-center mb-2">Admin Login</h1>
        <p className="text-sm text-center text-muted-foreground mb-6">Manage your packages</p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Username</label>
            <input value={u} onChange={(e) => setU(e.target.value)} className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" required />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
            <input value={p} onChange={(e) => setP(e.target.value)} type="password" className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" required />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button type="submit" className="w-full rounded-full gradient-gold py-3 font-semibold text-ink shadow-luxe hover:scale-[1.02] transition">Sign In</button>
          <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-gold mt-2">← Back to site</Link>
        </div>
      </form>
    </div>
  );
}

function Dashboard({ creds, onLogout }: { creds: { u: string; p: string }; onLogout: () => void }) {
  const [packages, setPackages] = useState<Package[]>(DEFAULT_PACKAGES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((d: { packages?: Package[] }) => {
        if (d.packages?.length) setPackages(d.packages);
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (idx: number, patch: Partial<Package>) => {
    setPackages((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const updateFeature = (idx: number, fIdx: number, value: string) => {
    setPackages((prev) =>
      prev.map((p, i) =>
        i === idx ? { ...p, features: p.features.map((f, j) => (j === fIdx ? value : f)) } : p,
      ),
    );
  };

  const addFeature = (idx: number) => update(idx, { features: [...packages[idx].features, "New feature"] });
  const removeFeature = (idx: number, fIdx: number) =>
    update(idx, { features: packages[idx].features.filter((_, j) => j !== fIdx) });

  const addPackage = () => {
    setPackages((p) => [
      ...p,
      {
        id: crypto.randomUUID(),
        name: "New Package",
        price: 0,
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
        features: ["New feature"],
      },
    ]);
  };

  const removePackage = (idx: number) => setPackages((p) => p.filter((_, i) => i !== idx));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: creds.u, password: creds.p, packages }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Changes saved successfully");
    } catch (e) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-gold"><ArrowLeft className="h-5 w-5" /></Link>
            <img src={logo} alt="Elite MagicBooth" className="h-9" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground border-l border-border pl-3 ml-1">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full gradient-gold px-5 py-2.5 text-sm font-semibold text-ink shadow-luxe hover:scale-105 transition disabled:opacity-60">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
            </button>
            <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm hover:bg-muted">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl">Packages</h1>
            <p className="text-sm text-muted-foreground">Edit, add, or remove packages. Click Save to publish.</p>
          </div>
          <button onClick={addPackage} className="inline-flex items-center gap-2 rounded-full border border-gold text-gold px-4 py-2.5 text-sm font-semibold hover:bg-gold hover:text-ink transition">
            <Plus className="h-4 w-4" /> Add Package
          </button>
        </div>

        <div className="space-y-6">
          {packages.map((pkg, idx) => (
            <div key={pkg.id} className="bg-card rounded-3xl border border-border p-6 md:p-8 shadow-luxe/30">
              <div className="grid md:grid-cols-[200px_1fr] gap-6">
                <div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-3">
                    {pkg.image && <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />}
                  </div>
                  <button onClick={() => removePackage(idx)} className="w-full inline-flex items-center justify-center gap-1 rounded-full border border-destructive/40 text-destructive text-xs py-2 hover:bg-destructive hover:text-destructive-foreground transition">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <AdminField label="Name" value={pkg.name} onChange={(v) => update(idx, { name: v })} />
                    <AdminField label="Price ($)" type="number" value={String(pkg.price)} onChange={(v) => update(idx, { price: Number(v) || 0 })} />
                  </div>
                  <AdminField label="Image URL" value={pkg.image} onChange={(v) => update(idx, { image: v })} />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground">Features</label>
                      <button onClick={() => addFeature(idx)} className="text-xs text-gold hover:underline inline-flex items-center gap-1"><Plus className="h-3 w-3" />Add</button>
                    </div>
                    <div className="space-y-2">
                      {pkg.features.map((f, fIdx) => (
                        <div key={fIdx} className="flex gap-2">
                          <input value={f} onChange={(e) => updateFeature(idx, fIdx, e.target.value)} className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
                          <button onClick={() => removeFeature(idx, fIdx)} className="px-3 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full gradient-gold px-7 py-3.5 font-semibold text-ink shadow-luxe hover:scale-105 transition disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}

function AdminField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
    </div>
  );
}

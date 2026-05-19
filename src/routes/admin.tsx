import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, LogOut, ArrowLeft, Upload } from "lucide-react";
import { DEFAULT_PACKAGES, type Package } from "@/lib/packages";
import { Toaster } from "@/components/ui/sonner";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Elite MagicBooth" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const AUTH_KEY = "emb_admin_auth";

function AdminPage() {
  const [creds, setCreds] = useState<{ u: string; p: string } | null>(null);
  const navigate = useNavigate();

  // Restore session on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(AUTH_KEY);
      if (raw) setCreds(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const handleLogin = (c: { u: string; p: string }) => {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(c));
    setCreds(c);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setCreds(null);
    toast.success("Logged out");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-beige">
      <Toaster position="top-center" />
      {!creds ? <LoginCard onLogin={handleLogin} /> : <Dashboard creds={creds} onLogout={handleLogout} />}
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

// Convert a File to a base64 data URL, downscaling so it fits comfortably in
// Cloudflare KV (max 25MB per value, but we keep package payloads small).
async function fileToCompressedDataUrl(file: File, maxDim = 1400, quality = 0.82): Promise<string> {
  const buf = await file.arrayBuffer();
  const blob = new Blob([buf], { type: file.type || "image/jpeg" });
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
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
    } catch {
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
            <span className="hidden sm:inline text-xs uppercase tracking-widest text-muted-foreground border-l border-border pl-3 ml-1">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full gradient-gold px-4 sm:px-5 py-2.5 text-sm font-semibold text-ink shadow-luxe hover:scale-105 transition disabled:opacity-60">
              <Save className="h-4 w-4" /> <span className="hidden sm:inline">{saving ? "Saving..." : "Save Changes"}</span>
            </button>
            <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted hover:text-destructive transition">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl">Packages</h1>
            <p className="text-sm text-muted-foreground">Edit, add, or remove packages. Click Save to publish.</p>
          </div>
          <button onClick={addPackage} className="inline-flex items-center justify-center gap-2 rounded-full border border-gold text-gold px-4 py-2.5 text-sm font-semibold hover:bg-gold hover:text-ink transition">
            <Plus className="h-4 w-4" /> Add Package
          </button>
        </div>

        <div className="space-y-6">
          {packages.map((pkg, idx) => (
            <PackageEditor
              key={pkg.id}
              pkg={pkg}
              onChange={(patch) => update(idx, patch)}
              onRemove={() => removePackage(idx)}
              onAddFeature={() => addFeature(idx)}
              onUpdateFeature={(fIdx, value) => updateFeature(idx, fIdx, value)}
              onRemoveFeature={(fIdx) => removeFeature(idx, fIdx)}
            />
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

function PackageEditor({
  pkg,
  onChange,
  onRemove,
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
}: {
  pkg: Package;
  onChange: (patch: Partial<Package>) => void;
  onRemove: () => void;
  onAddFeature: () => void;
  onUpdateFeature: (fIdx: number, value: string) => void;
  onRemoveFeature: (fIdx: number) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      // Stored as base64 data URL in Cloudflare KV (PHOTOBOOTH_KV) on Save.
      onChange({ image: dataUrl });
      toast.success("Image ready — click Save Changes to publish");
    } catch {
      toast.error("Could not process image");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="bg-card rounded-3xl border border-border p-6 md:p-8 shadow-luxe/30">
      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-3 border border-border">
            {pkg.image
              ? <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-gold text-gold text-xs font-semibold py-2.5 hover:bg-gold hover:text-ink transition disabled:opacity-60 mb-2"
          >
            <Upload className="h-3.5 w-3.5" /> {uploading ? "Processing..." : "Upload Image"}
          </button>
          <button onClick={onRemove} className="w-full inline-flex items-center justify-center gap-1 rounded-full border border-destructive/40 text-destructive text-xs py-2 hover:bg-destructive hover:text-destructive-foreground transition">
            <Trash2 className="h-3 w-3" /> Delete Package
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <AdminField label="Name" value={pkg.name} onChange={(v) => onChange({ name: v })} />
            <AdminField label="Price ($)" type="number" value={String(pkg.price)} onChange={(v) => onChange({ price: Number(v) || 0 })} />
          </div>
          <AdminField
            label="Image URL (optional — overridden by upload)"
            value={pkg.image.startsWith("data:") ? "" : pkg.image}
            placeholder={pkg.image.startsWith("data:") ? "Using uploaded image" : "https://..."}
            onChange={(v) => onChange({ image: v })}
          />
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground">Features</label>
              <button onClick={onAddFeature} className="text-xs text-gold hover:underline inline-flex items-center gap-1"><Plus className="h-3 w-3" />Add</button>
            </div>
            <div className="space-y-2">
              {pkg.features.map((f, fIdx) => (
                <div key={fIdx} className="flex gap-2">
                  <input value={f} onChange={(e) => onUpdateFeature(fIdx, e.target.value)} className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
                  <button onClick={() => onRemoveFeature(fIdx)} className="px-3 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
    </div>
  );
}

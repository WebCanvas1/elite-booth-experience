import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, LogOut, ArrowLeft, Upload, ArrowUp, ArrowDown, Image as ImageIcon, Info, Phone, Package as PackageIcon } from "lucide-react";
import { DEFAULT_PACKAGES, type Package } from "@/lib/packages";
import { DEFAULT_CONTENT, mergeContent, type SiteContent, type AboutContent, type ContactContent } from "@/lib/site-content";
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
    <div className="min-h-screen flex items-center justify-center px-5 py-10">
      <form onSubmit={submit} className="w-full max-w-md bg-card rounded-3xl shadow-luxe p-7 sm:p-8 border border-border">
        <Link to="/" className="flex justify-center mb-6"><img src={logo} alt="Elite MagicBooth" className="h-14" /></Link>
        <h1 className="font-serif text-2xl sm:text-3xl text-center mb-2">Admin Login</h1>
        <p className="text-sm text-center text-muted-foreground mb-6">Manage your website content</p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Username</label>
            <input value={u} onChange={(e) => setU(e.target.value)} className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" required />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
            <input value={p} onChange={(e) => setP(e.target.value)} type="password" className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" required />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button type="submit" className="w-full rounded-full gradient-gold py-3 font-semibold text-ink shadow-luxe hover:scale-[1.02] transition">Sign In</button>
          <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-gold mt-2">← Back to site</Link>
        </div>
      </form>
    </div>
  );
}

// Convert a File to a compressed base64 data URL stored in Cloudflare KV.
async function fileToCompressedDataUrl(file: File, maxDim = 1400, quality = 0.8): Promise<string> {
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

type TabId = "packages" | "gallery" | "about" | "contact";

function Dashboard({ creds, onLogout }: { creds: { u: string; p: string }; onLogout: () => void }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<TabId>("packages");

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => setContent(mergeContent(d as Partial<SiteContent>)))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: creds.u, password: creds.p, ...content }),
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

  const tabs: { id: TabId; label: string; icon: typeof PackageIcon }[] = [
    { id: "packages", label: "Packages", icon: PackageIcon },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "about", label: "About", icon: Info },
    { id: "contact", label: "Contact", icon: Phone },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link to="/" className="text-muted-foreground hover:text-gold flex-shrink-0"><ArrowLeft className="h-5 w-5" /></Link>
            <img src={logo} alt="Elite MagicBooth" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex-shrink-0" />
            <span className="hidden sm:inline text-xs uppercase tracking-widest text-muted-foreground border-l border-border pl-3">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full gradient-gold px-3 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-ink shadow-luxe hover:scale-105 transition disabled:opacity-60">
              <Save className="h-4 w-4" /> <span className="hidden sm:inline">{saving ? "Saving..." : "Save Changes"}</span><span className="sm:hidden">{saving ? "..." : "Save"}</span>
            </button>
            <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium hover:bg-muted hover:text-destructive transition">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-3 flex gap-2 overflow-x-auto -mx-1 px-1 scrollbar-thin">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
                  active ? "gradient-gold text-ink shadow-luxe" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {tab === "packages" && (
          <PackagesTab
            packages={content.packages}
            onChange={(packages) => setContent((c) => ({ ...c, packages }))}
          />
        )}
        {tab === "gallery" && (
          <GalleryTab
            gallery={content.gallery}
            onChange={(gallery) => setContent((c) => ({ ...c, gallery }))}
          />
        )}
        {tab === "about" && (
          <AboutTab about={content.about} onChange={(about) => setContent((c) => ({ ...c, about }))} />
        )}
        {tab === "contact" && (
          <ContactTab contact={content.contact} onChange={(contact) => setContent((c) => ({ ...c, contact }))} />
        )}

        <div className="mt-10 flex justify-end">
          <button onClick={save} disabled={saving} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full gradient-gold px-7 py-3.5 font-semibold text-ink shadow-luxe hover:scale-105 transition disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}

/* ======================== PACKAGES TAB ======================== */

function PackagesTab({ packages, onChange }: { packages: Package[]; onChange: (p: Package[]) => void }) {
  const update = (idx: number, patch: Partial<Package>) =>
    onChange(packages.map((p, i) => (i === idx ? { ...p, ...patch } : p)));

  const addPackage = () =>
    onChange([
      ...packages,
      {
        id: crypto.randomUUID(),
        name: "New Package",
        price: 0,
        image: DEFAULT_PACKAGES[0].image,
        features: ["New feature"],
      },
    ]);

  const removePackage = (idx: number) => onChange(packages.filter((_, i) => i !== idx));

  return (
    <div>
      <SectionHeader
        title="Packages"
        subtitle="Edit, add, or remove packages. Click Save Changes to publish."
        action={
          <button onClick={addPackage} className="inline-flex items-center justify-center gap-2 rounded-full border border-gold text-gold px-4 py-2.5 text-sm font-semibold hover:bg-gold hover:text-ink transition">
            <Plus className="h-4 w-4" /> Add Package
          </button>
        }
      />
      <div className="space-y-6">
        {packages.map((pkg, idx) => (
          <PackageEditor
            key={pkg.id}
            pkg={pkg}
            onChange={(patch) => update(idx, patch)}
            onRemove={() => removePackage(idx)}
            onAddFeature={() => update(idx, { features: [...pkg.features, "New feature"] })}
            onUpdateFeature={(fIdx, value) =>
              update(idx, { features: pkg.features.map((f, j) => (j === fIdx ? value : f)) })
            }
            onRemoveFeature={(fIdx) =>
              update(idx, { features: pkg.features.filter((_, j) => j !== fIdx) })
            }
          />
        ))}
      </div>
    </div>
  );
}

function PackageEditor({
  pkg, onChange, onRemove, onAddFeature, onUpdateFeature, onRemoveFeature,
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
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    setUploading(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
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
    <div className="bg-card rounded-3xl border border-border p-5 sm:p-6 md:p-8 shadow-luxe/30">
      <div className="grid sm:grid-cols-[200px_1fr] md:grid-cols-[220px_1fr] gap-5 md:gap-6">
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
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminField label="Name" value={pkg.name} onChange={(v) => onChange({ name: v })} />
            <AdminField label="Price ($)" type="number" value={String(pkg.price)} onChange={(v) => onChange({ price: Number(v) || 0 })} />
          </div>
          <AdminField
            label="Image URL (overridden by upload)"
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
                  <input value={f} onChange={(e) => onUpdateFeature(fIdx, e.target.value)} className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
                  <button onClick={() => onRemoveFeature(fIdx)} className="px-3 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive flex-shrink-0"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================== GALLERY TAB ======================== */

function GalleryTab({ gallery, onChange }: { gallery: string[]; onChange: (g: string[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  const onPickFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const next: string[] = [...gallery];
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        const dataUrl = await fileToCompressedDataUrl(file);
        next.push(dataUrl);
      }
      onChange(next);
      toast.success(`${files.length} image(s) added — click Save Changes to publish`);
    } catch {
      toast.error("Could not process one or more images");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const addUrl = () => {
    const v = url.trim();
    if (!v) return;
    onChange([...gallery, v]);
    setUrl("");
  };

  const remove = (idx: number) => onChange(gallery.filter((_, i) => i !== idx));
  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= gallery.length) return;
    const next = [...gallery];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  return (
    <div>
      <SectionHeader
        title="Gallery"
        subtitle="Upload, reorder, or remove gallery images. Changes go live after Save."
        action={
          <>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={onPickFiles} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center justify-center gap-2 rounded-full gradient-gold text-ink px-4 py-2.5 text-sm font-semibold shadow-luxe hover:scale-105 transition disabled:opacity-60"
            >
              <Upload className="h-4 w-4" /> {uploading ? "Processing..." : "Upload Images"}
            </button>
          </>
        }
      />

      <div className="bg-card border border-border rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Or paste an image URL (https://...)"
          className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
        />
        <button onClick={addUrl} className="inline-flex items-center justify-center gap-2 rounded-full border border-gold text-gold px-4 py-2.5 text-sm font-semibold hover:bg-gold hover:text-ink transition">
          <Plus className="h-4 w-4" /> Add URL
        </button>
      </div>

      {gallery.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-card rounded-3xl border border-border border-dashed">
          No gallery images yet. Upload some to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {gallery.map((src, idx) => (
            <div key={`${idx}-${src.slice(-30)}`} className="group relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border shadow-luxe/30">
              <img src={src} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 p-2 flex justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                <div className="flex gap-1">
                  <button
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    aria-label="Move up"
                    className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white/90 text-ink hover:bg-gold disabled:opacity-40"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => move(idx, 1)}
                    disabled={idx === gallery.length - 1}
                    aria-label="Move down"
                    className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white/90 text-ink hover:bg-gold disabled:opacity-40"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => remove(idx)}
                  aria-label="Delete image"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:scale-110 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ======================== ABOUT TAB ======================== */

function AboutTab({ about, onChange }: { about: AboutContent; onChange: (a: AboutContent) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      onChange({ ...about, image: dataUrl });
      toast.success("Image ready — click Save Changes to publish");
    } catch { toast.error("Could not process image"); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const updateHighlight = (idx: number, v: string) =>
    onChange({ ...about, highlights: about.highlights.map((h, i) => (i === idx ? v : h)) });
  const addHighlight = () => onChange({ ...about, highlights: [...about.highlights, "New highlight"] });
  const removeHighlight = (idx: number) =>
    onChange({ ...about, highlights: about.highlights.filter((_, i) => i !== idx) });

  return (
    <div>
      <SectionHeader title="About Us" subtitle="Update the About section heading, content, image, and highlights." />
      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <div>
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted mb-3 border border-border">
            {about.image
              ? <img src={about.image} alt="About" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-gold text-gold text-xs font-semibold py-2.5 hover:bg-gold hover:text-ink transition disabled:opacity-60"
          >
            <Upload className="h-3.5 w-3.5" /> {uploading ? "Processing..." : "Upload About Image"}
          </button>
        </div>
        <div className="space-y-4 bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-luxe/30">
          <AdminField label="Eyebrow (small label)" value={about.eyebrow} onChange={(v) => onChange({ ...about, eyebrow: v })} />
          <AdminField label="Heading" value={about.heading} onChange={(v) => onChange({ ...about, heading: v })} />
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Body / Description</label>
            <textarea
              value={about.body}
              onChange={(e) => onChange({ ...about, body: e.target.value })}
              rows={7}
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground">Highlights</label>
              <button onClick={addHighlight} className="text-xs text-gold hover:underline inline-flex items-center gap-1"><Plus className="h-3 w-3" />Add</button>
            </div>
            <div className="space-y-2">
              {about.highlights.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <input value={h} onChange={(e) => updateHighlight(i, e.target.value)} className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
                  <button onClick={() => removeHighlight(i)} className="px-3 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive flex-shrink-0"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================== CONTACT TAB ======================== */

function ContactTab({ contact, onChange }: { contact: ContactContent; onChange: (c: ContactContent) => void }) {
  const u = (patch: Partial<ContactContent>) => onChange({ ...contact, ...patch });
  return (
    <div>
      <SectionHeader title="Contact Details" subtitle="Update contact info shown on the website and footer." />
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-luxe/30 space-y-4">
        <AdminField label="Section heading" value={contact.heading} onChange={(v) => u({ heading: v })} />
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Subtext</label>
          <textarea
            value={contact.subtext}
            onChange={(e) => u({ subtext: e.target.value })}
            rows={3}
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <AdminField label="Phone" value={contact.phone} onChange={(v) => u({ phone: v })} />
          <AdminField label="Email" type="email" value={contact.email} onChange={(v) => u({ email: v })} />
          <AdminField label="Service area / Location" value={contact.location} onChange={(v) => u({ location: v })} />
          <AdminField label="Instagram URL" value={contact.instagram} placeholder="https://instagram.com/..." onChange={(v) => u({ instagram: v })} />
          <AdminField label="Facebook URL" value={contact.facebook} placeholder="https://facebook.com/..." onChange={(v) => u({ facebook: v })} />
        </div>
      </div>
    </div>
  );
}

/* ======================== SHARED ======================== */

function SectionHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 md:mb-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {action && <div className="flex gap-2">{action}</div>}
    </div>
  );
}

function AdminField({
  label, value, onChange, type = "text", placeholder,
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
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
    </div>
  );
}

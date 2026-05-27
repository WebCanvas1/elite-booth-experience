import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, LogOut, ArrowLeft, Upload, ArrowUp, ArrowDown, Image as ImageIcon, Info, Phone, Package as PackageIcon, Sparkles, CalendarHeart, FileText, ShieldCheck } from "lucide-react";
import { DEFAULT_PACKAGES, type Package } from "@/lib/packages";
import { DEFAULT_CONTENT, mergeContent, type SiteContent, type AboutContent, type ContactContent, type EventItem, type PastEventItem, type FAQItem, type AddOnItem, type PolicyContent, type PolicySection } from "@/lib/site-content";
import { Toaster } from "@/components/ui/sonner";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Elite MagicBooth" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type AdminCreds = { email: string; password: string };

function AdminPage() {
  const [creds, setCreds] = useState<AdminCreds | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const clearAdminSession = () => {
      setCreds(null);
    };

    // Clear auth if user refreshes, closes tab, or navigates away
    window.addEventListener("pagehide", clearAdminSession);
    window.addEventListener("beforeunload", clearAdminSession);

    return () => {
      clearAdminSession();
      window.removeEventListener("pagehide", clearAdminSession);
      window.removeEventListener("beforeunload", clearAdminSession);
    };
  }, []);

  const handleLogin = (c: AdminCreds) => {
    setCreds(c);
  };

  const handleLogout = () => {
    setCreds(null);
    toast.success("Logged out");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-beige">
      <Toaster position="top-center" />

      {!creds ? (
        <LoginCard onLogin={handleLogin} />
      ) : (
        <Dashboard creds={creds} onLogout={handleLogout} />
      )}
    </div>
  );
}
function LoginCard({ onLogin }: { onLogin: (c: AdminCreds) => void }) {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [notice, setNotice] = useState("");

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setNotice("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setErr("Invalid email or password.");
      } else {
        onLogin({ email: email.trim().toLowerCase(), password });
      }
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setNotice("");

    if (newPassword.length < 8) {
      setErr("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          resetCode,
          password: newPassword,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setErr(data.error || "Unable to reset password.");
        return;
      }

      setNotice("Password reset successfully. Please login with your new password.");
      setPassword("");
      setResetCode("");
      setNewPassword("");
      setConfirmPassword("");
      setMode("login");
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10">
      <form
        onSubmit={mode === "login" ? submitLogin : submitForgot}
        className="w-full max-w-md bg-card rounded-3xl shadow-luxe p-7 sm:p-8 border border-border"
      >
        <Link to="/" className="flex justify-center mb-6">
          <img src={logo} alt="Elite MagicBooth" className="h-14" />
        </Link>

        <h1 className="font-serif text-2xl sm:text-3xl text-center mb-2 text-foreground">
          {mode === "login" ? "Admin Login" : "Reset Password"}
        </h1>

        <p className="text-sm text-center text-muted-foreground mb-6">
          {mode === "login"
            ? "Manage your website content"
            : "Enter your admin email, reset code, and new password"}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            />
          </div>

          {mode === "login" ? (
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Master Reset Code
                </label>
                <input
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  type="password"
                  required
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  New Password
                </label>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Confirm New Password
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                />
              </div>
            </>
          )}

          {err && <p className="text-sm text-destructive">{err}</p>}

          {notice && (
            <p className="text-sm text-foreground bg-gold/15 border border-gold/40 rounded-2xl px-4 py-3">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full gradient-gold py-3 font-semibold text-ink shadow-luxe hover:scale-[1.02] transition disabled:opacity-60"
          >
            {submitting
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Reset Password"}
          </button>

          <div className="flex justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "forgot" : "login");
                setErr("");
                setNotice("");
              }}
              className="text-gold hover:underline"
            >
              {mode === "login" ? "Forgot Password?" : "← Back to login"}
            </button>

            <Link to="/" className="text-muted-foreground hover:text-gold">
              ← Back to site
            </Link>
          </div>
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

type TabId = "packages" | "addons" | "events" | "pastEvents" | "gallery" | "about" | "contact" | "faqs" | "terms" | "privacy";

function Dashboard({ creds, onLogout }: { creds: AdminCreds; onLogout: () => void }) {
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
        body: JSON.stringify({ email: creds.email, password: creds.password, ...content }),
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
    { id: "addons", label: "Add-Ons", icon: Sparkles },
    { id: "events", label: "Events", icon: CalendarHeart },
    { id: "pastEvents", label: "Event Galleries", icon: ImageIcon },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "about", label: "About", icon: Info },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "faqs", label: "FAQ", icon: Info },
    { id: "terms", label: "Terms", icon: FileText },
    { id: "privacy", label: "Privacy", icon: ShieldCheck },
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
        {tab === "addons" && (
          <AddOnsTab addOns={content.addOns} onChange={(addOns) => setContent((c) => ({ ...c, addOns }))} />
        )}
        {tab === "events" && (
          <EventsTab events={content.events} onChange={(events) => setContent((c) => ({ ...c, events }))} />
        )}
        {tab === "pastEvents" && (
          <PastEventsTab
            pastEvents={content.pastEvents}
            onChange={(pastEvents) => setContent((c) => ({ ...c, pastEvents }))}
          />
        )}
        {tab === "faqs" && (
          <FaqTab
            faqs={content.faqs}
            onChange={(faqs) => setContent((c) => ({ ...c, faqs }))}
          />
        )}
        {tab === "terms" && (
          <PolicyTab title="Terms & Conditions" subtitle="Edit the Terms & Conditions content shown on /terms." policy={content.terms} onChange={(terms) => setContent((c) => ({ ...c, terms }))} />
        )}
        {tab === "privacy" && (
          <PolicyTab title="Privacy Policy" subtitle="Edit the Privacy Policy content shown on /privacy." policy={content.privacy} onChange={(privacy) => setContent((c) => ({ ...c, privacy }))} />
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
          <p className="text-xs text-muted-foreground">
            Package image is uploaded from your device. Click <span className="text-gold font-semibold">Upload Image</span> to replace it.
          </p>

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

/* ======================== ADD-ONS TAB ======================== */

function AddOnsTab({ addOns, onChange }: { addOns: AddOnItem[]; onChange: (a: AddOnItem[]) => void }) {
  const add = () =>
    onChange([
      ...addOns,
      { id: crypto.randomUUID(), title: "New Add-On", description: "", price: "", image: "", popular: false },
    ]);
  const remove = (idx: number) => onChange(addOns.filter((_, i) => i !== idx));
  const update = (idx: number, patch: Partial<AddOnItem>) =>
    onChange(addOns.map((a, i) => (i === idx ? { ...a, ...patch } : a)));
  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= addOns.length) return;
    const next = [...addOns];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  return (
    <div>
      <SectionHeader
        title="Add-Ons"
        subtitle="Optional extras shown below Packages. Click Save to publish."
        action={
          <button onClick={add} className="inline-flex items-center justify-center gap-2 rounded-full border border-gold text-gold px-4 py-2.5 text-sm font-semibold hover:bg-gold hover:text-ink transition">
            <Plus className="h-4 w-4" /> Add Add-On
          </button>
        }
      />
      <div className="space-y-5">
        {addOns.map((a, idx) => (
          <AddOnEditor
            key={a.id}
            item={a}
            onChange={(patch) => update(idx, patch)}
            onRemove={() => remove(idx)}
            onMoveUp={() => move(idx, -1)}
            onMoveDown={() => move(idx, 1)}
          />
        ))}
      </div>
    </div>
  );
}

function AddOnEditor({
  item, onChange, onRemove, onMoveUp, onMoveDown,
}: {
  item: AddOnItem;
  onChange: (patch: Partial<AddOnItem>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const pickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const url = await fileToCompressedDataUrl(f);
      onChange({ image: url });
      toast.success("Image ready — click Save");
    } catch { toast.error("Could not process image"); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };
  return (
    <div className="bg-card rounded-3xl border border-border p-5 sm:p-6 shadow-luxe/30">
      <div className="grid sm:grid-cols-[200px_1fr] gap-5">
        <div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-3 border border-border">
            {item.image
              ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-gold text-gold text-xs font-semibold py-2.5 hover:bg-gold hover:text-ink transition disabled:opacity-60 mb-2">
            <Upload className="h-3.5 w-3.5" /> {uploading ? "Processing..." : "Upload Image"}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onMoveUp} className="inline-flex items-center justify-center rounded-full border border-border text-xs py-2 hover:text-gold"><ArrowUp className="h-3 w-3" /></button>
            <button onClick={onMoveDown} className="inline-flex items-center justify-center rounded-full border border-border text-xs py-2 hover:text-gold"><ArrowDown className="h-3 w-3" /></button>
          </div>
          <button onClick={onRemove} className="mt-2 w-full inline-flex items-center justify-center gap-1 rounded-full border border-destructive/40 text-destructive text-xs py-2 hover:bg-destructive hover:text-destructive-foreground transition">
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        </div>
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <AdminField label="Title" value={item.title} onChange={(v) => onChange({ title: v })} />
            <AdminField label="Price (display)" value={item.price} placeholder="$120 or POA" onChange={(v) => onChange({ price: v })} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Description</label>
            <textarea value={item.description} onChange={(e) => onChange({ description: e.target.value })} rows={3} className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={item.popular} onChange={(e) => onChange({ popular: e.target.checked })} className="h-4 w-4 accent-[oklch(0.78_0.11_80)]" />
            Show "Popular" badge
          </label>
        </div>
      </div>
    </div>
  );
}

/* ======================== EVENTS TAB ======================== */

function EventsTab({ events, onChange }: { events: EventItem[]; onChange: (e: EventItem[]) => void }) {
  const add = () => onChange([...events, { id: crypto.randomUUID(), title: "New Event", description: "", image: "" }]);
  const remove = (idx: number) => onChange(events.filter((_, i) => i !== idx));
  const update = (idx: number, patch: Partial<EventItem>) =>
    onChange(events.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= events.length) return;
    const next = [...events];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  return (
    <div>
      <SectionHeader
        title="Events We Cover"
        subtitle="Manage the event types shown on the homepage."
        action={
          <button onClick={add} className="inline-flex items-center justify-center gap-2 rounded-full border border-gold text-gold px-4 py-2.5 text-sm font-semibold hover:bg-gold hover:text-ink transition">
            <Plus className="h-4 w-4" /> Add Event
          </button>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev, idx) => (
          <EventEditor
            key={ev.id}
            item={ev}
            onChange={(patch) => update(idx, patch)}
            onRemove={() => remove(idx)}
            onMoveUp={() => move(idx, -1)}
            onMoveDown={() => move(idx, 1)}
          />
        ))}
      </div>
    </div>
  );
}

function EventEditor({
  item, onChange, onRemove, onMoveUp, onMoveDown,
}: {
  item: EventItem;
  onChange: (patch: Partial<EventItem>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const pickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const url = await fileToCompressedDataUrl(f);
      onChange({ image: url });
      toast.success("Image ready — click Save");
    } catch { toast.error("Could not process image"); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };
  return (
    <div className="bg-card rounded-3xl border border-border p-4 shadow-luxe/30">
      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted mb-3 border border-border">
        {item.image
          ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} className="hidden" />
      <button onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-gold text-gold text-xs font-semibold py-2 hover:bg-gold hover:text-ink transition disabled:opacity-60 mb-3">
        <Upload className="h-3.5 w-3.5" /> {uploading ? "Processing..." : "Upload Image"}
      </button>
      <AdminField label="Title" value={item.title} onChange={(v) => onChange({ title: v })} />
      <div className="mt-3">
        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Short description</label>
        <textarea value={item.description} onChange={(e) => onChange({ description: e.target.value })} rows={2} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button onClick={onMoveUp} className="inline-flex items-center justify-center rounded-full border border-border text-xs py-2 hover:text-gold"><ArrowUp className="h-3 w-3" /></button>
        <button onClick={onMoveDown} className="inline-flex items-center justify-center rounded-full border border-border text-xs py-2 hover:text-gold"><ArrowDown className="h-3 w-3" /></button>
        <button onClick={onRemove} className="inline-flex items-center justify-center gap-1 rounded-full border border-destructive/40 text-destructive text-xs py-2 hover:bg-destructive hover:text-destructive-foreground transition"><Trash2 className="h-3 w-3" /></button>
      </div>
    </div>
  );
}


/* ======================== PAST EVENTS TAB ======================== */

function PastEventsTab({
  pastEvents,
  onChange,
}: {
  pastEvents: PastEventItem[];
  onChange: (e: PastEventItem[]) => void;
}) {
  const add = () =>
    onChange([
      ...pastEvents,
      {
        id: crypto.randomUUID(),
        title: "New Event Gallery",
        date: "",
        coverImage: "",
        galleryUrl: "",
        note: "Password protected gallery. Please use the password shared with you.",
      },
    ]);

  const remove = (idx: number) => onChange(pastEvents.filter((_, i) => i !== idx));

  const update = (idx: number, patch: Partial<PastEventItem>) =>
    onChange(pastEvents.map((e, i) => (i === idx ? { ...e, ...patch } : e)));

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= pastEvents.length) return;
    const next = [...pastEvents];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  return (
    <div>
      <SectionHeader
        title="Event Galleries"
        subtitle="Manage past event galleries shown on the website. Add the event name, date, cover image, cloud link, and password note."
        action={
          <button onClick={add} className="inline-flex items-center justify-center gap-2 rounded-full border border-gold text-gold px-4 py-2.5 text-sm font-semibold hover:bg-gold hover:text-ink transition">
            <Plus className="h-4 w-4" /> Add Event Gallery
          </button>
        }
      />

      {pastEvents.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-card rounded-3xl border border-border border-dashed">
          No event galleries yet. Add one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastEvents.map((ev, idx) => (
            <PastEventEditor
              key={ev.id}
              item={ev}
              onChange={(patch) => update(idx, patch)}
              onRemove={() => remove(idx)}
              onMoveUp={() => move(idx, -1)}
              onMoveDown={() => move(idx, 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PastEventEditor({
  item,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  item: PastEventItem;
  onChange: (patch: Partial<PastEventItem>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const pickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { toast.error("Please select an image file"); return; }

    setUploading(true);
    try {
      const url = await fileToCompressedDataUrl(f);
      onChange({ coverImage: url });
      toast.success("Cover image ready — click Save Changes to publish");
    } catch {
      toast.error("Could not process image");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="bg-card rounded-3xl border border-border p-4 shadow-luxe/30">
      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-3 border border-border">
        {item.coverImage ? (
          <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No cover image</div>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} className="hidden" />
      <button onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-gold text-gold text-xs font-semibold py-2 hover:bg-gold hover:text-ink transition disabled:opacity-60 mb-3">
        <Upload className="h-3.5 w-3.5" /> {uploading ? "Processing..." : "Upload Cover Image"}
      </button>

      <div className="space-y-3">
        <AdminField label="Event Title" value={item.title} onChange={(v) => onChange({ title: v })} />
        <AdminField label="Event Date" value={item.date} placeholder="e.g. 12 April 2026" onChange={(v) => onChange({ date: v })} />
        <AdminField label="Cloud Gallery URL" value={item.galleryUrl} placeholder="https://..." onChange={(v) => onChange({ galleryUrl: v })} />

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password Note / Instructions</label>
          <textarea
            value={item.note}
            onChange={(e) => onChange({ note: e.target.value })}
            rows={3}
            placeholder="Password protected gallery. Please use the password shared with you."
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button onClick={onMoveUp} className="inline-flex items-center justify-center rounded-full border border-border text-xs py-2 hover:text-gold">
          <ArrowUp className="h-3 w-3" />
        </button>
        <button onClick={onMoveDown} className="inline-flex items-center justify-center rounded-full border border-border text-xs py-2 hover:text-gold">
          <ArrowDown className="h-3 w-3" />
        </button>
        <button onClick={onRemove} className="inline-flex items-center justify-center gap-1 rounded-full border border-destructive/40 text-destructive text-xs py-2 hover:bg-destructive hover:text-destructive-foreground transition">
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}


/* ======================== FAQ TAB ======================== */

function FaqTab({
  faqs,
  onChange,
}: {
  faqs: FAQItem[];
  onChange: (f: FAQItem[]) => void;
}) {
  const add = () =>
    onChange([
      ...faqs,
      {
        id: crypto.randomUUID(),
        question: "New question",
        answer: "",
      },
    ]);

  const remove = (idx: number) => onChange(faqs.filter((_, i) => i !== idx));

  const update = (idx: number, patch: Partial<FAQItem>) =>
    onChange(faqs.map((f, i) => (i === idx ? { ...f, ...patch } : f)));

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= faqs.length) return;
    const next = [...faqs];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  return (
    <div>
      <SectionHeader
        title="FAQ"
        subtitle="Add, edit, reorder, or remove frequently asked questions shown on the website."
        action={
          <button onClick={add} className="inline-flex items-center justify-center gap-2 rounded-full border border-gold text-gold px-4 py-2.5 text-sm font-semibold hover:bg-gold hover:text-ink transition">
            <Plus className="h-4 w-4" /> Add FAQ
          </button>
        }
      />

      {faqs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-card rounded-3xl border border-border border-dashed">
          No FAQs yet. Add one to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={faq.id} className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-luxe/30">
              <AdminField
                label="Question"
                value={faq.question}
                onChange={(v) => update(idx, { question: v })}
              />

              <div className="mt-3">
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Answer
                </label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => update(idx, { answer: e.target.value })}
                  rows={4}
                  placeholder="Write the answer here..."
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:flex sm:justify-end">
                <button onClick={() => move(idx, -1)} className="inline-flex items-center justify-center rounded-full border border-border text-xs py-2 px-4 hover:text-gold">
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button onClick={() => move(idx, 1)} className="inline-flex items-center justify-center rounded-full border border-border text-xs py-2 px-4 hover:text-gold">
                  <ArrowDown className="h-3 w-3" />
                </button>
                <button onClick={() => remove(idx)} className="inline-flex items-center justify-center gap-1 rounded-full border border-destructive/40 text-destructive text-xs py-2 px-4 hover:bg-destructive hover:text-destructive-foreground transition">
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ======================== POLICY TAB (Terms & Privacy) ======================== */

function PolicyTab({
  title, subtitle, policy, onChange,
}: {
  title: string;
  subtitle: string;
  policy: PolicyContent;
  onChange: (p: PolicyContent) => void;
}) {
  const addSection = () =>
    onChange({ ...policy, sections: [...policy.sections, { id: crypto.randomUUID(), heading: "New Section", body: "" }] });
  const removeSection = (idx: number) =>
    onChange({ ...policy, sections: policy.sections.filter((_, i) => i !== idx) });
  const updateSection = (idx: number, patch: Partial<PolicySection>) =>
    onChange({ ...policy, sections: policy.sections.map((s, i) => (i === idx ? { ...s, ...patch } : s)) });
  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= policy.sections.length) return;
    const next = [...policy.sections];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange({ ...policy, sections: next });
  };

  return (
    <div>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        action={
          <button onClick={addSection} className="inline-flex items-center justify-center gap-2 rounded-full border border-gold text-gold px-4 py-2.5 text-sm font-semibold hover:bg-gold hover:text-ink transition">
            <Plus className="h-4 w-4" /> Add Section
          </button>
        }
      />
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-luxe/30 space-y-4 mb-6">
        <AdminField label="Page heading" value={policy.heading} onChange={(v) => onChange({ ...policy, heading: v })} />
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Intro paragraph</label>
          <textarea value={policy.intro} onChange={(e) => onChange({ ...policy, intro: e.target.value })} rows={3} className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
        </div>
      </div>

      <div className="space-y-4">
        {policy.sections.map((s, idx) => (
          <div key={s.id} className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-luxe/30">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
              <input
                value={s.heading}
                onChange={(e) => updateSection(idx, { heading: e.target.value })}
                placeholder="Section heading"
                className="flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-base sm:text-sm font-serif text-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
              />
              <div className="flex gap-2">
                <button onClick={() => move(idx, -1)} className="px-3 rounded-full border border-border text-muted-foreground hover:text-gold"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => move(idx, 1)} className="px-3 rounded-full border border-border text-muted-foreground hover:text-gold"><ArrowDown className="h-4 w-4" /></button>
                <button onClick={() => removeSection(idx)} className="px-3 rounded-full border border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground transition"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <textarea
              value={s.body}
              onChange={(e) => updateSection(idx, { body: e.target.value })}
              rows={5}
              placeholder="Section content"
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base sm:text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}


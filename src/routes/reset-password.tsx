import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (s: Record<string, unknown>) => ({
    token: typeof s.token === "string" ? s.token : "",
  }),
  head: () => ({
    meta: [{ title: "Reset Password — Elite MagicBooth" }, { name: "robots", content: "noindex" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (pw.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (pw !== pw2) { setErr("Passwords do not match."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password: pw }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErr(data.error || "Reset failed. Please request a new link.");
      } else {
        toast.success("Password updated. Please sign in.");
        navigate({ to: "/admin" });
      }
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-5 py-10">
      <Toaster position="top-center" />
      <form onSubmit={submit} className="w-full max-w-md bg-card rounded-3xl shadow-luxe p-7 sm:p-8 border border-border">
        <Link to="/" className="flex justify-center mb-6"><img src={logo} alt="Elite MagicBooth" className="h-14" /></Link>
        <h1 className="font-serif text-2xl sm:text-3xl text-center mb-2 text-foreground">Reset Password</h1>
        <p className="text-sm text-center text-muted-foreground mb-6">Enter your new admin password below.</p>

        {!token && (
          <p className="text-sm text-destructive mb-4 text-center">Missing or invalid reset link.</p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">New Password</label>
            <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" minLength={8} className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" required />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Confirm Password</label>
            <input value={pw2} onChange={(e) => setPw2(e.target.value)} type="password" minLength={8} className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" required />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button type="submit" disabled={submitting || !token} className="w-full rounded-full gradient-gold py-3 font-semibold text-ink shadow-luxe hover:scale-[1.02] transition disabled:opacity-60">
            {submitting ? "Updating..." : "Update Password"}
          </button>
          <Link to="/admin" className="block text-center text-xs text-muted-foreground hover:text-gold mt-2">← Back to admin login</Link>
        </div>
      </form>
    </div>
  );
}

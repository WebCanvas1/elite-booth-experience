// =============================================================
// Server-side admin auth helpers — Cloudflare Workers compatible.
// =============================================================

import { ALLOWED_ADMIN_EMAILS, isAllowedAdminEmail } from "./admin-emails";

const BOOTSTRAP_PASSWORD = "Melbourne@2026";
const MASTER_RESET_CODE = "Webstarter@2026";
const PBKDF2_ITERATIONS = 100_000;
const RESET_TTL_SECONDS = 60 * 30;

type KVLike = {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string, opts?: { expirationTtl?: number }) => Promise<void>;
  delete: (key: string) => Promise<void>;
};

export async function getKV(): Promise<KVLike | null> {
  try {
    const mod = (await import(/* @vite-ignore */ "cloudflare:workers").catch(() => null)) as
      | { env?: Record<string, unknown> }
      | null;

    return (mod?.env?.PHOTOBOOTH_KV as KVLike | undefined) ?? null;
  } catch {
    return null;
  }
}

function toB64(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function fromB64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const enc = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as unknown as ArrayBuffer,
      iterations,
      hash: "SHA-256",
    },
    key,
    256
  );

  return new Uint8Array(bits);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;

  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a[i] ^ b[i];

  return r === 0;
}

type PwRecord = {
  salt: string;
  hash: string;
  iterations: number;
};

function pwKey(email: string) {
  return `admin:pw:${email.toLowerCase()}`;
}

function resetKey(token: string) {
  return `admin:reset:${token}`;
}

export async function setAdminPassword(email: string, password: string): Promise<void> {
  const normalisedEmail = email.trim().toLowerCase();

  if (!isAllowedAdminEmail(normalisedEmail)) {
    throw new Error("Not an allowed admin email");
  }

  const kv = await getKV();

  if (!kv) {
    throw new Error("KV storage is not available");
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);

  const rec: PwRecord = {
    salt: toB64(salt),
    hash: toB64(hash),
    iterations: PBKDF2_ITERATIONS,
  };

  await kv.put(pwKey(normalisedEmail), JSON.stringify(rec));
}

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const normalisedEmail = email.trim().toLowerCase();

  if (!isAllowedAdminEmail(normalisedEmail)) return false;

  const kv = await getKV();

  if (!kv) {
    return password === BOOTSTRAP_PASSWORD;
  }

  const raw = await kv.get(pwKey(normalisedEmail));

  if (!raw) {
    if (password === BOOTSTRAP_PASSWORD) {
      await setAdminPassword(normalisedEmail, password);
      return true;
    }

    return false;
  }

  try {
    const rec = JSON.parse(raw) as PwRecord;
    const salt = fromB64(rec.salt);
    const expected = fromB64(rec.hash);
    const actual = await pbkdf2(password, salt, rec.iterations || PBKDF2_ITERATIONS);

    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export async function issueResetToken(email: string): Promise<string> {
  const token = toB64(crypto.getRandomValues(new Uint8Array(32)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  const kv = await getKV();

  const record = JSON.stringify({
    email: email.toLowerCase(),
    expiresAt: Date.now() + RESET_TTL_SECONDS * 1000,
  });

  if (kv) {
    await kv.put(resetKey(token), record, { expirationTtl: RESET_TTL_SECONDS });
  }

  return token;
}

export async function consumeResetToken(
  token: string,
  newPassword: string
): Promise<{ ok: true; email: string } | { ok: false; reason: string }> {
  if (!token) return { ok: false, reason: "Invalid token" };

  if (!newPassword || newPassword.length < 8) {
    return { ok: false, reason: "Password must be at least 8 characters" };
  }

  const kv = await getKV();

  if (!kv) {
    return { ok: false, reason: "Reset is not available without KV storage" };
  }

  const raw = await kv.get(resetKey(token));

  if (!raw) {
    return { ok: false, reason: "Reset link is invalid or has expired" };
  }

  try {
    const rec = JSON.parse(raw) as { email: string; expiresAt: number };

    if (Date.now() > rec.expiresAt) {
      await kv.delete(resetKey(token));
      return { ok: false, reason: "Reset link has expired" };
    }

    if (!isAllowedAdminEmail(rec.email)) {
      await kv.delete(resetKey(token));
      return { ok: false, reason: "Email no longer authorised" };
    }

    await setAdminPassword(rec.email, newPassword);
    await kv.delete(resetKey(token));

    return { ok: true, email: rec.email };
  } catch {
    return { ok: false, reason: "Reset link is invalid" };
  }
}

export async function resetPasswordWithMasterCode(
  email: string,
  resetCode: string,
  password: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const normalisedEmail = email.trim().toLowerCase();

  if (!isAllowedAdminEmail(normalisedEmail)) {
    return { ok: false, reason: "Unauthorised email" };
  }

  if (resetCode !== MASTER_RESET_CODE) {
    return { ok: false, reason: "Invalid reset code" };
  }

  if (!password || password.length < 8) {
    return { ok: false, reason: "Password must be at least 8 characters" };
  }

  try {
    await setAdminPassword(normalisedEmail, password);
    return { ok: true };
  } catch {
    return { ok: false, reason: "Unable to update password" };
  }
}

export async function sendResetEmail(toEmail: string, resetUrl: string): Promise<void> {
  const mod = (await import(/* @vite-ignore */ "cloudflare:workers").catch(() => null)) as
    | { env?: Record<string, string> }
    | null;

  const apiKey = mod?.env?.RESEND_API_KEY;
  const from = mod?.env?.RESET_FROM_EMAIL || "Elite MagicBooth <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(`[admin-reset] reset link for ${toEmail}: ${resetUrl}`);
    return;
  }

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#fff;color:#1a1a1a;">
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px;">Elite MagicBooth — Admin Password Reset</h1>
      <p style="font-size:14px;line-height:1.6;color:#444;">A password reset was requested for your admin account. Click below to set a new password. This link expires in 30 minutes.</p>
      <p style="margin:24px 0;">
        <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#e6c87a,#c89a4a);color:#1a1a1a;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600;">Reset Password</a>
      </p>
      <p style="font-size:12px;color:#888;word-break:break-all;">Or paste this link into your browser:<br/>${resetUrl}</p>
      <p style="font-size:12px;color:#888;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
    </div>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [toEmail],
      subject: "Reset your Elite MagicBooth admin password",
      html,
    }),
  });
}

export { ALLOWED_ADMIN_EMAILS, isAllowedAdminEmail };

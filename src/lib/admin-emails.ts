// Client-safe list of allowed admin emails.
// Both the admin login form and the password-reset flow validate against this list.
export const ALLOWED_ADMIN_EMAILS = [
  "webstarter17@gmail.com",
  "elitemagicbooth@gmail.com",
] as const;

export type AdminEmail = (typeof ALLOWED_ADMIN_EMAILS)[number];

export function isAllowedAdminEmail(email: string): email is AdminEmail {
  const normalized = email.trim().toLowerCase();
  return (ALLOWED_ADMIN_EMAILS as readonly string[]).includes(normalized);
}

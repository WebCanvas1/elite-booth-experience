import { createFileRoute } from "@tanstack/react-router";
import { isAllowedAdminEmail, issueResetToken, sendResetEmail } from "@/lib/admin-auth.server";

// Always returns 200 with a generic message — never leaks which emails exist.
export const Route = createFileRoute("/api/admin/forgot")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as { email?: string } | null;
        const email = (body?.email || "").trim().toLowerCase();
        if (email && isAllowedAdminEmail(email)) {
          try {
            const token = await issueResetToken(email);
            const origin =
              process.env.RESET_PUBLIC_ORIGIN ||
              new URL(request.url).origin;
            const resetUrl = `${origin}/reset-password?token=${encodeURIComponent(token)}`;
            await sendResetEmail(email, resetUrl);
          } catch (err) {
            console.error("[admin/forgot] failed to issue reset", err);
          }
        }
        return new Response(
          JSON.stringify({ ok: true, message: "If this email is authorised, a reset link has been sent." }),
          { headers: { "content-type": "application/json" } },
        );
      },
    },
  },
});

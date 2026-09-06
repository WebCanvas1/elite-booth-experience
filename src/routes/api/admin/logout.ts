import { createFileRoute } from "@tanstack/react-router";
import {
  clearAdminSessionCookie,
  deleteAdminSession,
  getAdminSessionTokenFromRequest,
} from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = getAdminSessionTokenFromRequest(request);

        try {
          await deleteAdminSession(token);
        } catch {
          // Still clear the browser cookie even if KV cleanup fails.
        }

        return new Response(JSON.stringify({ ok: true }), {
          headers: {
            "content-type": "application/json",
            "cache-control": "no-store",
            "set-cookie": clearAdminSessionCookie(),
          },
        });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import {
  getAdminSessionTokenFromRequest,
  verifyAdminSession,
} from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const token = getAdminSessionTokenFromRequest(request);
        const session = await verifyAdminSession(token);

        if (!session.ok) {
          return new Response(JSON.stringify({ ok: false }), {
            status: 401,
            headers: {
              "content-type": "application/json",
              "cache-control": "no-store",
            },
          });
        }

        return new Response(
          JSON.stringify({
            ok: true,
            email: session.email,
          }),
          {
            headers: {
              "content-type": "application/json",
              "cache-control": "no-store",
            },
          },
        );
      },
    },
  },
});

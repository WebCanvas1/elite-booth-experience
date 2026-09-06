import { createFileRoute } from "@tanstack/react-router";
import {
  createAdminSession,
  makeAdminSessionCookie,
  verifyAdminCredentials,
} from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as
          | { email?: string; password?: string }
          | null;

        const email = (body?.email || "").trim().toLowerCase();
        const password = body?.password || "";

        if (!email || !password) {
          return new Response(JSON.stringify({ ok: false }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const ok = await verifyAdminCredentials(email, password);

        if (!ok) {
          return new Response(
            JSON.stringify({ ok: false, error: "Invalid credentials" }),
            {
              status: 401,
              headers: { "content-type": "application/json" },
            },
          );
        }

        try {
          const sessionToken = await createAdminSession(email);

          return new Response(JSON.stringify({ ok: true, email }), {
            headers: {
              "content-type": "application/json",
              "cache-control": "no-store",
              "set-cookie": makeAdminSessionCookie(sessionToken),
            },
          });
        } catch {
          return new Response(
            JSON.stringify({ ok: false, error: "Unable to create admin session" }),
            {
              status: 500,
              headers: {
                "content-type": "application/json",
                "cache-control": "no-store",
              },
            },
          );
        }
      },
    },
  },
});

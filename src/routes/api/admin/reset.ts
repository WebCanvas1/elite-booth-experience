import { createFileRoute } from "@tanstack/react-router";
import { consumeResetToken } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/reset")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as
          | { token?: string; password?: string }
          | null;
        const token = (body?.token || "").trim();
        const password = body?.password || "";
        const result = await consumeResetToken(token, password);
        if (!result.ok) {
          return new Response(JSON.stringify({ ok: false, error: result.reason }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ ok: true }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});

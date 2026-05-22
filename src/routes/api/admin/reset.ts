import { createFileRoute } from "@tanstack/react-router";
import { resetPasswordWithMasterCode } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/reset")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as
          | {
              email?: string;
              resetCode?: string;
              password?: string;
            }
          | null;

        const email = (body?.email || "").trim().toLowerCase();
        const resetCode = body?.resetCode || "";
        const password = body?.password || "";

        const result = await resetPasswordWithMasterCode(
          email,
          resetCode,
          password
        );

        if (!result.ok) {
          return new Response(
            JSON.stringify({ ok: false, error: result.reason }),
            {
              status: 400,
              headers: { "content-type": "application/json" },
            }
          );
        }

        return new Response(JSON.stringify({ ok: true }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});

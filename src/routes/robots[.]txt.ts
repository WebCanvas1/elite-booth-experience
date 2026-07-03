import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(`User-agent: *
Allow: /

Sitemap: https://elitemagicbooth.com.au/sitemap.xml`, {
          headers: {
            "Content-Type": "text/plain",
          },
        });
      },
    },
  },
});

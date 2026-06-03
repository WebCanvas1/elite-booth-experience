import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/enquiry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const data = await request.json();

          const {
            name,
            email,
            phone,
            eventType,
            date,
            location,
            package: packageName,
            addOn,
            message,
          } = data;

          const { env } = await import("cloudflare:workers");
          const apiKey = env.RESEND_API_KEY as string | undefined;

          if (!apiKey) {
            return new Response(JSON.stringify({ error: "Missing API key" }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }

          const emailBody = `
New Photobooth Enquiry

Name: ${name}
Email: ${email}
Phone: ${phone}

Event Type: ${eventType}
Event Date: ${date}
Location: ${location}

Package: ${packageName}
Add-On: ${addOn}

Message:
${message}
`;

          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Elite MagicBooth <onboarding@resend.dev>",
              to: ["webstarter17@gmail.com"],
              subject: `🎉 New Elite MagicBooth Enquiry - ${name}`,
              text: emailBody,
            }),
          });

          if (!response.ok) {
            const error = await response.text();

            return new Response(JSON.stringify({ error }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ ok: true }), {
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});

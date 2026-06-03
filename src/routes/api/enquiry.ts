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

          const RESEND_API_KEY =
            (globalThis as unknown as { RESEND_API_KEY?: string })
              .RESEND_API_KEY;

          if (!RESEND_API_KEY) {
            return new Response(
              JSON.stringify({
                error: "Missing RESEND_API_KEY",
              }),
              {
                status: 500,
                headers: {
                  "content-type": "application/json",
                },
              }
            );
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

          const response = await fetch(
            "https://api.resend.com/emails",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "Elite MagicBooth <onboarding@resend.dev>",
                to: ["elitemagicbooth@gmail.com"],
                subject: `New Enquiry from ${name}`,
                text: emailBody,
              }),
            }
          );

          if (!response.ok) {
            const error = await response.text();

            return new Response(
              JSON.stringify({
                error,
              }),
              {
                status: 500,
                headers: {
                  "content-type": "application/json",
                },
              }
            );
          }

          return new Response(
            JSON.stringify({
              success: true,
            }),
            {
              headers: {
                "content-type": "application/json",
              },
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: String(error),
            }),
            {
              status: 500,
              headers: {
                "content-type": "application/json",
              },
            }
          );
        }
      },
    },
  },
});

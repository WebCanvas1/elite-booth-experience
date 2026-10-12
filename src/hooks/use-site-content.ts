import { useEffect, useState } from "react";
import {
  DEFAULT_CONTENT,
  mergeContent,
  type SiteContent,
} from "@/lib/site-content";

// Share the same request across the homepage, footer and gallery.
// A short-lived in-memory cache also avoids a second loading screen when
// navigating between pages, without storing outdated prices long-term.
const CONTENT_TTL_MS = 10_000;
let cachedContent: SiteContent | null = null;
let cachedAt = 0;
let pendingRequest: Promise<SiteContent> | null = null;

function getCurrentContent(): Promise<SiteContent> {
  if (cachedContent && Date.now() - cachedAt < CONTENT_TTL_MS) {
    return Promise.resolve(cachedContent);
  }

  if (!pendingRequest) {
    pendingRequest = fetch("/api/content", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load content");
        return response.json() as Promise<Partial<SiteContent>>;
      })
      .then((data) => {
        const current = mergeContent(data);
        cachedContent = current;
        cachedAt = Date.now();
        return current;
      })
      .finally(() => {
        pendingRequest = null;
      });
  }

  return pendingRequest;
}

export function useSiteContent(): SiteContent & {
  isContentLoading: boolean;
  contentLoadError: boolean;
} {
  const [content, setContent] = useState<SiteContent>(() =>
    cachedContent && Date.now() - cachedAt < CONTENT_TTL_MS
      ? cachedContent
      : DEFAULT_CONTENT
  );
  const [isContentLoading, setIsContentLoading] = useState(
    () => !(cachedContent && Date.now() - cachedAt < CONTENT_TTL_MS)
  );
  const [contentLoadError, setContentLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    getCurrentContent()
      .then((current) => {
        if (!active) return;
        setContent(current);
        setContentLoadError(false);
        setIsContentLoading(false);
      })
      .catch((error) => {
        if (!active) return;
        console.error("Failed to load site content:", error);
        setContentLoadError(true);
        setIsContentLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { ...content, isContentLoading, contentLoadError };
}

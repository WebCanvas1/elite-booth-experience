import { useEffect, useState } from "react";
import {
  DEFAULT_CONTENT,
  mergeContent,
  type SiteContent,
} from "@/lib/site-content";

export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/content?ts=${Date.now()}`, {
      cache: "no-store",
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load content");
        return r.json();
      })
      .then((data) => {
        if (!cancelled) {
          setContent(mergeContent(data as Partial<SiteContent>));
        }
      })
      .catch((err) => {
        console.error("Failed to load site content:", err);
        if (!cancelled) {
          setContent(DEFAULT_CONTENT);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return content;
}

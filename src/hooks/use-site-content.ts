import { useEffect, useState } from "react";
import {
  DEFAULT_CONTENT,
  mergeContent,
  type SiteContent,
} from "@/lib/site-content";

// Never display bundled demo prices while waiting for the client's live CMS data.
export function useSiteContent(): SiteContent & {
  isContentLoading: boolean;
  contentLoadError: boolean;
} {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [contentLoadError, setContentLoadError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/content", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load content");
        return response.json();
      })
      .then((data) => {
        if (controller.signal.aborted) return;
        setContent(mergeContent(data as Partial<SiteContent>));
        setContentLoadError(false);
        setIsContentLoading(false);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Failed to load site content:", error);
        setContentLoadError(true);
        setIsContentLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { ...content, isContentLoading, contentLoadError };
}

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

    const fetchContent = async () => {
      try {
        const response = await fetch(
          `/api/content?ts=${Date.now()}&nocache=${Math.random()}`,
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );

        const data = await response.json();

        if (!cancelled) {
          setContent(mergeContent(data as Partial<SiteContent>));
        }
      } catch (error) {
        console.error("Failed to load site content:", error);

        if (!cancelled) {
          setContent(DEFAULT_CONTENT);
        }
      }
    };

    fetchContent();

    return () => {
      cancelled = true;
    };
  }, []);

  return content;
}

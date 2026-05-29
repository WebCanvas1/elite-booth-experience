import { useEffect, useState } from "react";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "@/lib/site-content";

export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/content?ts=${Date.now()}`, {
  cache: "no-store",
})
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setContent(mergeContent(d as Partial<SiteContent>));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return content;
}

import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// the id to scroll to for a location hash, or null for the top of the page (a malformed hash is used as it is)
export function scrollTarget(hash: string): string | null {
  if (hash.length <= 1) return null;
  try { return decodeURIComponent(hash.slice(1)); } catch { return hash.slice(1); }
}

// react-router keeps the old scroll position on a link; a new page starts at its top, or at its #section.
// Back, forward and a reload keep where the browser put the reader. The jump waits a frame, so the stories have
// set their real heights first; the link's key makes a second click on the same link work.
export function ScrollOnNav() {
  const { pathname, hash, key } = useLocation();
  const nav = useNavigationType(), first = useRef(true);
  useEffect(() => {
    const isFirst = first.current; first.current = false;
    if (nav === "POP" && !(isFirst && hash)) return;
    const id = scrollTarget(hash);
    const raf = requestAnimationFrame(() => {
      const el = id ? document.getElementById(id) : null;
      if (el) el.scrollIntoView();
      else if (!isFirst) scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash, key, nav]);
  return null;
}

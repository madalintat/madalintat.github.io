import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// the id to scroll to for a location hash, or null for the top of the page
export function scrollTarget(hash: string): string | null {
  return hash.length > 1 ? decodeURIComponent(hash.slice(1)) : null;
}

// react-router keeps the old scroll position on a link; a new page starts at its top, or at its #section
export function ScrollOnNav() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const id = scrollTarget(hash);
    const el = id ? document.getElementById(id) : null;
    if (el) el.scrollIntoView();
    else scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

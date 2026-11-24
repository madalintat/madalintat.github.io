/* A phone's bottom sheet: a real <dialog> in the top layer, so it sits over everything, keeps focus inside and gives it
   back after. It slides up over a dimmed page; it closes on its X, on Escape, on a tap on the dimmed page, or dragged
   down by its top. While it is open the page under it does not scroll (sea.css), so nothing moves behind it. */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  // mounted only on the client and only while open: the prerendered page carries none of it
  return open && typeof document !== "undefined" ? createPortal(<Panel onClose={onClose} label={label}>{children}</Panel>, document.body) : null;
}

function Panel({ onClose, label, children }: { onClose: () => void; label: string; children: ReactNode }) {
  const d = useRef<HTMLDialogElement>(null), body = useRef<HTMLDivElement>(null), drag = useRef<{ y: number; t: number } | null>(null);
  const [leaving, setLeaving] = useState(false);
  // focus lands on the words, not on the close button (it would wear its focus ring from the first frame); Tab reaches it
  useEffect(() => { d.current?.showModal(); body.current?.focus({ preventScroll: true }); }, []);
  // closing slides it down first; with less motion asked for it just goes
  const close = () => {
    if (leaving) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { d.current?.close(); onClose(); return; }
    setLeaving(true);
    window.setTimeout(() => { d.current?.close(); onClose(); }, 220);
  };
  const move = (y: number) => { if (d.current) d.current.style.transform = y > 0 ? `translateY(${y}px)` : ""; };
  return (
    <dialog ref={d} className={`bsheet${leaving ? " leaving" : ""}`} aria-label={label}
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      {/* the top of the sheet is its handle: pulled down far enough, or flicked, it lets go */}
      <div className="bsheet-grab"
        onPointerDown={(e) => { drag.current = { y: e.clientY, t: performance.now() }; e.currentTarget.setPointerCapture(e.pointerId); d.current?.classList.add("dragging"); }}
        onPointerMove={(e) => { if (drag.current) move(e.clientY - drag.current.y); }}
        onPointerUp={(e) => {
          const g = drag.current; drag.current = null; d.current?.classList.remove("dragging");
          if (!g) return;
          const dy = e.clientY - g.y, v = dy / Math.max(1, performance.now() - g.t);
          if (dy > 90 || (dy > 24 && v > 0.6)) close(); else move(0);
        }}
        onPointerCancel={() => { drag.current = null; d.current?.classList.remove("dragging"); move(0); }}>
        <i className="bsheet-handle" aria-hidden="true" />
      </div>
      <button type="button" className="bsheet-close" aria-label="close" onClick={close}><X size={18} strokeWidth={1.8} aria-hidden="true" /></button>
      <div className="bsheet-body" ref={body} tabIndex={-1}>{children}</div>
    </dialog>
  );
}

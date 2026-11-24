import { useEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon } from "./icons";
import "./film.css";

type Props = { src: string; poster: string; alt: string };

// Muted, looping, never autoplays from the server. On the client it starts only when reduced motion is off.
export function Film({ src, poster, alt }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().then(() => setPlaying(true), () => setPlaying(false));
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true), () => setPlaying(false));
    else { v.pause(); setPlaying(false); }
  };

  return (
    <figure className="film">
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={alt} />
      <button type="button" className="film-toggle" onClick={toggle} aria-label={playing ? "pause film" : "play film"}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
    </figure>
  );
}

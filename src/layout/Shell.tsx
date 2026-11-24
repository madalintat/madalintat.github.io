import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./shell.css";

export const PROFILES = [
  { label: "github", href: "https://github.com/madalintat" },
  { label: "hugging face", href: "https://huggingface.co/cetusian" },
  { label: "x", href: "https://x.com/cetusian" },
  { label: "linkedin", href: "https://www.linkedin.com/in/madalin-tatarciuc/" },
];

// Every page but home: a one-line bar back to home, then the page.
export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="bar">
        <Link to="/">mădălin tatarciuc</Link>
        <nav>
          <Link to="/notes">notes</Link>
          <Link to="/cv">cv</Link>
        </nav>
      </header>
      <main className="page">{children}</main>
    </>
  );
}

import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { EMAIL } from "../content/world";
import "./shell.css";

export const PROFILES = [
  { label: "github", href: "https://github.com/madalintat" },
  { label: "hugging face", href: "https://huggingface.co/cetusian" },
  { label: "x", href: "https://x.com/cetusian" },
  { label: "linkedin", href: "https://www.linkedin.com/in/madalin-tatarciuc" },
];

export function TopBar() {
  return (
    <header className="bar">
      <Link className="who" to="/">mădălin tatarciuc</Link>
      <nav>
        <Link to="/#flock">work</Link>
        <Link to="/notes">notes</Link>
        <Link to="/cv">cv</Link>
      </nav>
      <a className="mail" href={`mailto:${EMAIL}`}>email</a>
    </header>
  );
}

// Every page but home: the bar, then the page.
export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar />
      <main className="page">{children}</main>
    </>
  );
}

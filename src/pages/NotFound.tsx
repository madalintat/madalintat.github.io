import { Link } from "react-router-dom";
import { Shell } from "../layout/Shell";

export function NotFound() {
  return (
    <Shell>
      <h1 className="nf">not here</h1>
      <p className="nf-line">that page does not exist. <Link to="/">the work is on the home page</Link></p>
    </Shell>
  );
}

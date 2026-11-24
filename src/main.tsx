import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/inter";
import "./styles/tokens.css";
import "./styles/base.css";
import { App } from "./App";

const root = document.getElementById("root")!;
const app = <BrowserRouter><App /></BrowserRouter>;
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);

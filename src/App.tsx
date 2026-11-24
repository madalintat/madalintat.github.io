import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { WorkPage } from "./pages/Work";
import { NotFound } from "./pages/NotFound";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/work/:slug" element={<WorkPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

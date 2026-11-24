import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { WorkPage } from "./pages/Work";
import { NotFound } from "./pages/NotFound";
import { NotesPage, NotePage } from "./pages/Notes";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/work/:slug" element={<WorkPage />} />
      <Route path="/notes" element={<NotesPage />} />
      <Route path="/notes/:slug" element={<NotePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

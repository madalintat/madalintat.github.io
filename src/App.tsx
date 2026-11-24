import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { WorkPage } from "./pages/Work";
import { NotFound } from "./pages/NotFound";
import { NotesPage, NotePage } from "./pages/Notes";
import { CvPage } from "./pages/Cv";
import { ScrollOnNav } from "./layout/ScrollOnNav";

export function App() {
  return (
    <>
    <ScrollOnNav />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/work/:slug" element={<WorkPage />} />
      <Route path="/cv" element={<CvPage />} />
      <Route path="/notes" element={<NotesPage />} />
      <Route path="/notes/:slug" element={<NotePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}

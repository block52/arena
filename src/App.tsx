import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Lobby } from "./views/Lobby";
import { WatchTable } from "./views/WatchTable";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/watch/:id" element={<WatchTable />} />
      </Routes>
    </BrowserRouter>
  );
}

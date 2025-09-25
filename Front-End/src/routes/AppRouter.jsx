import { BrowserRouter, Routes, Route } from "react-router";
import Auth from "../pages/Auth/Auth";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

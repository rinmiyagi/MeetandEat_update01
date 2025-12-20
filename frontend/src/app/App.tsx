"use client";
import { Route, Routes } from "react-router-dom";
import AdminPage from "./pages/admin.tsx";
import LP from "./pages/LandingPage.tsx";
import Part from "./pages/part.tsx";
import Result from "./pages/result.tsx";
import Participant from "./pages/Participant.tsx";
import Restaurant from "./components/Restaurant.tsx";

export default function App() {
  return (
    <Routes>
      <Route index element={<LP />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/part" element={<Part />} />
      <Route path="/result" element={<Result />} />
      <Route path= "/participant" element = {<Participant />} />
      {/* 結果表示できるかのテスト */}
      <Route path= "/restaurant" element = {<Restaurant />} /> 
    </Routes>
  );
}

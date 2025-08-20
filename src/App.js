import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BrandsPage from "./pages/BrandsPage";
import ModelsPage from "./pages/ModelsPage";
import GuitarDetailsPage from "./pages/GuitarDetailsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BrandsPage />} />
        <Route path="/brands/:brandId" element={<ModelsPage />} />
        <Route path="/guitar/:guitarId" element={<GuitarDetailsPage />} />
        <Route path="/brands/:brandId/models/:modelId" element={<GuitarDetailsPage />} />

      </Routes>
    </Router>
  );
}

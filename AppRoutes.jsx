// File: src/routes/AppRoutes.jsx
// AppRoutes.jsx
// This file contains the routing configuration for the application
// It uses React Router to define the routes and their corresponding components

import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SpacecraftsPage from "../pages/SpacecraftsPage";
import SpacecraftPage from "../pages/SpacecraftPage";
import SpacecraftForm from "../pages/SpacecraftForm"; // Page for creating spacecraft
import PlanetsPage from "../pages/PlanetsPage";
import NotFoundPage from "../pages/NotFoundPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/spacecrafts" element={<SpacecraftsPage />} />
      <Route path="/spacecrafts/:id" element={<SpacecraftPage />} />
      <Route path="/construct" element={<SpacecraftForm />} />{" "}
      {/* Only for creating new spacecraft */}
      <Route path="/planets" element={<PlanetsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

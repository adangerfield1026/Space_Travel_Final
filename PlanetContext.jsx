// src/context/PlanetContext.jsx
// This file contains the context for managing planet data in the application
// It provides a way to fetch and store planet data from the SpaceTravelApi
// It also handles loading and error states for the data fetching process
// This context can be used in any component that needs access to planet data
// It uses React's Context API to provide a global state for planets as learned in the course
// It also uses the useEffect hook to fetch data when the component mounts

import React, { createContext, useState, useContext, useEffect } from "react";
import { getPlanets } from "../services/SpaceTravelApi";

// Create the context
const PlanetContext = createContext();

// Custom hook for consuming the context
export const usePlanet = () => useContext(PlanetContext);

// Context provider component
export const PlanetProvider = ({ children }) => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlanets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPlanets();
      if (response.isError) {
        setError(response.error || "Failed to fetch planets.");
        setPlanets([]);
      } else {
        setPlanets(response.data);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
      setPlanets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  return (
    <PlanetContext.Provider value={{ planets, fetchPlanets, loading, error }}>
      {children}
    </PlanetContext.Provider>
  );
};

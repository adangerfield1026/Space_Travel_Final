import { createContext, useContext, useState, useEffect, useMemo } from "react";
import SpaceTravelApi from "../services/SpaceTravelApi";

const SpacecraftContext = createContext();

export const useSpacecraft = () => useContext(SpacecraftContext);

export const SpacecraftProvider = ({ children }) => {
  const [spacecrafts, setSpacecrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch spacecrafts from API
  const fetchSpacecrafts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await SpaceTravelApi.getSpacecrafts();
      if (!res.isError) {
        setSpacecrafts(res.data);
      } else {
        setError("Failed to load spacecrafts.");
      }
    } catch (err) {
      setError("An error occurred while fetching spacecrafts.");
    } finally {
      setLoading(false);
    }
  };

  // Add spacecraft function to update state and re-fetch data
  const addSpacecraft = async (newSpacecraft) => {
    try {
      const res = await SpaceTravelApi.buildSpacecraft(newSpacecraft);
      if (!res.isError) {
        setSpacecrafts((prevSpacecrafts) => [...prevSpacecrafts, res.data]);
        fetchSpacecrafts(); // Re-fetch to get the updated list
      } else {
        setError("Failed to add spacecraft.");
      }
    } catch (err) {
      setError("Error adding spacecraft: " + err.message);
    }
  };

  useEffect(() => {
    fetchSpacecrafts();
  }, []);

  const value = useMemo(
    //to avoid unnecessary re-renders
    () => ({
      spacecrafts,
      loading,
      error,
      fetchSpacecrafts,
      addSpacecraft,
    }),
    [spacecrafts, loading, error]
  );

  return (
    <SpacecraftContext.Provider value={value}>
      {children}
    </SpacecraftContext.Provider>
  );
};

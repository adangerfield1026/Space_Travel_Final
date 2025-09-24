// SpacecraftsPage.jsx
// This component fetches and displays a list of spacecrafts
// It allows users to delete spacecrafts and navigate to a page for creating new spacecrafts
// It handles loading states and error messages for each spacecraft
// It also maps the currentLocation (planet ID) to the planet name for display

import React, { useEffect, useState } from "react";
import SpaceTravelApi from "../services/SpaceTravelApi";
import SpacecraftCard from "../components/SpacecraftCard";
import Loading from "../components/Loading";
import styles from "./SpacecraftsPage.module.css";
import { Link } from "react-router-dom";

const SpacecraftsPage = () => {
  const [spacecrafts, setSpacecrafts] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSpacecrafts = async () => {
      setLoading(true);
      setError(""); // Reset error state before fetching
      try {
        const response = await SpaceTravelApi.getSpacecrafts();
        if (!response.isError) {
          setSpacecrafts(response.data); // Set spacecrafts data in state
        } else {
          setError("Failed to load spacecrafts.");
        }
      } catch (error) {
        setError("An error occurred while fetching spacecrafts.");
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    const fetchPlanets = async () => {
      setLoading(true);
      try {
        const response = await SpaceTravelApi.getPlanets();
        if (!response.isError) {
          setPlanets(response.data); // Set planets data in state
        } else {
          setError("Failed to load planets.");
        }
      } catch (error) {
        setError("An error occurred while fetching planets.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpacecrafts();
    fetchPlanets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this spacecraft?"))
      return;

    const previousSpacecrafts = [...spacecrafts];
    setSpacecrafts(spacecrafts.filter((sc) => sc.id !== id)); // Optimistically remove the spacecraft

    try {
      const response = await SpaceTravelApi.destroySpacecraftById({ id });
      if (response.isError) {
        throw new Error("Failed to delete spacecraft.");
      }
    } catch (err) {
      setSpacecrafts(previousSpacecrafts); // Revert deletion if the API call fails
      alert("An error occurred while deleting spacecraft.");
    }
  };

  if (loading) return <Loading />; // Show loading component while fetching data
  if (error) return <div className={styles.error}>{error}</div>; // Show error message if any

  // Function to map currentLocation (planet ID) to planet name
  const getPlanetNameById = (id) => {
    const planet = planets.find((planet) => planet.id === id);
    return planet ? planet.name : "Unknown";
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🚀 Spacecraft Fleet</h2>
      {spacecrafts.length === 0 ? (
        <p className={styles.empty}>No spacecraft available.</p>
      ) : (
        <div className={styles.grid}>
          {spacecrafts.map((spacecraft) => (
            <SpacecraftCard
              key={spacecraft.id}
              spacecraft={{
                ...spacecraft,
                currentLocation: getPlanetNameById(spacecraft.currentLocation), // Add the planet name
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      <div className={styles.addButtonContainer}>
        <Link to="/construct" className={styles.addButton}>
          + New Spacecraft
        </Link>
      </div>
    </div>
  );
};

export default SpacecraftsPage;

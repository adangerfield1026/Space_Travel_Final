// SpacecraftList.jsx
// This component displays a list of spacecrafts in a grid layout
// It handles loading states and error messages for each spacecraft
// It also allows users to delete spacecrafts and navigate to a page for creating new spacecrafts

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SpaceTravelApi from "../services/SpaceTravelApi";
import SpacecraftCard from "../components/SpacecraftCard"; // Import the SpacecraftCard component to display each spacecraft
import Loading from "../components/Loading";
import styles from "./SpacecraftsPage.module.css";

const SpacecraftsPage = () => {
  const [spacecrafts, setSpacecrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSpacecrafts = async () => {
      try {
        const response = await SpaceTravelApi.getSpacecrafts();
        if (!response.isError) {
          setSpacecrafts(response.data);
        } else {
          setError("Failed to load spacecrafts. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching spacecrafts:", error);
        setError("An error occurred while fetching spacecrafts.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpacecrafts();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className={styles.error}>{error}</div>; // Display error message if any

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🚀 Spacecraft Fleet</h2>
      {spacecrafts.length === 0 ? (
        <p className={styles.empty}>No spacecraft available.</p>
      ) : (
        <div className={styles.grid}>
          {spacecrafts.map((spacecraft) => (
            <SpacecraftCard key={spacecraft.id} spacecraft={spacecraft} />
          ))}
        </div>
      )}
      {/* Add a button to create a new spacecraft */}
      <div className={styles.addButtonContainer}>
        <Link to="/construct" className={styles.addButton}>
          + New Spacecraft
        </Link>
      </div>
    </div>
  );
};

export default SpacecraftsPage;

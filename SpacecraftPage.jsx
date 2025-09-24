// SpacecraftPage.jsx
// This component fetches and displays details of a specific spacecraft
// It uses the spacecraft ID from the URL parameters to fetch data from the API
// It handles loading states and error messages
// It also displays the spacecraft's name, image, capacity, and description

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SpaceTravelApi from "../services/SpaceTravelApi";
import styles from "./SpacecraftPage.module.css"; // Make sure to import styles

const SpacecraftPage = () => {
  const { id } = useParams(); // Get spacecraft ID from the URL
  const [spacecraft, setSpacecraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    SpaceTravelApi.getSpacecraftById({ id })
      .then((response) => {
        if (response.isError) {
          setError("Failed to fetch spacecraft details.");
        } else {
          setSpacecraft(response.data);
        }
      })
      .catch(() => setError("Error fetching spacecraft data"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!spacecraft) return <div>Spacecraft not found.</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.spacecraftName}>{spacecraft.name}</h2>
      <img
        src={spacecraft.pictureUrl || "/images/default-ship.png"}
        alt={`Icon of ${spacecraft.name}`}
        className={styles.spacecraftImage}
      />
      <p>
        <strong>Capacity:</strong> {spacecraft.capacity}
      </p>
      <p>
        <strong>Description:</strong>{" "}
        {spacecraft.description || "No description available."}
      </p>
      {/* Removed currentLocation from here */}
    </div>
  );
};

export default SpacecraftPage;

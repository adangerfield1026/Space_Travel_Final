// PlanetsPage.jsx
// This component fetches and displays planets and stationed spacecrafts
// It allows users to select a destination for each spacecraft and dispatch them
// It also handles loading states and error messages for each spacecraft

import React, { useEffect, useState, useMemo } from "react";
import SpaceTravelApi from "../services/SpaceTravelApi";
import Loading from "../components/Loading";
import styles from "./PlanetsPage.module.css";

const PlanetsPage = () => {
  const [planets, setPlanets] = useState([]); // Initialize planets state
  const [spacecrafts, setSpacecrafts] = useState([]); // Initialize spacecrafts state
  // Initialize selectedTargets state to track selected destinations for each spacecraft
  const [selectedTargets, setSelectedTargets] = useState({});
  const [dispatching, setDispatching] = useState({}); // track dispatching state per spacecraft
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({}); // Store errors per spacecraft

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setErrors({}); // Reset errors before fetching data
    try {
      const [planetRes, spacecraftRes] = await Promise.all([
        SpaceTravelApi.getPlanets(),
        SpaceTravelApi.getSpacecrafts(),
      ]);

      if (!planetRes.isError && !spacecraftRes.isError) {
        // Check if both API calls were successful
        // Set planets and spacecrafts state with the fetched data
        setPlanets(planetRes.data);
        setSpacecrafts(spacecraftRes.data);
      } else {
        setErrors({ global: "Failed to fetch data. Please try again later." });
      }
    } catch (err) {
      setErrors({ global: "An error occurred while fetching data." });
    }
    setLoading(false);
  };

  const handleDispatch = async (spacecraftId, currentLocation) => {
    // Function to handle dispatching a spacecraft to a selected planet
    // Check if the spacecraftId is valid
    const targetPlanetId = selectedTargets[spacecraftId];

    // Reset any previous error for this spacecraft
    setErrors((prevErrors) => ({
      ...prevErrors,
      [spacecraftId]: "", // Clear the error for this spacecraft
    }));
    // Validate the target planet ID
    // Check if the target planet ID is valid and not the same as the current location
    if (targetPlanetId == null || isNaN(targetPlanetId)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [spacecraftId]: "Please select a destination planet.",
      }));
      return;
    }

    if (targetPlanetId === currentLocation) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [spacecraftId]: "Cannot dispatch to the same planet!",
      }));
      return;
    }
    // Check if the spacecraft is already being dispatched
    setDispatching((prev) => ({ ...prev, [spacecraftId]: true }));

    try {
      const dispatchResult = await SpaceTravelApi.sendSpacecraftToPlanet({
        spacecraftId,
        targetPlanetId,
      }); // Dispatch the spacecraft to the selected planet
      // Check if the dispatch was successful

      if (!dispatchResult.isError) {
        setSpacecrafts(
          (
            prevSpacecrafts // Update the spacecrafts state
          ) =>
            prevSpacecrafts.map(
              (
                sc // Update the current location of the spacecraft
              ) =>
                // Check if the spacecraft ID matches the dispatched spacecraft
                // If it does, update its current location to the target planet ID
                sc.id === spacecraftId
                  ? { ...sc, currentLocation: targetPlanetId } //
                  : sc
            )
        );

        const updatedPlanets = await SpaceTravelApi.getPlanets();
        if (!updatedPlanets.isError) {
          setPlanets(updatedPlanets.data);
        }

        setSelectedTargets((prev) => {
          const updated = { ...prev };
          delete updated[spacecraftId]; // Remove the spacecraft from selected targets
          return updated;
        });
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [spacecraftId]: "Failed to dispatch spacecraft. Please try again.",
        }));
      }
    } catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [spacecraftId]: "Error while dispatching spacecraft.",
      }));
    }

    setDispatching((prev) => ({ ...prev, [spacecraftId]: false })); // Reset dispatching state for the spacecraft
  };

  const stationedSpacecrafts = useMemo(
    () =>
      planets.map((planet) => ({
        ...planet,
        stationed: spacecrafts.filter((sc) => sc.currentLocation === planet.id),
      })),
    [planets, spacecrafts]
  );

  if (loading) {
    return <Loading />; // Show loading spinner while data is being fetched
  }

  return (
    // Render the planets and stationed spacecrafts
    <div className={styles.container}>
      <h2>Planets & Stationed Spacecraft</h2>
      {stationedSpacecrafts.length === 0 ? (
        <p className={styles.empty}>No planets or spacecrafts available.</p> // Show message if no planets or spacecrafts are available
      ) : (
        // Map through the stationed spacecrafts and render their details
        stationedSpacecrafts.map((planet) => (
          <div key={planet.id} className={styles.planetSection}>
            <h3 className={styles.planetHeader}>
              {planet.name}
              {planet.pictureUrl && ( // Check if pictureUrl exists
                // If pictureUrl is an array, use the first image; otherwise, use the single image
                <img
                  src={
                    Array.isArray(planet.pictureUrl) // Check if pictureUrl is an array
                      ? planet.pictureUrl[0]
                      : planet.pictureUrl
                  }
                  alt={`Image of ${planet.name}`}
                  className={styles.planetImage}
                />
              )}
            </h3>

            <p className={styles.planetPopulation}>
              Population: {planet.currentPopulation.toLocaleString()}
            </p>

            {planet.stationed.length === 0 ? (
              <p className={styles.empty}>No spacecraft stationed here.</p>
            ) : (
              <ul className={styles.spacecraftList}>
                {planet.stationed.map((sc) => (
                  <li key={sc.id} className={styles.spacecraftItem}>
                    <div className={styles.spacecraftDetails}>
                      <img
                        src={sc.pictureUrl || "/images/default-ship.png"} // Default image if pictureUrl is not available
                        alt={`Icon of ${sc.name}`}
                        className={styles.spacecraftImage}
                      />
                      <span className={styles.spacecraftName}>{sc.name}</span>
                      <span className={styles.spacecraftCapacity}>
                        Capacity: {sc.capacity}
                      </span>
                    </div>
                    <div className={styles.selectContainer}>
                      <select
                        aria-label={`Select destination for ${sc.name}`}
                        value={selectedTargets[sc.id] ?? ""} // Use this operator to handle undefined values
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedTargets({
                            ...selectedTargets,
                            [sc.id]: value ? parseInt(value) : null, // Parse the value to an number or set it to null
                          });
                        }}
                      >
                        <option value="">Select destination</option>
                        {planets
                          .filter((p) => p.id !== planet.id) // Exclude the current planet from the options
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                      </select>
                      <button
                        className={styles.dispatchButton}
                        onClick={() => handleDispatch(sc.id, planet.id)}
                        disabled={dispatching[sc.id]}
                        aria-label={`Dispatch ${sc.name} to selected destination`}
                      >
                        {dispatching[sc.id] ? (
                          // Show loading spinner while dispatching
                          <>
                            Dispatching
                            <span className={styles.spinner} />
                          </>
                        ) : (
                          "Dispatch"
                        )}
                      </button>
                    </div>

                    {errors[sc.id] && ( // Show error message if there is an error for this spacecraft
                      <div className={styles.dispatchError}>
                        {errors[sc.id]}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PlanetsPage;

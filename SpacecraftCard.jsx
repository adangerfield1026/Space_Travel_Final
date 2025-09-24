// SpacecraftCard.jsx
// This component displays a card for each spacecraft and is used by the SpacecraftsPage component
// It includes the spacecraft name, capacity, current location, and a delete button
import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./SpacecraftCard.module.css";

const SpacecraftCard = ({ spacecraft, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/spacecrafts/${spacecraft.id}`); // Navigate to spacecraft details page
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation(); // Prevent triggering the card click
    if (onDelete) onDelete(spacecraft.id); // Call onDelete when delete button is clicked
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.header}>
        <h3 className={styles.name}>{spacecraft.name}</h3>
      </div>
      <img
        src={spacecraft.pictureUrl || "/images/default-ship.png"}
        alt={`Icon of ${spacecraft.name}`}
        className={styles.icon}
      />
      <p className={styles.capacity}>Capacity: {spacecraft.capacity}</p>

      {/* Display current location */}
      <p className={styles.location}>
        <strong>Current Location:</strong> {spacecraft.currentLocation}
      </p>

      <div className={styles.actions}>
        {onDelete && (
          <button
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={handleDeleteClick}
            aria-label={`Delete ${spacecraft.name}`}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

SpacecraftCard.propTypes = {
  spacecraft: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    pictureUrl: PropTypes.string,
    currentLocation: PropTypes.string, // Planet name, not ID
  }).isRequired,
  onDelete: PropTypes.func,
};

export default SpacecraftCard;

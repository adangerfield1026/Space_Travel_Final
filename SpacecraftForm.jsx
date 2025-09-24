// SpacecraftForm.jsx
// This component allows users to create a new spacecraft
// It includes a form with fields for name, capacity, description, and icon selection
// It validates the input and submits the data to the context API
// It also handles image selection for the spacecraft icon

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpacecraft } from "../context/SpacecraftContext";
import styles from "./SpacecraftForm.module.css";

const SpacecraftForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    description: "",
    selectedImage: "/images/icon1.png", // Default selected image
  });

  const { addSpacecraft } = useSpacecraft(); // Use the addSpacecraft from context
  const navigate = useNavigate();

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "capacity" && value < 1) return; // Prevent invalid capacity value

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle icon click to select image
  const handleImageClick = (imageUrl) => {
    setFormData({
      ...formData,
      selectedImage: imageUrl,
    });
  };

  // Validate form before submission
  const validateForm = () => {
    const { name, capacity, description, selectedImage } = formData;
    return name && capacity > 0 && description && selectedImage;
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check
    if (!validateForm()) {
      alert("Please fill out all fields correctly!");
      return;
    }

    const { name, capacity, description, selectedImage } = formData;
    const newSpacecraft = {
      name,
      capacity: parseInt(capacity),
      description,
      pictureUrl: selectedImage,
      currentLocation: null, // Assuming null for location initially, modify as needed
    };

    try {
      await addSpacecraft(newSpacecraft); // Add spacecraft through context
      alert("Spacecraft created successfully!");
      navigate("/spacecrafts"); // Redirect to spacecrafts page
    } catch (err) {
      alert("Error processing spacecraft: " + err.message); // Show error if any
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Create New Spacecraft</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Name Field */}
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        {/* Capacity Field */}
        <div className={styles.formGroup}>
          <label htmlFor="capacity">Capacity</label>
          <input
            id="capacity"
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            min="1" // Ensure capacity is positive
            className={styles.input}
          />
        </div>

        {/* Description Field */}
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        {/* Select Spacecraft Icon */}
        <div className={styles.formGroup}>
          <label>Select Spacecraft Icon</label>
          <div className={styles.iconSelectGroup}>
            {[
              "/images/icon1.png",
              "/images/icon2.png",
              "/images/icon3.png",
            ].map((url) => (
              <div
                key={url}
                className={`${styles.iconOption} ${
                  formData.selectedImage === url ? styles.selectedIcon : ""
                }`}
                onClick={() => handleImageClick(url)}
              >
                <img src={url} alt={`Icon ${url}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            Create Spacecraft
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpacecraftForm;

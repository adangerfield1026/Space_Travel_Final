// This file contains the HomePage component, which serves as the landing page for the application
// It provides an introduction to the app and links to manage spacecraft and explore planets

import React from "react";
import { Link } from "react-router-dom"; // Importing Link from react-router-dom for navigation
import styles from "./HomePage.module.css";

const HomePage = () => {
  // This component serves as the landing page for the application
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome, Commander</h1>
        <p className={styles.subTitle}>
          The fate of humanity is in your hands. Let's get to work.
        </p>
      </div>
      <div className={styles.intro}>
        <p className={styles.paragraph}>
          Your mission: evacuate Earth and set up humanity on new planets.
          Manage spacecraft, explore new worlds, and lead the way.
        </p>
        <div className={styles.actionButtons}>
          <Link to="/spacecrafts" className={styles.button}>
            Manage Spacecraft
          </Link>
          <Link to="/planets" className={styles.button}>
            Explore Planets
          </Link>
        </div>
      </div>
      <div className={styles.details}>
        {" "}
        <p className={styles.paragraph}>
          Ready to make the call? Assign spacecraft, plan missions, and shape
          the future of humanity.
        </p>
      </div>
    </div>
  );
};

export default HomePage;

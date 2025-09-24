// src/components/Loading.jsx
// This component displays a loading spinner and a loading message
import React from "react";
import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div
      className={styles.loadingContainer}
      aria-live="polite" // Announce loading state to screen readers
      aria-busy="true"
    >
      <div className={styles.loader}></div>
      <p className={styles.loadingText}>Loading...</p>
    </div>
  );
};

export default Loading;

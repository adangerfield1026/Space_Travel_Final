// This is a React component for a 404 Not Found page.
// It displays a message indicating that the requested page was not found and provides a link to return to the home page.

import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>404</h1>
      <p className={styles.message}>
        Oops! The page you're looking for has drifted into a black hole.
      </p>
      <Link to="/" className={styles.homeLink}>
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;

// src/components/Navbar.jsx
// This component contains the navigation bar for the application
// It includes links to different pages and a hamburger menu for mobile view.
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage the open/close state of the menu

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo Section */}
      <div className={styles.logo}>
        <NavLink to="/" onClick={closeMenu}>
          🚀 Space Travel
        </NavLink>
      </div>

      {/* Navbar Links */}
      <ul className={`${styles.navList} ${isOpen ? styles.open : ""}`}>
        <li className={styles.navItem}>
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? styles.active : styles.navLink
            }
          >
            Home
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/spacecrafts"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? styles.active : styles.navLink
            }
          >
            Spacecrafts
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/construct"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? styles.active : styles.navLink
            }
          >
            Build Spacecraft
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/planets"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? styles.active : styles.navLink
            }
          >
            Planets
          </NavLink>
        </li>
      </ul>

      {/* Hamburger Icon, add animation later */}
      <div
        className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}
        onClick={toggleMenu}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  );
};

export default Navbar;

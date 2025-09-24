// App.jsx
// This is the main entry point of the application
// It sets up the routing and provides the context for managing spacecraft data
// It also includes the Navbar component for navigation
import React from "react";
import { BrowserRouter } from "react-router-dom"; // Importing BrowserRouter for routing
import AppRoutes from "./routes/AppRoutes.jsx";
import Navbar from "./components/Navbar"; // Import the Navbar component
import styles from "./App.module.css";
import { SpacecraftProvider } from "./context/SpacecraftContext";

function App() {
  return (
    //BrowserRouter must wrap the entire app to enable routing
    // SpacecraftProvider is used to provide the context for managing spacecraft data
    <div className={styles.app}>
      <BrowserRouter>
        <SpacecraftProvider>
          <Navbar />
          <AppRoutes />
        </SpacecraftProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useNavigate, Link } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import config from "../config";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "./components/home-page/HomePage";
import LoginPage from "./components/login&signup/login/LoginPage";
import SignUpPage from "./components/login&signup/signup/SignUpPage";
import MentorProfile from "./components/mentor/mentor-profile/MentorProfile";
import MenteeProfile from "./components/mentee/mentee-profile/MenteeProfile";
import MentorDashboard from "./components/mentor/mentor-dashboard/MentorDashboard";
import MenteeDashboard from "./components/mentee/mentee-dashboard/MenteeDashboard";
import Match from "./components/mentor-matching/Match";
import Notes from "./components/notes/Notes";
import theme from "../theme";

function App() {
  const [user, setUser] = useState(() => {
    // Retrieve the user data from storage or set it to null if not found
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    // Save the user data to storage whenever the user state changes
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const handleSignout = async () => {
    try {
      setLoading(false);
      const response = await fetch(`${config.apiBaseUrl}/users/signout`, {
        method: "POST",
        credentials: "include", // This ensures the session cookie is sent
      });

      if (response.ok) {
        updateUser(null); // Clear the user state
        localStorage.removeItem("user"); // Clear the local storage
        navigate("/login"); // Redirect to the login page
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
      setLoading(false);
    } catch (error) {
      console.error("Sign out error:", error);
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <UserContext.Provider value={{ user, updateUser, handleSignout }}>
          {loading ? (
            <div className="loading-container">
              <CircularProgress />
            </div>
          ) : (
            <Router>
              <Routes>
                <Route path="/" element={user ? <HomePage /> : <LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route
                  path="/mentor-profile"
                  element={
                    <ProtectedRoute>
                      <MentorProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mentee-profile"
                  element={
                    <ProtectedRoute>
                      <MenteeProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mentor-dashboard"
                  element={
                    <ProtectedRoute>
                      <MentorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mentee-dashboard"
                  element={
                    <ProtectedRoute>
                      <MenteeDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/matching"
                  element={
                    <ProtectedRoute>
                      <Match />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/public-mentor-profile"
                  element={
                    <ProtectedRoute>
                      <MentorProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notes"
                  element={
                    <ProtectedRoute>
                      <Notes />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          )}
        </UserContext.Provider>
      </div>
    </ThemeProvider>
  );
}

export default App;

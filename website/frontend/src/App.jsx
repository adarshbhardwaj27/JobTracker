import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Dashboard from "./components/Dashboard";

const App = () => {
  const isAuthenticated = () => localStorage.getItem("user-info") !== null;
  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="452932457643-j0i8hamdpuc46omg59gg572097ic8t8b.apps.googleusercontent.com">
        <LoginPage />
      </GoogleOAuthProvider>
    );
  };
  const PrivateRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" />;
  };
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<GoogleAuthWrapper />} />
        <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;

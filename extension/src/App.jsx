import React from "react";
import "./App.css";
import Home from "./components/Home";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [authState, setAuthState] = useState(null);

  // Listen for changes in chrome storage on mount
  useEffect(() => {
    // Check initial auth state when popup opens
    chrome.storage.sync.get(["authState"], (result) => {
      if (result.authState) {
        setAuthState(result.authState);
      }
    });

    // Listen for changes in authState in chrome storage
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync" && changes.authState) {
        setAuthState(changes.authState.newValue); // Update the state when authState changes
      }
    });

    // Clean up listener when the component unmounts
    return () => {
      chrome.storage.onChanged.removeListener();
    };
  }, []);

  const getLoginStatusMessage = () => {
    if (authState === "loggedIn") {
      return "You are logged in!";
    } else if (authState === "loggedOut") {
      return "You are logged out.";
    } else {
      return "Loading...";
    }
  };

  const PrivateRoute = ({ element }) => {
    return authState === "loggedIn"
      ? element
      : (window.location.href = "http://localhost:5173/login");
  };

  return (
    <>
      <div className="content">
        <h1 className="text-xl text-green-400" id="check">
          {getLoginStatusMessage()}
        </h1>
        <br />

        <PrivateRoute element={<Home />} />
      </div>
    </>
  );
}

export default App;

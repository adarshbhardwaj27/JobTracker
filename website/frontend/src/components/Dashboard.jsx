import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthStateInChromeStorage } from "../api";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);
    setUserInfo(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user-info");
    setAuthStateInChromeStorage("loggedOut");
    navigate("/login");
  };

  return (
    <>
      <h1>Welcome {userInfo?.name}</h1>
      <h3>{userInfo?.email}</h3>
      <img src={userInfo?.image} alt={userInfo?.name} />
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Dashboard;

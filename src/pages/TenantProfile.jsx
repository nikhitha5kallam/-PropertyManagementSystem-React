
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TenantProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const loggedInUser = users.find(
      (item) => item.email === currentUser
    );

    setUser(loggedInUser || null);
  }, []);

  return (
    <div className="admin-section">
      <h2>My Profile 👤</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/tenant")}
      >
        Back to Dashboard
      </button>

      {!user ? (
        <p>Profile details not found. Please login again.</p>
      ) : (
        <div className="property-card">
          <h3>Personal Information</h3>

          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
          <p><strong>Address:</strong> {user.address || "Not provided"}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
    </div>
  );
}

export default TenantProfile;

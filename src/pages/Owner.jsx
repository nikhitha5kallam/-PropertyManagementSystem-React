
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Owner() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    const allProperties =
      JSON.parse(localStorage.getItem("properties")) || [];

    const ownerProperties = allProperties.filter(
      (property) => property.ownerEmail === currentUser
    );

    setProperties(ownerProperties);
  }, []);

  const pending = properties.filter(
    (property) => property.status === "Pending"
  ).length;

  const approved = properties.filter(
    (property) => property.status === "Approved"
  ).length;

  const rejected = properties.filter(
    (property) => property.status === "Rejected"
  ).length;

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div>
      <nav className="dashboard-navbar">
        <h2>🏠 Property Owner Dashboard</h2>

        <button
          className="admin-action-button"
          onClick={logout}
        >
          Logout
        </button>
      </nav>

      <div className="dashboard-welcome">
        <h2>Welcome, Property Owner!</h2>
        <p>Manage your properties easily.</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Properties</h3>
          <p>{properties.length}</p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>

        <div className="stat-card">
          <h3>Approved</h3>
          <p>{approved}</p>
        </div>

        <div className="stat-card">
          <h3>Rejected</h3>
          <p>{rejected}</p>
        </div>
      </div>

      <div className="admin-section">
        <h2>Property Management</h2>

        <button
          className="admin-action-button"
          onClick={() => navigate("/owner/post-property")}
        >
          + Post New Property
        </button>

        <button
          className="admin-action-button"
          onClick={() => navigate("/owner/my-properties")}
        >
          My Properties
        </button>

        <button
          className="admin-action-button"
          onClick={() => navigate("/owner/applications")}
        >
          Tenant Applications
        </button>
      </div>
    </div>
  );
}

export default Owner;

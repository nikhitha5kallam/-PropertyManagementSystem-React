
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Tenant() {
  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [rentals, setRentals] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const allProperties =
      JSON.parse(localStorage.getItem("properties")) || [];

    const approvedProperties = allProperties.filter(
      (property) => property.status === "Approved"
    );

    setProperties(approvedProperties);

    setSavedProperties(
      JSON.parse(localStorage.getItem("savedProperties")) || []
    );

    const currentUser = localStorage.getItem("currentUser");

    const allRentals =
      JSON.parse(localStorage.getItem("rentals")) || [];

    setRentals(
      allRentals.filter(
        (rental) =>
          rental.tenantEmail === currentUser &&
          rental.status === "Active"
      )
    );
  }, []);

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div>
      <nav className="dashboard-navbar">
        <h2>🏠 Tenant Dashboard</h2>

        <button
          className="admin-action-button"
          onClick={logout}
        >
          Logout
        </button>
      </nav>

      <div className="dashboard-welcome">
        <h2>Welcome, Tenant!</h2>
        <p>Find your perfect home with us.</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Available Properties</h3>
          <p>{properties.length}</p>
        </div>

        <div className="stat-card">
          <h3>Saved Properties</h3>
          <p>
            {
              savedProperties.filter(
                (item) => item.tenantEmail ===
                  localStorage.getItem("currentUser")
              ).length
            }
          </p>
        </div>

        <div className="stat-card">
          <h3>My Rentals</h3>
          <p>{rentals.length}</p>
        </div>
      </div>

      <div className="admin-section">
        <h2>Property Management</h2>

        <button
          className="admin-action-button"
          onClick={() => navigate("/tenant/properties")}
        >
          Browse Properties
        </button>

        <button
          className="admin-action-button"
          onClick={() => navigate("/tenant/saved")}
        >
          Saved Properties
        </button>

        <button
          className="admin-action-button"
          onClick={() => navigate("/tenant/my-rentals")}
        >
          My Rentals
        </button>

        <button
          className="admin-action-button"
          onClick={() => navigate("/tenant/profile")}
        >
          My Profile
        </button>
      </div>
    </div>
  );
}

export default Tenant;

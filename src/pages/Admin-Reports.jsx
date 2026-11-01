
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminReports() {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    const storedProperties =
      JSON.parse(localStorage.getItem("properties")) || [];

    setUsers(storedUsers);
    setProperties(storedProperties);
  }, []);

  const totalTenants = users.filter(
    (user) => user.role === "tenant"
  ).length;

  const totalOwners = users.filter(
    (user) =>
      user.role === "owner" ||
      user.role === "property-owner"
  ).length;

  const pending = properties.filter(
    (property) => property.status === "Pending"
  ).length;

  const approved = properties.filter(
    (property) => property.status === "Approved"
  ).length;

  const rejected = properties.filter(
    (property) => property.status === "Rejected"
  ).length;

  return (
    <div className="admin-section">
      <h2>Admin Reports 📊</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/admin")}
      >
        Back to Dashboard
      </button>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>

        <div className="stat-card">
          <h3>Total Tenants</h3>
          <p>{totalTenants}</p>
        </div>

        <div className="stat-card">
          <h3>Total Owners</h3>
          <p>{totalOwners}</p>
        </div>

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
    </div>
  );
}

export default AdminReports;

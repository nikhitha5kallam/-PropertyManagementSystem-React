
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TenantApplications() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, []);

  // Load applications of logged-in tenant
  function loadApplications() {
    const currentUser = localStorage.getItem("currentUser");

    const allApplications =
      JSON.parse(localStorage.getItem("tenantApplications")) || [];

    const tenantApplications = allApplications.filter(
      (application) => application.tenantEmail === currentUser
    );

    setApplications(tenantApplications);
  }

  // Cancel pending application
  function cancelApplication(id) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this application?"
    );

    if (confirmCancel) {
      const currentUser = localStorage.getItem("currentUser");

      const allApplications =
        JSON.parse(localStorage.getItem("tenantApplications")) || [];

      const updatedApplications = allApplications.map(
        (application) =>
          application.id === id &&
          application.tenantEmail === currentUser &&
          application.status === "Pending"
            ? { ...application, status: "Cancelled" }
            : application
      );

      localStorage.setItem(
        "tenantApplications",
        JSON.stringify(updatedApplications)
      );

      loadApplications();

      alert("Application cancelled successfully!");
    }
  }

  return (
    <div className="admin-section">

      <h2>📋 My Applications</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/tenant")}
      >
        Back to Dashboard
      </button>

      {applications.length === 0 ? (
        <p>You have not submitted any applications yet.</p>
      ) : (
        <div className="property-list">

          {applications.map((application) => (
            <div className="property-card" key={application.id}>

              <h3>{application.propertyName}</h3>

              <p>📍 Location: {application.propertyLocation}</p>

              <p>💰 Monthly Rent: ₹{application.propertyRent}</p>

              <hr />

              <h3>Application Details</h3>

              <p>Tenant: {application.tenantName}</p>

              <p>Email: {application.tenantEmail}</p>

              <p>Phone: {application.phone}</p>

              <p>Occupation: {application.occupation}</p>

              <p>Monthly Income: ₹{application.monthlyIncome || application.income}</p>

              <p>Move-in Date: {application.moveInDate}</p>

              <p>
                <strong>Status: {application.status}</strong>
              </p>

              {application.status === "Pending" && (
                <button
                  className="admin-action-button"
                  onClick={() => cancelApplication(application.id)}
                >
                  ❌ Cancel Application
                </button>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default TenantApplications;

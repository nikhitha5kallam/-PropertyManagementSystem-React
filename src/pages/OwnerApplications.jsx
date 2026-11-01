import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OwnerApplications() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const currentUser = localStorage.getItem("currentUser");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    const allApplications =
      JSON.parse(localStorage.getItem("tenantApplications")) || [];

    const ownerApplications = allApplications.filter(
      (application) => application.ownerEmail === currentUser
    );

    setApplications(ownerApplications);
  };

  // Accept Application
  const acceptApplication = (application) => {
    const allApplications =
      JSON.parse(localStorage.getItem("tenantApplications")) || [];

    const updatedApplications = allApplications.map((item) =>
      item.id === application.id
        ? { ...item, status: "Accepted" }
        : item
    );

    localStorage.setItem(
      "tenantApplications",
      JSON.stringify(updatedApplications)
    );

    const rentals =
      JSON.parse(localStorage.getItem("rentals")) || [];

    const newRental = {
      id: Date.now(),
      propertyId: application.propertyId,
      propertyName: application.propertyName,
      propertyLocation: application.propertyLocation,
      propertyRent: application.propertyRent,
      ownerEmail: application.ownerEmail,
      tenantEmail: application.tenantEmail,
      tenantName: application.tenantName,
      phone: application.phone,
      status: "Active"
    };

    rentals.push(newRental);

    localStorage.setItem("rentals", JSON.stringify(rentals));

    alert("Tenant application accepted!");

    loadApplications();
  };

  // Reject Application
  const rejectApplication = (applicationId) => {
    const allApplications =
      JSON.parse(localStorage.getItem("tenantApplications")) || [];

    const updatedApplications = allApplications.map((item) =>
      item.id === applicationId
        ? { ...item, status: "Rejected" }
        : item
    );

    localStorage.setItem(
      "tenantApplications",
      JSON.stringify(updatedApplications)
    );

    alert("Tenant application rejected!");

    loadApplications();
  };

  return (
    <div className="admin-section">

      <h2>Tenant Applications 📋</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/owner")}
      >
        Back to Dashboard
      </button>

      {applications.length === 0 ? (
        <p>No tenant applications received yet.</p>
      ) : (
        <div className="property-list">

          {applications.map((application) => (
            <div className="property-card" key={application.id}>

              <h3>{application.propertyName}</h3>

              <p>📍 Location: {application.propertyLocation}</p>
              <p>💰 Monthly Rent: ₹{application.propertyRent}</p>

              <hr />

              <h3>Tenant Details</h3>

              <p>👤 Name: {application.tenantName}</p>
              <p>📧 Email: {application.tenantEmail}</p>
              <p>📞 Phone: {application.phone}</p>

              <hr />

              <h3>Employment & Financial Details</h3>

              <p>💼 Occupation: {application.occupation}</p>
              <p>🏢 Employer: {application.employer}</p>
              <p>💰 Monthly Income: ₹{application.income}</p>

              <hr />

              <h3>Rental Requirements</h3>

              <p>📅 Expected Duration: {application.duration}</p>
              <p>👨‍👩‍👧‍👦 Household Members: {application.familyMembers}</p>
              <p>🏠 Expected Move-in Date: {application.moveInDate}</p>

              <hr />

              <h3>Previous Rental Details</h3>

              <p>
                {application.rentalHistory || "Not provided"}
              </p>

              <hr />

              <h3>Additional Information</h3>

              <p>
                {application.additionalInfo || "Not provided"}
              </p>

              <hr />

              <h3>Application Status: {application.status}</h3>

              {application.status === "Pending" && (
                <div>

                  <button
                    className="admin-action-button"
                    onClick={() => acceptApplication(application)}
                  >
                    ✅ Accept
                  </button>

                  <button
                    className="admin-action-button"
                    onClick={() => rejectApplication(application.id)}
                  >
                    ❌ Reject
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default OwnerApplications;
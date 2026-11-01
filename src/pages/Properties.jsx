import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Properties() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allProperties =
      JSON.parse(localStorage.getItem("properties")) || [];

    const approvedProperties = allProperties.filter(
      (property) => property.status === "Approved"
    );

    setProperties(approvedProperties);
  }, []);

  // Save Property
  const saveProperty = (propertyId) => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const saved =
      JSON.parse(localStorage.getItem("savedProperties")) || [];

    const alreadySaved = saved.some(
      (item) =>
        item.propertyId === propertyId &&
        item.tenantEmail === currentUser
    );

    if (alreadySaved) {
      alert("Property is already saved!");
      return;
    }

    saved.push({
      propertyId: propertyId,
      tenantEmail: currentUser
    });

    localStorage.setItem(
      "savedProperties",
      JSON.stringify(saved)
    );

    alert("Property saved successfully!");
  };

  // Apply for Property
  const applyProperty = (property) => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const applications =
      JSON.parse(localStorage.getItem("tenantApplications")) || [];

    const alreadyApplied = applications.some(
      (application) =>
        application.propertyId === property.id &&
        application.tenantEmail === currentUser &&
        application.status !== "Rejected"
    );

    if (alreadyApplied) {
      alert("You have already applied for this property!");
      return;
    }

    // Open Tenant Application Form
    navigate("/tenant/apply", {
      state: { property: property }
    });
  };

  return (
    <div className="admin-section">
      <h2>Available Properties 🏠</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/tenant")}
      >
        Back to Dashboard
      </button>

      {properties.length === 0 ? (
        <p>No approved properties available currently.</p>
      ) : (
        <div className="property-list">
          {properties.map((property) => (
            <div className="property-card" key={property.id}>

              {property.photo && (
                <img
                  src={property.photo}
                  alt={property.propertyName}
                  width="250"
                />
              )}

              <h3>{property.propertyName}</h3>

              <p>📍 Location: {property.location}</p>
              <p>🏠 Type: {property.propertyType}</p>

              <p>
                📐 Area: {property.area} {property.areaUnit}
              </p>

              <p>🛏️ Bedrooms: {property.bedrooms}</p>
              <p>🚿 Bathrooms: {property.bathrooms}</p>
              <p>💰 Rent: ₹{property.rent} / month</p>

              <p>{property.description}</p>

              <button
                className="admin-action-button"
                onClick={() => saveProperty(property.id)}
              >
                ❤️ Save Property
              </button>

              <button
                className="admin-action-button"
                onClick={() => applyProperty(property)}
              >
                Apply for Property
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Properties;
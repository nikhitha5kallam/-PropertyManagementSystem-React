
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SavedProperties() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = () => {
    const currentUser = localStorage.getItem("currentUser");

    const saved =
      JSON.parse(localStorage.getItem("savedProperties")) || [];

    const allProperties =
      JSON.parse(localStorage.getItem("properties")) || [];

    const tenantSaved = saved.filter(
      (item) => item.tenantEmail === currentUser
    );

    const savedIds = tenantSaved.map(
      (item) => item.propertyId
    );

    const savedList = allProperties.filter(
      (property) =>
        savedIds.includes(property.id) &&
        property.status === "Approved"
    );

    setProperties(savedList);
  };

  const removeSavedProperty = (propertyId) => {
    const currentUser = localStorage.getItem("currentUser");

    const saved =
      JSON.parse(localStorage.getItem("savedProperties")) || [];

    const updatedSaved = saved.filter(
      (item) =>
        !(
          item.propertyId === propertyId &&
          item.tenantEmail === currentUser
        )
    );

    localStorage.setItem(
      "savedProperties",
      JSON.stringify(updatedSaved)
    );

    loadSavedProperties();

    alert("Property removed from saved list!");
  };

  return (
    <div className="admin-section">
      <h2>My Saved Properties ❤️</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/tenant")}
      >
        Back to Dashboard
      </button>

      {properties.length === 0 ? (
        <p>No saved properties found.</p>
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

              <p>📍 {property.location}</p>
              <p>🏠 Type: {property.propertyType}</p>
              <p>💰 Rent: ₹{property.rent} / month</p>
              <p>🛏️ Bedrooms: {property.bedrooms}</p>
              <p>🚿 Bathrooms: {property.bathrooms}</p>

              <p>{property.description}</p>

              <button
                className="admin-action-button"
                onClick={() =>
                  removeSavedProperty(property.id)
                }
              >
                Remove from Saved
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedProperties;

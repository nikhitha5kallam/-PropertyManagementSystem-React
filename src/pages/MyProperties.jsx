
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyProperties() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = () => {
    const currentUser = localStorage.getItem("currentUser");

    const allProperties =
      JSON.parse(localStorage.getItem("properties")) || [];

    const ownerProperties = allProperties.filter(
      (property) => property.ownerEmail === currentUser
    );

    setProperties(ownerProperties);
  };

  const deleteProperty = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (confirmDelete) {
      const allProperties =
        JSON.parse(localStorage.getItem("properties")) || [];

      const updatedProperties = allProperties.filter(
        (property) => property.id !== id
      );

      localStorage.setItem(
        "properties",
        JSON.stringify(updatedProperties)
      );

      loadProperties();
      alert("Property deleted successfully!");
    }
  };

  return (
    <div className="admin-section">
      <h2>My Properties 🏠</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/owner")}
      >
        Back to Dashboard
      </button>

      <button
        className="admin-action-button"
        onClick={() => navigate("/owner/post-property")}
      >
        + Post New Property
      </button>

      {properties.length === 0 ? (
        <p>You have not posted any properties yet.</p>
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

              <p>
                <strong>Status: {property.status}</strong>
              </p>

              <button
                className="admin-action-button"
                onClick={() => deleteProperty(property.id)}
              >
                Delete Property
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProperties;

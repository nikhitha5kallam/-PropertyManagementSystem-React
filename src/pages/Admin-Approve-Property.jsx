
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminApproveProperty() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedProperties =
      JSON.parse(localStorage.getItem("properties")) || [];

    const approvedProperties = storedProperties.filter(
      (property) => property.status === "Approved"
    );

    setProperties(approvedProperties);
  }, []);

  return (
    <div className="admin-section">
      <h2>Approved Properties</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/admin")}
      >
        Back to Dashboard
      </button>

      {properties.length === 0 ? (
        <p>No approved properties available.</p>
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

              <p>
                <strong>Status: Approved ✅</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminApproveProperty;

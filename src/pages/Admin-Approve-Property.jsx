
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminApproveProperty() {
  const [properties, setProperties] = useState([]);
  const [photoIndexes, setPhotoIndexes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedProperties =
      JSON.parse(localStorage.getItem("properties")) || [];

    const approvedProperties = storedProperties.filter(
      (property) => property.status === "Approved"
    );

    setProperties(approvedProperties);
  }, []);

  // Previous photo
  function previousPhoto(id, totalPhotos) {
    setPhotoIndexes((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) - 1 + totalPhotos) % totalPhotos
    }));
  }

  // Next photo
  function nextPhoto(id, totalPhotos) {
    setPhotoIndexes((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % totalPhotos
    }));
  }

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

          {properties.map((property) => {
            // Support both multiple photos and older single-photo properties
            const photos =
              property.photos && property.photos.length > 0
                ? property.photos
                : property.photo
                  ? [property.photo]
                  : [];

            const currentIndex = photoIndexes[property.id] || 0;

            return (
              <div className="property-card" key={property.id}>

                {/* Property Photo Gallery */}
                {photos.length > 0 && (
                  <div className="property-gallery">

                    <img
                      src={photos[currentIndex]}
                      alt={property.propertyName}
                      className="property-gallery-image"
                    />

                    {photos.length > 1 && (
                      <div className="gallery-controls">

                        <button
                          onClick={() =>
                            previousPhoto(property.id, photos.length)
                          }
                        >
                          ❮ Previous
                        </button>

                        <span>
                          {currentIndex + 1} / {photos.length}
                        </span>

                        <button
                          onClick={() =>
                            nextPhoto(property.id, photos.length)
                          }
                        >
                          Next ❯
                        </button>

                      </div>
                    )}

                  </div>
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
            );
          })}

        </div>
      )}
    </div>
  );
}

export default AdminApproveProperty;

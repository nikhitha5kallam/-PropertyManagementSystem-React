
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SavedProperties() {
  const [savedProperties, setSavedProperties] = useState([]);
  const [photoIndexes, setPhotoIndexes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedProperties();
  }, []);

  // Load saved properties for logged-in tenant
  function loadSavedProperties() {
    const currentUser = localStorage.getItem("currentUser");

    const allSaved =
      JSON.parse(localStorage.getItem("savedProperties")) || [];

    const userSaved = allSaved.filter(
      (item) => item.tenantEmail === currentUser
    );

    // Get latest property details, including all photos
    const allProperties =
      JSON.parse(localStorage.getItem("properties")) || [];

    const updatedSaved = userSaved.map((saved) => {
      const property = allProperties.find(
        (p) => p.id === saved.propertyId
      );

      return property
        ? { ...saved, ...property }
        : saved;
    });

    setSavedProperties(updatedSaved);
  }

  // Previous photo
  function previousPhoto(propertyId, totalPhotos) {
    setPhotoIndexes((prev) => ({
      ...prev,
      [propertyId]:
        ((prev[propertyId] || 0) - 1 + totalPhotos) % totalPhotos
    }));
  }

  // Next photo
  function nextPhoto(propertyId, totalPhotos) {
    setPhotoIndexes((prev) => ({
      ...prev,
      [propertyId]:
        ((prev[propertyId] || 0) + 1) % totalPhotos
    }));
  }

  // Remove saved property
  function removeSavedProperty(id) {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this property from saved properties?"
    );

    if (confirmRemove) {
      const currentUser = localStorage.getItem("currentUser");

      const allSaved =
        JSON.parse(localStorage.getItem("savedProperties")) || [];

      const updatedSaved = allSaved.filter(
        (item) =>
          !(item.propertyId === id &&
            item.tenantEmail === currentUser)
      );

      localStorage.setItem(
        "savedProperties",
        JSON.stringify(updatedSaved)
      );

      setSavedProperties((prev) =>
        prev.filter((item) => item.propertyId !== id)
      );

      alert("Property removed from saved list!");
    }
  }

  return (
    <div className="admin-section">

      <h2>❤️ My Saved Properties</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/tenant")}
      >
        Back to Dashboard
      </button>

      <button
        className="admin-action-button"
        onClick={() => navigate("/tenant/properties")}
      >
        Browse More Properties
      </button>

      {savedProperties.length === 0 ? (
        <p>You have not saved any properties yet.</p>
      ) : (
        <div className="property-list">

          {savedProperties.map((item) => {
            const photos =
              item.photos && item.photos.length > 0
                ? item.photos
                : item.photo
                  ? [item.photo]
                  : [];

            const currentIndex = photoIndexes[item.propertyId] || 0;

            return (
              <div className="property-card" key={item.propertyId}>

                {photos.length > 0 && (
                  <div className="property-gallery">

                    <img
                      src={photos[currentIndex]}
                      alt={item.propertyName}
                      className="property-gallery-image"
                    />

                    {photos.length > 1 && (
                      <div className="gallery-controls">

                        <button
                          onClick={() =>
                            previousPhoto(item.propertyId, photos.length)
                          }
                        >
                          ❮ Previous
                        </button>

                        <span>
                          {currentIndex + 1} / {photos.length}
                        </span>

                        <button
                          onClick={() =>
                            nextPhoto(item.propertyId, photos.length)
                          }
                        >
                          Next ❯
                        </button>

                      </div>
                    )}

                  </div>
                )}

                <h3>{item.propertyName}</h3>

                <p>📍 {item.location}</p>

                <p>🏠 Type: {item.propertyType}</p>

                <p>💰 Rent: ₹{item.rent} / month</p>

                <button
                  className="admin-action-button"
                  onClick={() => removeSavedProperty(item.propertyId)}
                >
                  🗑️ Remove Saved Property
                </button>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default SavedProperties;

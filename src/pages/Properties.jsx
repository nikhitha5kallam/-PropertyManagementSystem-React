
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [photoIndexes, setPhotoIndexes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const allProperties =
      JSON.parse(localStorage.getItem("properties")) || [];

    const approvedProperties = allProperties.filter(
      (property) => property.status === "Approved"
    );

    setProperties(approvedProperties);
  }, []);

  // Show next photo
  const nextPhoto = (propertyId, totalPhotos) => {
    setPhotoIndexes((previous) => ({
      ...previous,
      [propertyId]:
        ((previous[propertyId] || 0) + 1) % totalPhotos
    }));
  };

  // Show previous photo
  const previousPhoto = (propertyId, totalPhotos) => {
    setPhotoIndexes((previous) => ({
      ...previous,
      [propertyId]:
        ((previous[propertyId] || 0) - 1 + totalPhotos) %
        totalPhotos
    }));
  };

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
          {properties.map((property) => {

            // Support new multiple photos and old single photos
            const propertyPhotos =
              property.photos && property.photos.length > 0
                ? property.photos
                : property.photo
                  ? [property.photo]
                  : [];

            const currentIndex = photoIndexes[property.id] || 0;

            return (
              <div className="property-card" key={property.id}>

                {/* Property Photo Gallery */}
                {propertyPhotos.length > 0 && (
                  <div className="property-gallery">

                    <img
                      src={propertyPhotos[currentIndex]}
                      alt={property.propertyName}
                      className="property-gallery-image"
                    />

                    {propertyPhotos.length > 1 && (
                      <div className="gallery-controls">

                        <button
                          type="button"
                          onClick={() =>
                            previousPhoto(
                              property.id,
                              propertyPhotos.length
                            )
                          }
                        >
                          ❮ Previous
                        </button>

                        <span>
                          {currentIndex + 1} / {propertyPhotos.length}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            nextPhoto(
                              property.id,
                              propertyPhotos.length
                            )
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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Properties;

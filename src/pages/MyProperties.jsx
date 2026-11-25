
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [photoIndexes, setPhotoIndexes] = useState({});

  const [formData, setFormData] = useState({
    propertyName: "",
    location: "",
    propertyType: "",
    area: "",
    areaUnit: "",
    rent: "",
    bedrooms: "",
    bathrooms: "",
    description: ""
  });

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

  // Next Photo
  const nextPhoto = (propertyId, totalPhotos) => {
    setPhotoIndexes((previous) => ({
      ...previous,
      [propertyId]:
        ((previous[propertyId] || 0) + 1) % totalPhotos
    }));
  };

  // Previous Photo
  const previousPhoto = (propertyId, totalPhotos) => {
    setPhotoIndexes((previous) => ({
      ...previous,
      [propertyId]:
        ((previous[propertyId] || 0) - 1 + totalPhotos) %
        totalPhotos
    }));
  };

  // Open Edit Form
  const editProperty = (property) => {
    setEditingId(property.id);

    setFormData({
      propertyName: property.propertyName || "",
      location: property.location || "",
      propertyType: property.propertyType || "",
      area: property.area || "",
      areaUnit: property.areaUnit || "",
      rent: property.rent || "",
      bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",
      description: property.description || ""
    });

    window.scrollTo(0, 0);
  };

  // Handle Form Changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Save Updated Property
  const updateProperty = (event) => {
    event.preventDefault();

    const currentUser = localStorage.getItem("currentUser");

    const allProperties =
      JSON.parse(localStorage.getItem("properties")) || [];

    const updatedProperties = allProperties.map((property) => {
      if (
        property.id === editingId &&
        property.ownerEmail === currentUser
      ) {
        return {
          ...property,
          ...formData,
          status: "Pending"
        };
      }

      return property;
    });

    localStorage.setItem(
      "properties",
      JSON.stringify(updatedProperties)
    );

    alert(
      "Property updated successfully! Waiting for Admin approval."
    );

    setEditingId(null);

    setFormData({
      propertyName: "",
      location: "",
      propertyType: "",
      area: "",
      areaUnit: "",
      rent: "",
      bedrooms: "",
      bathrooms: "",
      description: ""
    });

    loadProperties();
  };

  // Cancel Editing
  const cancelEdit = () => {
    setEditingId(null);

    setFormData({
      propertyName: "",
      location: "",
      propertyType: "",
      area: "",
      areaUnit: "",
      rent: "",
      bedrooms: "",
      bathrooms: "",
      description: ""
    });
  };

  // Delete Property
  const deleteProperty = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (confirmDelete) {
      const currentUser = localStorage.getItem("currentUser");

      const allProperties =
        JSON.parse(localStorage.getItem("properties")) || [];

      const updatedProperties = allProperties.filter(
        (property) =>
          !(
            property.id === id &&
            property.ownerEmail === currentUser
          )
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

      {/* Edit Property Form */}
      {editingId !== null && (
        <div className="property-card">
          <h2>✏️ Edit Property</h2>

          <form onSubmit={updateProperty}>
            <input
              type="text"
              name="propertyName"
              placeholder="Property Name"
              value={formData.propertyName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="propertyType"
              placeholder="Property Type"
              value={formData.propertyType}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="area"
              placeholder="Area"
              value={formData.area}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="areaUnit"
              placeholder="Area Unit (sq.ft, sq.yd)"
              value={formData.areaUnit}
              onChange={handleChange}
            />

            <input
              type="number"
              name="rent"
              placeholder="Monthly Rent"
              value={formData.rent}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="bedrooms"
              placeholder="Bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="bathrooms"
              placeholder="Bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Property Description"
              value={formData.description}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="admin-action-button"
            >
              Save Changes
            </button>

            <button
              type="button"
              className="admin-action-button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Property List */}
      {properties.length === 0 ? (
        <p>You have not posted any properties yet.</p>
      ) : (
        <div className="property-list">
          {properties.map((property) => {

            // Support multiple photos and old single photo
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
                  onClick={() => editProperty(property)}
                >
                  ✏️ Edit Property
                </button>

                <button
                  className="admin-action-button"
                  onClick={() => deleteProperty(property.id)}
                >
                  🗑️ Delete Property
                </button>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyProperties;

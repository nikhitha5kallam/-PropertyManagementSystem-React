
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TenantProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  // Load logged-in tenant profile
  function loadProfile() {
    const currentUser = localStorage.getItem("currentUser");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const currentProfile = users.find(
      (user) => user.email === currentUser
    );

    if (currentProfile) {
      setProfile({
        name: currentProfile.name || "",
        email: currentProfile.email || "",
        phone: currentProfile.phone || "",
        address: currentProfile.address || ""
      });
    }
  }

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setProfile({
      ...profile,
      [name]: value
    });
  }

  // Update profile
  function updateProfile(event) {
    event.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((user) =>
      user.email === profile.email
        ? {
            ...user,
            name: profile.name,
            phone: profile.phone,
            address: profile.address
          }
        : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setIsEditing(false);

    alert("Profile updated successfully!");
    loadProfile();
  }

  return (
    <div className="admin-section">

      <h2>👤 My Profile</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/tenant")}
      >
        Back to Dashboard
      </button>

      {isEditing ? (

        <form onSubmit={updateProfile} className="property-card">

          <h3>✏️ Edit Profile</h3>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={profile.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            value={profile.email}
            readOnly
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={profile.phone}
            onChange={handleChange}
            required
          />

          <textarea
            name="address"
            placeholder="Address"
            value={profile.address}
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
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>

        </form>

      ) : (

        <div className="property-card">

          <h3>{profile.name}</h3>

          <p>📧 Email: {profile.email}</p>

          <p>📞 Phone: {profile.phone}</p>

          <p>📍 Address: {profile.address || "Not provided"}</p>

          <button
            className="admin-action-button"
            onClick={() => setIsEditing(true)}
          >
            ✏️ Edit Profile
          </button>

        </div>

      )}

    </div>
  );
}

export default TenantProfile;

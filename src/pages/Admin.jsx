
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    propertyName: "",
    location: "",
    rent: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    status: "Pending"
  });

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setUsers(JSON.parse(localStorage.getItem("users")) || []);
    setProperties(JSON.parse(localStorage.getItem("properties")) || []);
  }

  const pendingProperties = properties.filter(
    (property) => property.status === "Pending"
  );

  const approvedProperties = properties.filter(
    (property) => property.status === "Approved"
  );

  const tenants = users.filter((user) => user.role === "tenant");
  const owners = users.filter((user) => user.role === "owner");

  // Open Edit Form
  function editProperty(property) {
    setEditingId(property.id);

    setFormData({
      propertyName: property.propertyName || "",
      location: property.location || "",
      rent: property.rent || "",
      propertyType: property.propertyType || "",
      bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",
      status: property.status || "Pending"
    });

    window.scrollTo(0, 0);
  }

  // Handle Form Changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  // Save Updated Property
  function updateProperty(event) {
    event.preventDefault();

    const allProperties =
      JSON.parse(localStorage.getItem("properties")) || [];

    const updatedProperties = allProperties.map((property) =>
      property.id === editingId
        ? { ...property, ...formData }
        : property
    );

    localStorage.setItem(
      "properties",
      JSON.stringify(updatedProperties)
    );

    setProperties(updatedProperties);
    setEditingId(null);

    alert("Property updated successfully!");

  }

  // Delete Property
  function deleteProperty(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (confirmDelete) {
      const updatedProperties = properties.filter(
        (property) => property.id !== id
      );

      localStorage.setItem(
        "properties",
        JSON.stringify(updatedProperties)
      );

      setProperties(updatedProperties);

      alert("Property deleted successfully!");
    }
  }

  // Cancel Edit
  function cancelEdit() {
    setEditingId(null);
  }

  function logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    alert("Admin Logged Out!");
    navigate("/login");
  }

  return (
    <div className="admin-dashboard">

      <header className="dashboard-navbar">
        <h2>🏠 Property Management System</h2>
        <div>
          <span>Admin Dashboard</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="dashboard-welcome">
        <h1>Welcome, Admin!</h1>
        <p>Manage users and monitor property listings.</p>
      </section>

      <button
        onClick={() => navigate("/admin/pending-properties")}
        className="admin-action-button"
      >
        Review Pending Properties
      </button>

      <button
        className="admin-action-button"
        onClick={() => navigate("/admin/approved-properties")}
      >
        View Approved Properties
      </button>

      <button
        className="admin-action-button"
        onClick={() => navigate("/admin/users")}
      >
        Manage Users
      </button>

      <section className="admin-stats">

        <div className="stat-card">
          <h3>Total Users</h3>
          <h1>{users.length}</h1>
        </div>

        <div className="stat-card">
          <h3>Total Tenants</h3>
          <h1>{tenants.length}</h1>
        </div>

        <div className="stat-card">
          <h3>Total Owners</h3>
          <h1>{owners.length}</h1>
        </div>

        <div className="stat-card">
          <h3>Total Properties</h3>
          <h1>{properties.length}</h1>
        </div>

        <div className="stat-card">
          <h3>Pending Properties</h3>
          <h1>{pendingProperties.length}</h1>
        </div>

        <div className="stat-card">
          <h3>Approved Properties</h3>
          <h1>{approvedProperties.length}</h1>
        </div>

      </section>

      {/* User Management */}
      <section className="admin-section">
        <h2>User Management</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4">No registered users found.</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Edit Property Form */}
      {editingId !== null && (
        <section className="admin-section">
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
            />

            <input
              type="number"
              name="bathrooms"
              placeholder="Bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              type="submit"
              className="admin-action-button"
            >
              Save Changes
            </button>

<button
  className="admin-action-button"
  onClick={() => navigate("/admin/payments")}
>
  💳 Rental Payments
</button>

            <button
              type="button"
              className="admin-action-button"
              onClick={cancelEdit}
            >
              Cancel
            </button>

          </form>
        </section>
      )}

      {/* Property Management */}
      <section className="admin-section">
        <h2>Property Management</h2>

        <table>
          <thead>
            <tr>
              <th>Property Name</th>
              <th>Location</th>
              <th>Rent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td colSpan="5">No properties submitted yet.</td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr key={property.id}>
                  <td>{property.propertyName}</td>
                  <td>{property.location}</td>
                  <td>₹{property.rent}</td>
                  <td>{property.status}</td>

                  <td>
                    <button
                      className="admin-action-button"
                      onClick={() => editProperty(property)}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="admin-action-button"
                      onClick={() => deleteProperty(property.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <footer className="footer">
        <h3>Property Management System</h3>
        <p>Admin Module</p>
      </footer>

    </div>
  );
}

export default Admin;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem("users")) || []);
    setProperties(JSON.parse(localStorage.getItem("properties")) || []);
  }, []);

  const pendingProperties = properties.filter(
    (property) => property.status === "Pending"
  );

  const approvedProperties = properties.filter(
    (property) => property.status === "Approved"
  );

  const tenants = users.filter((user) => user.role === "tenant");
  const owners = users.filter((user) => user.role === "owner");

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

      <section className="admin-section">
        <h2>Property Management</h2>

        <table>
          <thead>
            <tr>
              <th>Property Name</th>
              <th>Location</th>
              <th>Rent</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td colSpan="4">No properties submitted yet.</td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr key={property.id}>
                  <td>{property.propertyName}</td>
                  <td>{property.location}</td>
                  <td>₹{property.rent}</td>
                  <td>{property.status}</td>
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

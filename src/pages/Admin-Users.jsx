
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [editingEmail, setEditingEmail] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    role: ""
  });

  useEffect(() => {
    loadUsers();
  }, []);

  // Load Users
  function loadUsers() {
    const savedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    setUsers(savedUsers);
  }

  // Open Edit Form
  function editUser(user) {
    setEditingEmail(user.email);

    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "tenant"
    });

    window.scrollTo(0, 0);
  }

  // Handle Input Changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  // Update User
  function updateUser(event) {
    event.preventDefault();

    const updatedUsers = users.map((user) =>
      user.email === editingEmail
        ? { ...user, ...formData }
        : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setUsers(updatedUsers);
    setEditingEmail(null);

    alert("User updated successfully!");
  }

  // Delete User
  function deleteUser(email) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmDelete) {
      const updatedUsers = users.filter(
        (user) => user.email !== email
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));

      setUsers(updatedUsers);

      alert("User deleted successfully!");
    }
  }

  // Cancel Edit
  function cancelEdit() {
    setEditingEmail(null);
  }

  return (
    <div className="admin-section">

      <h2>👥 User Management</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/admin")}
      >
        Back to Dashboard
      </button>

      {/* Edit User Form */}
      {editingEmail !== null && (
        <div className="property-card">

          <h2>✏️ Edit User</h2>

          <form onSubmit={updateUser}>

            <input
              type="text"
              name="name"
              placeholder="User Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="tenant">Tenant</option>
              <option value="owner">Owner</option>
            </select>

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

      {/* Users Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5">No registered users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.email}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>

                <td>
                  <button
                    className="admin-action-button"
                    onClick={() => editUser(user)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="admin-action-button"
                    onClick={() => deleteUser(user.email)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}

export default AdminUsers;

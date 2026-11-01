
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const deleteUser = (email) => {
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
  };

  return (
    <div className="admin-section">
      <h2>Registered Users</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/admin")}
      >
        Back to Dashboard
      </button>

      {users.length === 0 ? (
        <p>No registered users found.</p>
      ) : (
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={user.email || index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "N/A"}</td>
                  <td>{user.address || "N/A"}</td>
                  <td>{user.role}</td>

                  <td>
                    <button
                      className="admin-action-button"
                      onClick={() => deleteUser(user.email)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;

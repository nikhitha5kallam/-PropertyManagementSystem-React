
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyRentals() {
  const [rentals, setRentals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    const allRentals =
      JSON.parse(localStorage.getItem("rentals")) || [];

    const tenantRentals = allRentals.filter(
      (rental) =>
        rental.tenantEmail === currentUser &&
        rental.status === "Active"
    );

    setRentals(tenantRentals);
  }, []);

  return (
    <div className="admin-section">
      <h2>My Rentals 🏠</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/tenant")}
      >
        Back to Dashboard
      </button>

      {rentals.length === 0 ? (
        <p>You don't have any active rentals yet.</p>
      ) : (
        <div className="property-list">
          {rentals.map((rental) => (
            <div className="property-card" key={rental.id}>
              <h3>{rental.propertyName}</h3>

              <p>📍 Location: {rental.propertyLocation}</p>
              <p>💰 Monthly Rent: ₹{rental.propertyRent}</p>

              <hr />

              <h3>Rental Details</h3>

              <p>Tenant: {rental.tenantName}</p>
              <p>Email: {rental.tenantEmail}</p>
              <p>Owner Email: {rental.ownerEmail}</p>

              <p>
                <strong>Status: Active ✅</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRentals;

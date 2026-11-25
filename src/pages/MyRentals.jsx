
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyRentals() {
  const [rentals, setRentals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadRentals();
  }, []);

  // Load tenant rentals
  function loadRentals() {
    const currentUser = localStorage.getItem("currentUser");

    const allRentals =
      JSON.parse(localStorage.getItem("rentals")) || [];

    const tenantRentals = allRentals.filter(
      (rental) =>
        rental.tenantEmail === currentUser
    );

    setRentals(tenantRentals);
  }

  // Request rental cancellation
  function cancelRental(id) {
    const confirmCancel = window.confirm(
      "Are you sure you want to request cancellation of this rental?"
    );

    if (confirmCancel) {
      const allRentals =
        JSON.parse(localStorage.getItem("rentals")) || [];

      const updatedRentals = allRentals.map((rental) =>
        rental.id === id &&
        rental.tenantEmail === localStorage.getItem("currentUser") &&
        rental.status === "Active"
          ? { ...rental, status: "Cancellation Requested" }
          : rental
      );

      localStorage.setItem(
        "rentals",
        JSON.stringify(updatedRentals)
      );

      setRentals(updatedRentals.filter(
        (rental) =>
          rental.tenantEmail === localStorage.getItem("currentUser")
      ));

      alert("Rental cancellation request submitted!");
    }
  }

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
        <p>You don't have any rental records yet.</p>
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
                <strong>Status: {rental.status}</strong>
              </p>

              {rental.status === "Active" && (
                <button
                  className="admin-action-button"
                  onClick={() => cancelRental(rental.id)}
                >
                  ❌ Request Cancellation
                </button>
              )}

              {rental.status === "Cancellation Requested" && (
                <p>⏳ Waiting for owner approval.</p>
              )}

              {rental.status === "Cancelled" && (
                <p>Rental cancelled.</p>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyRentals;

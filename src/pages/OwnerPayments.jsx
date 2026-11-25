
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OwnerPayments() {
  const [rentals, setRentals] = useState([]);
  const navigate = useNavigate();

  const currentUser = localStorage.getItem("currentUser");

  useEffect(() => {
    loadRentals();
  }, []);

  function loadRentals() {
    const allRentals =
      JSON.parse(localStorage.getItem("rentals")) || [];

    const myRentals = allRentals.filter(
      (rental) => rental.ownerEmail === currentUser
    );

    setRentals(myRentals);
  }

  // Format a date using the local timezone
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Calculate the next month's rent due date
  function getNextDueDate(dueDate, dueDay = 5) {
    const [year, month, day] = dueDate.split("-").map(Number);

    const nextDate = new Date(year, month, dueDay);

    return formatDate(nextDate);
  }

  function verifyPayment(rentalId, paymentId) {
    const confirmVerify = window.confirm(
      "Verify this demo rent payment?"
    );

    if (!confirmVerify) return;

    const allRentals =
      JSON.parse(localStorage.getItem("rentals")) || [];

    const updatedRentals = allRentals.map((rental) => {
      if (
        rental.id === rentalId &&
        rental.ownerEmail === currentUser
      ) {
        const payment = (rental.paymentHistory || []).find(
          (item) => item.id === paymentId
        );

        // Only Submitted payments can be verified
        if (!payment || payment.status !== "Submitted") {
          return rental;
        }

        const updatedHistory = rental.paymentHistory.map((item) =>
          item.id === paymentId
            ? {
                ...item,
                status: "Paid",
                verifiedDate: new Date().toISOString()
              }
            : item
        );

        const nextDueDate = getNextDueDate(
          payment.dueDate || rental.nextDueDate,
          rental.rentDueDay || 5
        );

        return {
          ...rental,
          paymentStatus: "Paid",
          lastPaidDate: new Date().toISOString(),
          nextDueDate,
          paymentHistory: updatedHistory
        };
      }

      return rental;
    });

    localStorage.setItem("rentals", JSON.stringify(updatedRentals));

    alert("Payment verified successfully!");
    loadRentals();
  }

  function rejectPayment(rentalId, paymentId) {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this payment?"
    );

    if (!confirmReject) return;

    const allRentals =
      JSON.parse(localStorage.getItem("rentals")) || [];

    const updatedRentals = allRentals.map((rental) => {
      if (
        rental.id === rentalId &&
        rental.ownerEmail === currentUser
      ) {
        const updatedHistory = (rental.paymentHistory || []).map(
          (payment) =>
            payment.id === paymentId &&
            payment.status === "Submitted"
              ? {
                  ...payment,
                  status: "Rejected",
                  rejectedDate: new Date().toISOString()
                }
              : payment
        );

        return {
          ...rental,
          paymentStatus: "Rejected",
          paymentHistory: updatedHistory
        };
      }

      return rental;
    });

    localStorage.setItem("rentals", JSON.stringify(updatedRentals));

    alert("Payment rejected.");
    loadRentals();
  }

  function getStatusColor(status) {
    if (status === "Paid") return "#198754";
    if (status === "Submitted") return "#0d6efd";
    if (status === "Rejected") return "#dc3545";
    return "#d49b16";
  }

  return (
    <div className="admin-section">
      <h2>💳 Tenant Rental Payments</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/owner")}
      >
        Back to Dashboard
      </button>

      {rentals.length === 0 ? (
        <p>No rental payment records found.</p>
      ) : (
        <div className="property-list">
          {rentals.map((rental) => (
            <div className="property-card" key={rental.id}>
              <h3>🏠 {rental.propertyName}</h3>

              <p>📍 Location: {rental.propertyLocation}</p>
              <p>👤 Tenant: {rental.tenantName}</p>
              <p>📧 Tenant Email: {rental.tenantEmail}</p>

              <hr />

              <h3>Payment Details</h3>

              <p>
                Monthly Rent: <strong>₹{rental.monthlyRent || rental.propertyRent}</strong>
              </p>

              <p>
                Next Due Date: <strong>{rental.nextDueDate || "Not set"}</strong>
              </p>

              <hr />

              <h3>Payment History</h3>

              {(rental.paymentHistory || []).length === 0 ? (
                <p>No payments submitted yet.</p>
              ) : (
                rental.paymentHistory.map((payment) => (
                  <div key={payment.id}>
                    <p>💰 Amount: ₹{payment.amount}</p>

                    <p>
                      🔖 Transaction Reference: {payment.transactionId}
                    </p>

                    <p>
                      📅 Payment Date:{" "}
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </p>

                    <p>
                      📌 Due Date: {payment.dueDate}
                    </p>

                    <p>
                      Status:{" "}
                      <strong
                        style={{
                          color: getStatusColor(payment.status)
                        }}
                      >
                        {payment.status}
                      </strong>
                    </p>

                    {payment.status === "Submitted" && (
                      <div>
                        <button
                          className="admin-action-button"
                          onClick={() =>
                            verifyPayment(rental.id, payment.id)
                          }
                        >
                          ✅ Verify Payment
                        </button>

                        <button
                          className="admin-action-button"
                          style={{
                            backgroundColor: "#dc3545",
                            marginLeft: "10px"
                          }}
                          onClick={() =>
                            rejectPayment(rental.id, payment.id)
                          }
                        >
                          ❌ Reject Payment
                        </button>
                      </div>
                    )}

                    <hr />
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}

      <p style={{ color: "#777", marginTop: "20px" }}>
        Note: This is a demo payment system. No actual money is transferred.
      </p>
    </div>
  );
}

export default OwnerPayments;

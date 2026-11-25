
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TenantPayments() {
  const [rentals, setRentals] = useState([]);
  const [references, setReferences] = useState({});
  const navigate = useNavigate();

  const currentUser = localStorage.getItem("currentUser");

  useEffect(() => {
    loadRentals();
  }, []);

  // Load tenant rentals
  function loadRentals() {
    const allRentals =
      JSON.parse(localStorage.getItem("rentals")) || [];

    const myRentals = allRentals.filter(
      (rental) => rental.tenantEmail === currentUser
    );

    setRentals(myRentals);
  }

  // Check overdue status
  function getPaymentStatus(rental) {
    if (rental.paymentStatus === "Submitted") return "Submitted";
    if (rental.paymentStatus === "Paid") return "Paid";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(rental.nextDueDate + "T00:00:00");

    if (today > dueDate) {
      return "Overdue";
    }

    return "Pending";
  }

  // Submit demo payment
  function submitPayment(rental) {
    const reference = references[rental.id]?.trim();

    if (!reference) {
      alert("Please enter a transaction reference!");
      return;
    }

    const confirmPayment = window.confirm(
      "Submit demo payment of ₹" +
      rental.monthlyRent +
      "?\n\nThis is a simulated payment. No real money will be transferred."
    );

    if (!confirmPayment) return;

    const allRentals =
      JSON.parse(localStorage.getItem("rentals")) || [];

    const updatedRentals = allRentals.map((item) => {
      if (item.id === rental.id) {
        const history = item.paymentHistory || [];

        const newPayment = {
          id: Date.now(),
          amount: Number(item.monthlyRent || item.propertyRent),
          transactionId: reference,
          paymentDate: new Date().toISOString(),
          dueDate: item.nextDueDate,
          status: "Submitted"
        };

        return {
          ...item,
          paymentStatus: "Submitted",
          paymentHistory: [...history, newPayment]
        };
      }

      return item;
    });

    localStorage.setItem(
      "rentals",
      JSON.stringify(updatedRentals)
    );

    alert("Payment submitted! Waiting for owner verification.");

    setReferences((prev) => ({
      ...prev,
      [rental.id]: ""
    }));

    loadRentals();
  }

  function getStatusColor(status) {
    if (status === "Paid") return "#198754";
    if (status === "Submitted") return "#0d6efd";
    if (status === "Overdue") return "#dc3545";
    return "#d49b16";
  }

  return (
    <div className="admin-section">

      <h2>💳 My Rental Payments</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/tenant")}
      >
        Back to Dashboard
      </button>

      {rentals.length === 0 ? (
        <p>You don't have any active rental payments.</p>
      ) : (
        <div className="property-list">

          {rentals.map((rental) => {
            const status = getPaymentStatus(rental);
            const amount = Number(
              rental.monthlyRent || rental.propertyRent || 0
            );

            return (
              <div className="property-card" key={rental.id}>

                <h3>{rental.propertyName}</h3>

                <p>📍 Location: {rental.propertyLocation}</p>
                <p>👤 Owner: {rental.ownerEmail}</p>

                <hr />

                <h3>Payment Details</h3>

                <p>
                  💰 Monthly Rent: <strong>₹{amount}</strong>
                </p>

                <p>
                  📅 Due Date: {rental.nextDueDate || "Not set"}
                </p>

                <p>
                  Payment Status:
                  <strong
                    style={{
                      color: getStatusColor(status),
                      marginLeft: "8px"
                    }}
                  >
                    {status}
                  </strong>
                </p>

                {status === "Pending" || status === "Overdue" ? (
                  <div>

                    <input
                      type="text"
                      placeholder="Enter demo transaction reference"
                      value={references[rental.id] || ""}
                      onChange={(e) =>
                        setReferences((prev) => ({
                          ...prev,
                          [rental.id]: e.target.value
                        }))
                      }
                    />

                    <button
                      className="admin-action-button"
                      onClick={() => submitPayment(rental)}
                    >
                      💳 Submit Demo Payment
                    </button>

                  </div>
                ) : status === "Submitted" ? (
                  <p>⏳ Your payment is waiting for owner verification.</p>
                ) : (
                  <p>✅ Your rent payment has been verified.</p>
                )}

                <hr />

                <h3>Payment History</h3>

                {(rental.paymentHistory || []).length === 0 ? (
                  <p>No payment history available.</p>
                ) : (
                  rental.paymentHistory.map((payment) => (
                    <div key={payment.id}>
                      <p>💰 Amount: ₹{payment.amount}</p>
                      <p>🔖 Transaction ID: {payment.transactionId}</p>
                      <p>
                        📅 Payment Date:{" "}
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </p>
                      <p>📌 Status: {payment.status}</p>
                      <hr />
                    </div>
                  ))
                )}

              </div>
            );
          })}

        </div>
      )}

      <p style={{ color: "#777", marginTop: "20px" }}>
        Note: This is a demo payment system. No actual money is transferred.
      </p>

    </div>
  );
}

export default TenantPayments;

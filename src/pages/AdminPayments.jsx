
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminPayments() {
  const [rentals, setRentals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadPayments();
  }, []);

  function loadPayments() {
    const allRentals =
      JSON.parse(localStorage.getItem("rentals")) || [];

    setRentals(allRentals);
  }

  function getCurrentStatus(rental) {
    if (rental.paymentStatus === "Submitted") return "Submitted";

    if (rental.paymentStatus === "Paid") return "Paid";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (rental.nextDueDate) {
      const dueDate = new Date(rental.nextDueDate + "T00:00:00");

      if (today > dueDate) return "Overdue";
    }

    return "Pending";
  }

  const allPayments = rentals.flatMap((rental) =>
    (rental.paymentHistory || []).map((payment) => ({
      ...payment,
      propertyName: rental.propertyName,
      tenantName: rental.tenantName,
      tenantEmail: rental.tenantEmail,
      ownerEmail: rental.ownerEmail
    }))
  );

  const totalCollected = allPayments
    .filter((payment) => payment.status === "Paid")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const submittedPayments = allPayments.filter(
    (payment) => payment.status === "Submitted"
  );

  const overdueRentals = rentals.filter(
    (rental) =>
      rental.status === "Active" &&
      getCurrentStatus(rental) === "Overdue"
  );

  const pendingRentals = rentals.filter(
    (rental) =>
      rental.status === "Active" &&
      getCurrentStatus(rental) === "Pending"
  );

  const totalPending = pendingRentals.reduce(
    (total, rental) =>
      total + Number(rental.monthlyRent || rental.propertyRent || 0),
    0
  );

  const totalOverdue = overdueRentals.reduce(
    (total, rental) =>
      total + Number(rental.monthlyRent || rental.propertyRent || 0),
    0
  );

  function getStatusColor(status) {
    if (status === "Paid") return "#198754";
    if (status === "Submitted") return "#0d6efd";
    if (status === "Rejected" || status === "Overdue") return "#dc3545";
    return "#d49b16";
  }

  return (
    <div className="admin-section">
      <h2>💳 Rental Payment Management</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/admin")}
      >
        Back to Admin Dashboard
      </button>

      {/* PAYMENT SUMMARY */}
      <div className="admin-stats">

        <div className="stat-card">
          <h3>💰 Total Collected</h3>
          <h2>₹{totalCollected.toLocaleString("en-IN")}</h2>
        </div>

        <div className="stat-card">
          <h3>⏳ Awaiting Verification</h3>
          <h2>{submittedPayments.length}</h2>
        </div>

        <div className="stat-card">
          <h3>📅 Pending Rent</h3>
          <h2>₹{totalPending.toLocaleString("en-IN")}</h2>
          <p>{pendingRentals.length} rentals</p>
        </div>

        <div className="stat-card">
          <h3>⚠️ Overdue Rent</h3>
          <h2>₹{totalOverdue.toLocaleString("en-IN")}</h2>
          <p>{overdueRentals.length} rentals</p>
        </div>

      </div>

      <hr />

      {/* RENTAL PAYMENT STATUS */}
      <h2>📊 Current Rental Payment Status</h2>

      {rentals.length === 0 ? (
        <p>No rental records available.</p>
      ) : (
        <div className="property-list">
          {rentals.map((rental) => {
            const status = getCurrentStatus(rental);

            return (
              <div className="property-card" key={rental.id}>
                <h3>🏠 {rental.propertyName}</h3>

                <p>👤 Tenant: {rental.tenantName}</p>
                <p>📧 Tenant Email: {rental.tenantEmail}</p>
                <p>👨‍💼 Owner Email: {rental.ownerEmail}</p>

                <p>
                  💰 Monthly Rent: ₹
                  {Number(
                    rental.monthlyRent || rental.propertyRent || 0
                  ).toLocaleString("en-IN")}
                </p>

                <p>📅 Next Due Date: {rental.nextDueDate || "Not set"}</p>

                <p>
                  Payment Status:{" "}
                  <strong style={{ color: getStatusColor(status) }}>
                    {status}
                  </strong>
                </p>
              </div>
            );
          })}
        </div>
      )}

      <hr />

      {/* COMPLETE PAYMENT HISTORY */}
      <h2>📋 Complete Payment History</h2>

      {allPayments.length === 0 ? (
        <p>No payment history available yet.</p>
      ) : (
        <div className="property-list">
          {allPayments
            .slice()
            .sort(
              (a, b) =>
                new Date(b.paymentDate) - new Date(a.paymentDate)
            )
            .map((payment) => (
              <div className="property-card" key={payment.id}>
                <h3>🏠 {payment.propertyName}</h3>

                <p>👤 Tenant: {payment.tenantName}</p>
                <p>📧 Tenant Email: {payment.tenantEmail}</p>
                <p>👨‍💼 Owner Email: {payment.ownerEmail}</p>

                <p>💰 Amount: ₹{Number(payment.amount).toLocaleString("en-IN")}</p>

                <p>🔖 Transaction ID: {payment.transactionId}</p>

                <p>
                  📅 Payment Date:{" "}
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </p>

                <p>📆 Rent Due Date: {payment.dueDate}</p>

                <p>
                  Status:{" "}
                  <strong style={{ color: getStatusColor(payment.status) }}>
                    {payment.status}
                  </strong>
                </p>
              </div>
            ))}
        </div>
      )}

      <p style={{ color: "#777", marginTop: "20px" }}>
        Note: This dashboard tracks demo payments stored in Local Storage.
        No actual money is transferred.
      </p>
    </div>
  );
}

export default AdminPayments;

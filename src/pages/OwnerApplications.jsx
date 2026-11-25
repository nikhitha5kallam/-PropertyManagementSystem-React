
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OwnerApplications() {
  const [applications, setApplications] = useState([]);
  const [photoIndexes, setPhotoIndexes] = useState({});
  const navigate = useNavigate();

  const currentUser = localStorage.getItem("currentUser");

  useEffect(() => {
    loadApplications();
  }, []);

  // Load owner's applications
  const loadApplications = () => {
    const allApplications =
      JSON.parse(localStorage.getItem("tenantApplications")) || [];

    const allProperties =
      JSON.parse(localStorage.getItem("properties")) || [];

    const ownerApplications = allApplications
      .filter((application) => application.ownerEmail === currentUser)
      .map((application) => {
        const property = allProperties.find(
          (p) => p.id === application.propertyId
        );

        return {
          ...application,
          photos: property
            ? property.photos?.length
              ? property.photos
              : property.photo
                ? [property.photo]
                : []
            : []
        };
      });

    setApplications(ownerApplications);
  };

  // Calculate next rent due date
  function getNextDueDate() {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();

    if (today.getDate() > 5) {
      month++;
    }

    const dueDate = new Date(year, month, 5);

    return dueDate.toISOString().split("T")[0];
  }

  // Photo navigation
  function previousPhoto(id, totalPhotos) {
    setPhotoIndexes((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) - 1 + totalPhotos) % totalPhotos
    }));
  }

  function nextPhoto(id, totalPhotos) {
    setPhotoIndexes((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % totalPhotos
    }));
  }

  // Accept Application
  function acceptApplication(application) {
    const allApplications =
      JSON.parse(localStorage.getItem("tenantApplications")) || [];

    const latestApplication = allApplications.find(
      (item) => item.id === application.id
    );

    if (!latestApplication || latestApplication.status !== "Pending") {
      alert("This application has already been processed!");
      loadApplications();
      return;
    }

    const rentals =
      JSON.parse(localStorage.getItem("rentals")) || [];

    const existingRental = rentals.some(
      (rental) =>
        rental.applicationId === application.id
    );

    if (existingRental) {
      alert("A rental already exists for this application!");
      return;
    }

    // Create rental with payment details
    const newRental = {
      id: Date.now(),
      applicationId: application.id,
      propertyId: application.propertyId,
      propertyName: application.propertyName,
      propertyLocation: application.propertyLocation,
      propertyRent: Number(application.propertyRent),
      monthlyRent: Number(application.propertyRent),

      ownerEmail: application.ownerEmail,
      tenantEmail: application.tenantEmail,
      tenantName: application.tenantName,
      phone: application.phone,

      rentalStartDate: new Date().toISOString().split("T")[0],

      rentDueDay: 5,
      nextDueDate: getNextDueDate(),

      paymentStatus: "Pending",
      paymentHistory: [],

      status: "Active"
    };

    rentals.push(newRental);

    // Update application status
    const updatedApplications = allApplications.map((item) =>
      item.id === application.id
        ? { ...item, status: "Accepted" }
        : item
    );

    localStorage.setItem(
      "rentals",
      JSON.stringify(rentals)
    );

    localStorage.setItem(
      "tenantApplications",
      JSON.stringify(updatedApplications)
    );

    alert("Application accepted! Rental and payment account created.");

    loadApplications();
  }

  // Reject Application
  function rejectApplication(applicationId) {
    const allApplications =
      JSON.parse(localStorage.getItem("tenantApplications")) || [];

    const updatedApplications = allApplications.map((item) =>
      item.id === applicationId && item.status === "Pending"
        ? { ...item, status: "Rejected" }
        : item
    );

    localStorage.setItem(
      "tenantApplications",
      JSON.stringify(updatedApplications)
    );

    alert("Tenant application rejected!");

    loadApplications();
  }

  return (
    <div className="admin-section">

      <h2>Tenant Applications 📋</h2>

      <button
        className="admin-action-button"
        onClick={() => navigate("/owner")}
      >
        Back to Dashboard
      </button>

      {applications.length === 0 ? (
        <p>No tenant applications received yet.</p>
      ) : (
        <div className="property-list">

          {applications.map((application) => {
            const photos = application.photos || [];
            const currentIndex = photoIndexes[application.id] || 0;

            return (
              <div className="property-card" key={application.id}>

                {photos.length > 0 && (
                  <div className="property-gallery">

                    <img
                      src={photos[currentIndex]}
                      alt={application.propertyName}
                      className="property-gallery-image"
                    />

                    {photos.length > 1 && (
                      <div className="gallery-controls">

                        <button
                          onClick={() =>
                            previousPhoto(application.id, photos.length)
                          }
                        >
                          ❮ Previous
                        </button>

                        <span>
                          {currentIndex + 1} / {photos.length}
                        </span>

                        <button
                          onClick={() =>
                            nextPhoto(application.id, photos.length)
                          }
                        >
                          Next ❯
                        </button>

                      </div>
                    )}

                  </div>
                )}

                <h3>{application.propertyName}</h3>

                <p>📍 Location: {application.propertyLocation}</p>
                <p>💰 Monthly Rent: ₹{application.propertyRent}</p>

                <hr />

                <h3>Tenant Details</h3>

                <p>👤 Name: {application.tenantName}</p>
                <p>📧 Email: {application.tenantEmail}</p>
                <p>📞 Phone: {application.phone}</p>

                <hr />

                <h3>Employment & Financial Details</h3>

                <p>💼 Occupation: {application.occupation}</p>
                <p>🏢 Employer: {application.employer}</p>
                <p>💰 Monthly Income: ₹{application.income}</p>

                <hr />

                <h3>Rental Requirements</h3>

                <p>📅 Duration: {application.duration}</p>
                <p>👨‍👩‍👧‍👦 Household Members: {application.familyMembers}</p>
                <p>🏠 Move-in Date: {application.moveInDate}</p>

                <hr />

                <h3>Previous Rental Details</h3>
                <p>{application.rentalHistory || "Not provided"}</p>

                <hr />

                <h3>Additional Information</h3>
                <p>{application.additionalInfo || "Not provided"}</p>

                <hr />

                <h3>Application Status: {application.status}</h3>

                {application.status === "Pending" && (
                  <div>

                    <button
                      className="admin-action-button"
                      onClick={() => acceptApplication(application)}
                    >
                      ✅ Accept
                    </button>

                    <button
                      className="admin-action-button"
                      onClick={() => rejectApplication(application.id)}
                    >
                      ❌ Reject
                    </button>

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default OwnerApplications;

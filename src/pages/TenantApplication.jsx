import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function TenantApplication() {
  const navigate = useNavigate();
  const location = useLocation();

  const property = location.state?.property;
  const currentUser = localStorage.getItem("currentUser");

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === currentUser);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || currentUser || "",
    phone: user?.phone || "",
    occupation: "",
    employer: "",
    income: "",
    duration: "",
    members: "",
    moveInDate: "",
    rentalHistory: "",
    additionalInfo: ""
  });

  if (!currentUser) {
    alert("Please login first!");
    navigate("/login");
    return null;
  }

  if (!property) {
    return (
      <div className="application-container">
        <h2>Property not found!</h2>
        <button onClick={() => navigate("/tenant/properties")}>
          Back to Properties
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const applications =
      JSON.parse(localStorage.getItem("tenantApplications")) || [];

    const alreadyApplied = applications.some(
      (app) =>
        app.propertyId === property.id &&
        app.tenantEmail === currentUser &&
        app.status === "Pending"
    );

    if (alreadyApplied) {
      alert("You have already applied for this property!");
      return;
    }

    const application = {
      id: Date.now(),

      propertyId: property.id,
      propertyName: property.propertyName,
      propertyLocation: property.location,
      propertyRent: property.rent,
      ownerEmail: property.ownerEmail,

      tenantEmail: currentUser,
      tenantName: form.name,
      phone: form.phone,

      // Tenant details
      occupation: form.occupation,
      employer: form.employer,
      income: form.income,
      monthlyIncome: form.income,
      company: form.employer,
      duration: form.duration,
      familyMembers: form.members,
      moveInDate: form.moveInDate,
      rentalHistory: form.rentalHistory,
      previousRentalExperience: form.rentalHistory,
      additionalInfo: form.additionalInfo,

      status: "Pending"
    };

    applications.push(application);

    localStorage.setItem(
      "tenantApplications",
      JSON.stringify(applications)
    );

    alert("Rental application submitted successfully!");

    navigate("/tenant");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

        .application-page {
          min-height: 100vh;
          padding-bottom: 50px;
          background: #f7f4ef;
          font-family: 'DM Sans', sans-serif;
          color: #292725;
        }

        .application-header {
          padding: 28px 20px 25px;
          text-align: center;
          background: #C6A15B;
          border-bottom: 1px solid rgba(23,43,58,0.15);
          box-shadow: 0 4px 20px rgba(0,0,0,0.10);
        }

        .application-header h1 {
          margin: 0 0 5px;
          color: #172B3A;
          font-family: 'Playfair Display', serif;
          font-size: 38px;
        }

        .application-header p {
          margin: 0;
          color: #172B3A;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .application-container {
          width: min(850px, 90%);
          margin: 65px auto;
          padding: 50px 55px;
          background: white;
          border: 1px solid #E3DDD3;
          box-shadow: 0 20px 55px rgba(40,35,30,0.10);
        }

        .application-container > h2 {
          margin: 0 0 35px;
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-size: 38px;
        }

        .application-property {
          margin-bottom: 35px;
          padding: 25px 28px;
          background: #F7F4EF;
          border-left: 4px solid #C29A5C;
          border-top: 1px solid #E5DFD6;
          border-right: 1px solid #E5DFD6;
          border-bottom: 1px solid #E5DFD6;
        }

        .application-property h3 {
          margin: 0 0 12px;
          color: #172B3A;
          font-family: 'Playfair Display', serif;
          font-size: 25px;
        }

        .application-property p {
          margin: 7px 0;
          color: #77716A;
          font-size: 14px;
        }

        .application-form {
          display: flex;
          flex-direction: column;
        }

        .application-form label {
          margin: 18px 0 8px;
          font-size: 13px;
          font-weight: 700;
        }

        .application-form input,
        .application-form textarea {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #D9D2C8;
          background: #FBFAF8;
          color: #292725;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
        }

        .application-form input {
          height: 48px;
        }

        .application-form textarea {
          min-height: 110px;
          resize: vertical;
        }

        .application-form input:focus,
        .application-form textarea:focus {
          border-color: #C29A5C;
          background: white;
          box-shadow: 0 0 0 3px rgba(194,154,92,0.12);
        }

        .application-form input[readonly] {
          background: #F1EEE8;
          color: #77716A;
        }

        .application-submit,
        .application-back {
          margin-top: 25px;
          padding: 16px 25px;
          border: none;
          background: #C29A5C;
          color: white;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          cursor: pointer;
        }

        .application-submit:hover {
          background: #A77E46;
        }

        .application-back {
          margin-top: 12px;
          border: 1px solid #C29A5C;
          background: transparent;
          color: #8C6835;
        }

        .application-back:hover {
          background: #C29A5C;
          color: white;
        }

        @media (max-width: 700px) {
          .application-container {
            width: 94%;
            margin: 35px auto;
            padding: 35px 22px;
          }

          .application-container > h2 {
            font-size: 32px;
          }
        }
      `}</style>

      <div className="application-page">

        <header className="application-header">
          <h1>PMS</h1>
          <p>Tenant Rental Application</p>
        </header>

        <div className="application-container">

          <h2>Apply For Rental</h2>

          <div className="application-property">
            <h3>{property.propertyName}</h3>
            <p>📍 Location: {property.location}</p>
            <p>💰 Monthly Rent: ₹{property.rent}</p>
          </div>

          <form
            className="application-form"
            onSubmit={handleSubmit}
          >

            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
            />

            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <label>Occupation / Employment Status</label>
            <input
              type="text"
              name="occupation"
              value={form.occupation}
              onChange={handleChange}
              placeholder="Example: Software Developer"
              required
            />

            <label>Employer / Company Name</label>
            <input
              type="text"
              name="employer"
              value={form.employer}
              onChange={handleChange}
              placeholder="Example: ABC Technologies"
              required
            />

            <label>Monthly Income</label>
            <input
              type="number"
              name="income"
              value={form.income}
              onChange={handleChange}
              placeholder="Enter monthly income"
              min="0"
              required
            />

            <label>Expected Rental Duration</label>
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="Example: 1 year"
              required
            />

            <label>Number of Family / Household Members</label>
            <input
              type="number"
              name="members"
              value={form.members}
              onChange={handleChange}
              min="1"
              required
            />

            <label>Expected Move-in Date</label>
            <input
              type="date"
              name="moveInDate"
              value={form.moveInDate}
              onChange={handleChange}
              required
            />

            <label>Previous Rental / Reference Details</label>
            <textarea
              name="rentalHistory"
              value={form.rentalHistory}
              onChange={handleChange}
              placeholder="Enter previous rental experience or reference details"
            />

            <label>Additional Information</label>
            <textarea
              name="additionalInfo"
              value={form.additionalInfo}
              onChange={handleChange}
              placeholder="Any additional information for the property owner"
            />

            <button
              type="submit"
              className="application-submit"
            >
              SUBMIT APPLICATION
            </button>

            <button
              type="button"
              className="application-back"
              onClick={() => navigate("/tenant/properties")}
            >
              BACK
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

export default TenantApplication;
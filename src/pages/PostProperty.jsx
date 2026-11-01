
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function PostProperty() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    propertyName: "",
    location: "",
    propertyType: "",
    area: "",
    areaUnit: "sq.ft",
    rent: "",
    bedrooms: "",
    bathrooms: "",
    description: ""
  });

  const [photo, setPhoto] = useState(null);
  const [ownershipDocument, setOwnershipDocument] = useState(null);
  const [taxDocument, setTaxDocument] = useState(null);
  const [electricityBill, setElectricityBill] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [addressProof, setAddressProof] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("Please select all required files."));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("File could not be read."));

      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const currentUser = localStorage.getItem("currentUser");

      if (!currentUser) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      const [
        photoData,
        ownershipData,
        taxData,
        electricityData,
        ownerIdData,
        addressData
      ] = await Promise.all([
        readFile(photo),
        readFile(ownershipDocument),
        readFile(taxDocument),
        readFile(electricityBill),
        readFile(ownerId),
        readFile(addressProof)
      ]);

      const newProperty = {
        id: Date.now(),
        ownerEmail: currentUser,
        ...form,

        photo: photoData,
        ownershipDocument: ownershipData,
        taxDocument: taxData,
        electricityBill: electricityData,
        ownerId: ownerIdData,
        addressProof: addressData,

        ownershipVerified: false,
        taxVerified: false,
        electricityVerified: false,
        ownerIdVerified: false,
        addressVerified: false,

        status: "Pending"
      };

      const properties =
        JSON.parse(localStorage.getItem("properties")) || [];

      properties.push(newProperty);

      localStorage.setItem(
        "properties",
        JSON.stringify(properties)
      );

      alert("Property submitted successfully! Waiting for Admin approval.");

      navigate("/owner");
    } catch (error) {
      alert(error.message || "Unable to submit property.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Post Your Property 🏠</h2>

        <input
          type="text"
          name="propertyName"
          placeholder="Property Name"
          value={form.propertyName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Property Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <select
          name="propertyType"
          value={form.propertyType}
          onChange={handleChange}
          required
        >
          <option value="">Select Property Type</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Villa">Villa</option>
          <option value="Commercial">Commercial</option>
        </select>

        <input
          type="number"
          name="area"
          placeholder="Area"
          value={form.area}
          onChange={handleChange}
          min="1"
          required
        />

        <select
          name="areaUnit"
          value={form.areaUnit}
          onChange={handleChange}
          required
        >
          <option value="sq.ft">Square Feet</option>
          <option value="sq.yd">Square Yards</option>
          <option value="sq.m">Square Metres</option>
        </select>

        <input
          type="number"
          name="rent"
          placeholder="Monthly Rent (₹)"
          value={form.rent}
          onChange={handleChange}
          min="1"
          required
        />

        <input
          type="number"
          name="bedrooms"
          placeholder="Number of Bedrooms"
          value={form.bedrooms}
          onChange={handleChange}
          min="0"
          required
        />

        <input
          type="number"
          name="bathrooms"
          placeholder="Number of Bathrooms"
          value={form.bathrooms}
          onChange={handleChange}
          min="0"
          required
        />

        <textarea
          name="description"
          placeholder="Property Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label>Property Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          required
        />

        <h3>Verification Documents</h3>

        <label>Ownership Document</label>
        <input
          type="file"
          onChange={(e) => setOwnershipDocument(e.target.files[0])}
          required
        />

        <label>Property Tax Receipt</label>
        <input
          type="file"
          onChange={(e) => setTaxDocument(e.target.files[0])}
          required
        />

        <label>Electricity Bill</label>
        <input
          type="file"
          onChange={(e) => setElectricityBill(e.target.files[0])}
          required
        />

        <label>Owner ID Proof</label>
        <input
          type="file"
          onChange={(e) => setOwnerId(e.target.files[0])}
          required
        />

        <label>Address Proof</label>
        <input
          type="file"
          onChange={(e) => setAddressProof(e.target.files[0])}
          required
        />

        <button type="submit">
          Submit Property
        </button>

        <button
          type="button"
          onClick={() => navigate("/owner")}
        >
          Back to Dashboard
        </button>
      </form>
    </div>
  );
}

export default PostProperty;

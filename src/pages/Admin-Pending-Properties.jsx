
import { useState } from "react";

function AdminPendingProperties() {
  const [properties, setProperties] = useState(
    JSON.parse(localStorage.getItem("properties")) || []
  );

  const documents = [
    { key: "ownershipVerified", label: "Property Ownership Document" },
    { key: "taxVerified", label: "Property/Home Tax Receipt" },
    { key: "electricityVerified", label: "Electricity Bill" },
    { key: "ownerIdVerified", label: "Owner ID Proof" },
    { key: "addressVerified", label: "Address Proof" }
  ];

  function updateVerification(id, key, checked) {
    const updated = properties.map((property) =>
      property.id === id
        ? { ...property, [key]: checked }
        : property
    );

    setProperties(updated);
    localStorage.setItem("properties", JSON.stringify(updated));
  }

  function updateStatus(id, status) {
    const property = properties.find((p) => p.id === id);

    if (status === "Approved") {
      const allVerified = documents.every(
        (doc) => property[doc.key] === true
      );

      if (!allVerified) {
        alert("Please verify all five documents before approval!");
        return;
      }
    }

    const updated = properties.map((p) =>
      p.id === id ? { ...p, status } : p
    );

    setProperties(updated);
    localStorage.setItem("properties", JSON.stringify(updated));

    alert("Property " + status + " successfully!");
  }

  function viewDocument(file) {
    if (!file) {
      alert("Document not available!");
      return;
    }

    const newWindow = window.open();

    if (newWindow) {
      newWindow.document.write(
        `<iframe src="${file}" style="width:100%;height:100%;border:0"></iframe>`
      );
      newWindow.document.close();
    } else {
      alert("Please allow pop-ups to view documents.");
    }
  }

  const pendingProperties = properties.filter(
    (property) => property.status === "Pending"
  );

  return (
    <div className="admin-section">
      <h1>Pending Property Approvals</h1>

      {pendingProperties.length === 0 ? (
        <p>No pending properties available.</p>
      ) : (
        pendingProperties.map((property) => (
          <div className="property-card" key={property.id}>

            {property.photo && (
              <img src={property.photo} alt={property.propertyName} />
            )}

            <h2>{property.propertyName}</h2>
            <p>Location: {property.location}</p>
            <p>Type: {property.propertyType}</p>
            <p>Area: {property.area} {property.areaUnit}</p>
            <p>Monthly Rent: ₹{property.rent}</p>
            <p>Owner: {property.ownerEmail}</p>

            <h3>Document Verification</h3>

            {documents.map((doc) => (
              <div className="document-check" key={doc.key}>
                <label>
                  <input
                    type="checkbox"
                    checked={property[doc.key] || false}
                    onChange={(e) =>
                      updateVerification(
                        property.id,
                        doc.key,
                        e.target.checked
                      )
                    }
                  />
                  {doc.label}
                </label>

                <button
                  onClick={() =>
                    viewDocument(
                      property[
                        {
                          ownershipVerified: "ownershipDocument",
                          taxVerified: "taxDocument",
                          electricityVerified: "electricityBill",
                          ownerIdVerified: "ownerId",
                          addressVerified: "addressProof"
                        }[doc.key]
                      ]
                    )
                  }
                >
                  View Document
                </button>
              </div>
            ))}

            <div className="approval-buttons">
              <button
                onClick={() => updateStatus(property.id, "Approved")}
              >
                Approve Property
              </button>

              <button
                onClick={() => updateStatus(property.id, "Rejected")}
              >
                Reject Property
              </button>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default AdminPendingProperties;

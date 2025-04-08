import React, { useState, useEffect } from "react";
import axios from "axios";
import "./storeforms.css"; // Import the specific CSS for the StoreForm

const StoreForm = ({ initialData, onClose }) => {
  const [storeName, setStoreName] = useState(initialData?.name || "");
  const [storeAddress, setStoreAddress] = useState(initialData?.address || "");
  const [auditSchedule, setAuditSchedule] = useState(initialData?.audit_schedule || "");
  const [message, setMessage] = useState("");
  const [existingStores, setExistingStores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/stores/");
      setExistingStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (isDuplicateStore()) {
      alert("❌ Store with the same name already exists.");
      return;
    }

    // Construct the data object to be sent to the backend
    const storeData = {
      name: storeName,
      address: storeAddress,
      audit_schedule: auditSchedule,
    };

    setLoading(true);
    try {
      if (initialData) {
        // If editing, update the existing store
        const response = await axios.put(`http://127.0.0.1:8000/api/stores/${initialData.id}/`, storeData);
        if (response.status === 200) {
          alert("✅ Store updated successfully!");
          onClose(); // Close the form after successful update
        } else {
          alert("❌ Error updating store. Please try again.");
        }
      } else {
        // If adding new store, create a new entry
        const response = await axios.post("http://127.0.0.1:8000/api/stores/", storeData);
        if (response.status === 201) {
          alert("✅ Store added successfully!");
          setStoreName("");
          setStoreAddress("");
          setAuditSchedule("");
        } else {
          alert("❌ Error adding store. Please try again.");
        }
      }
    } catch (error) {
      alert("❌ Error saving store. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isDuplicateStore = () => {
    return existingStores.some(store => store.name === storeName && store.id !== initialData?.id);
  };

  // Check if all fields are filled
  const isFormValid = storeName.trim() !== "" && storeAddress.trim() !== "" && auditSchedule.trim() !== "";

  return (
    <div className="background-panel">
      <div className="add-store-form">
        <h2 className="add-store-info-text">{initialData ? "EDIT STORE INFORMATION" : "ADD STORE INFORMATION"}</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit} className="form">
          <label className="store-name-text">Store Name:</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            className="store-name-field"
          />

          <label className="store-address-text">Store Address:</label>
          <input
            type="text"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            required
            className="store-address-field"
          />

          <label className="audit-schedule-text">Audit Schedule:</label>
          <input
            type="date"
            value={auditSchedule}
            onChange={(e) => setAuditSchedule(e.target.value)}
            required
            className="date-field"
          />

          <button type="submit" className="submit-button" disabled={!isFormValid || loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoreForm;
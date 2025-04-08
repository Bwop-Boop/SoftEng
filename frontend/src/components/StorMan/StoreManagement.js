import React, { useState, useEffect } from "react";
import axios from "axios";
import "./storemanagement.css";

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/stores/");
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const handleEditClick = (store) => {
    setSelectedStore({ ...store });
    setIsModalOpen(true);
    setMessage("");
  };

  const handleDeleteClick = (storeId) => {
    setStoreToDelete(storeId);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/stores/${storeToDelete}/`);
      setStores(stores.filter(store => store.id !== storeToDelete));
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  const handleSave = async () => {
    if (isDuplicateStoreName()) {
      setMessage("❌ Store with the same name already exists.");
      return;
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/stores/${selectedStore.id}/`, selectedStore);
      setStores(stores.map(store => store.id === selectedStore.id ? selectedStore : store));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating store:", error);
    }
  };

  const isDuplicateStoreName = () => {
    return stores.some(store => store.name.toLowerCase() === selectedStore.name.toLowerCase() && store.id !== selectedStore.id);
  };

  const handleStoreNameChange = (e) => {
    setSelectedStore({ ...selectedStore, name: e.target.value });
    if (isDuplicateStoreName()) {
      setMessage("❌ Store with the same name already exists.");
    } else {
      setMessage("");
    }
  };

  return (
    <div className="background-panel">
      <div className="store-management">
        <h2>Store Management</h2>
        <div className="table-container">
          <table className="store-table">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Address</th>
                <th>Audit Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.address}</td>
                  <td>{store.audit_schedule}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEditClick(store)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteClick(store.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Store</h3>
              {message && <p className="message">{message}</p>}
              <label>Store Name:</label>
              <input
                type="text"
                value={selectedStore.name}
                onChange={handleStoreNameChange}
                className={message ? "input-error" : ""}
              />

              <label>Store Address:</label>
              <input
                type="text"
                value={selectedStore.address}
                onChange={(e) => setSelectedStore({ ...selectedStore, address: e.target.value })}
              />

              <label>Audit Schedule:</label>
              <input
                type="date"
                value={selectedStore.audit_schedule}
                onChange={(e) => setSelectedStore({ ...selectedStore, audit_schedule: e.target.value })}
              />

              <div className="modal-actions">
                <button className="save-button" onClick={handleSave} disabled={!!message}>Save</button>
                <button className="edit-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {isDeleteConfirmOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this store? This will also delete all related evaluations.</p>
              <div className="modal-actions">
                <button className="delete-button" onClick={confirmDelete}>Delete</button>
                <button className="edit-button" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreManagement;
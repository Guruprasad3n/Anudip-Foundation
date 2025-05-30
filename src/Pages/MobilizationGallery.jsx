import { useState, useEffect } from "react";
import "../Styles/MobilizationGallery.css";

function MobilizationGallery() {
  const [showModal, setShowModal] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [state, setState] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const storedEntries =
      JSON.parse(localStorage.getItem("mobilizationGallery")) || [];
    setEntries(storedEntries);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeId || !state || !message || !image) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      employeeId,
      state,
      message,
      image,
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem("mobilizationGallery", JSON.stringify(updatedEntries));

    setEmployeeId("");
    setState("");
    setMessage("");
    setImage(null);
    setShowModal(false);
  };

  return (
    <div className="gallery-page">
      <h1 className="head-section">Mobilization Gallery</h1>
      <button className="open-modal-btn" onClick={() => setShowModal(true)}>
        Add Entry
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-modal" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <form className="gallery-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter Your Employee Id"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
              <select value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">Select State</option>
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <textarea
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      )}

      <div className="gallery-display-wrapper">
        <div className="gallery-display">
          {entries.length === 0 ? (
            <p>No entries yet.</p>
          ) : (
            entries.map((entry) => (
              <div className="gallery-card" key={entry.id}>
                <img src={entry.image} alt="Upload" />
                <p>
                  <strong>ID:</strong> {entry.employeeId}
                </p>
                <p>
                  <strong>State:</strong> {entry.state}
                </p>
                <p>
                  <strong>Message:</strong> {entry.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MobilizationGallery;

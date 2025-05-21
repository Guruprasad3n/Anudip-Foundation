import { useState } from "react";
import "../Styles/MobilizationGallery.css";

function MobilizationGallery() {
  const [showModal, setShowModal] = useState(false);

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
            <form className="gallery-form">
              <input type="text" placeholder="Enter Your Employee Id" />
              <select>
                <option value="">Select State</option>
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
              </select>
              <input type="file" />
              <textarea placeholder="Write your message here..."></textarea>
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      )}

     <div className="gallery-display-wrapper">
  <div className="gallery-display">
    <div className="gallery-card">
      <img
        src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
        alt="Sample Upload"
      />
      <p><strong>ID:</strong> EMP123</p>
      <p><strong>State:</strong> Telangana</p>
      <p><strong>Message:</strong> Sample description about the mobilization effort.</p>
    </div>
    <div className="gallery-card">
      <img
        src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
        alt="Sample Upload"
      />
      <p><strong>ID:</strong> EMP123</p>
      <p><strong>State:</strong> Telangana</p>
      <p><strong>Message:</strong> Sample description about the mobilization effort.</p>
    </div>
    <div className="gallery-card">
      <img
        src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
        alt="Sample Upload"
      />
      <p><strong>ID:</strong> EMP123</p>
      <p><strong>State:</strong> Telangana</p>
      <p><strong>Message:</strong> Sample description about the mobilization effort.</p>
    </div>
    <div className="gallery-card">
      <img
        src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
        alt="Sample Upload"
      />
      <p><strong>ID:</strong> EMP123</p>
      <p><strong>State:</strong> Telangana</p>
      <p><strong>Message:</strong> Sample description about the mobilization effort.</p>
    </div>
  </div>
</div>

    </div>
  );
}

export default MobilizationGallery;

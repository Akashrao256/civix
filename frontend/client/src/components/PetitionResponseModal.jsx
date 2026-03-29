import { useState } from "react";

export default function PetitionResponseModal({ isOpen, onClose, onSubmit }) {
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!message.trim()) {
      alert("Response message is required");
      return;
    }

    onSubmit(message);
    setMessage("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Respond to Petition</h3>
        <textarea
          rows="5"
          placeholder="Enter your response..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Send Response
          </button>
        </div>
      </div>
    </div>
  );
}
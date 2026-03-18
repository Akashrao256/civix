import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import AppSidebar from "../../components/AppSidebar";

export default function CreatePoll() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        question: "",
        targetLocation: "",
        options: ["", ""] // Start with 2 empty options
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData((prev) => ({ ...prev, options: newOptions }));
    };

    const addOption = () => {
        setFormData((prev) => ({ ...prev, options: [...prev.options, ""] }));
    };

    const removeOption = (indexToRemove) => {
        if (formData.options.length <= 2) return; // Minimum 2 options
        setFormData((prev) => ({
            ...prev,
            options: prev.options.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Filter out empty options
        const filteredOptions = formData.options.filter(opt => opt.trim() !== "");

        if (filteredOptions.length < 2) {
            setError("Please provide at least 2 valid options.");
            setLoading(false);
            return;
        }

        try {
            await API.post("/polls", {
                question: formData.question,
                targetLocation: formData.targetLocation,
                options: filteredOptions
            });
            navigate("/polls");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create poll");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-layout">
            <AppSidebar />
            <div className="app-main">
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <button
                        className="btn-secondary"
                        onClick={() => navigate("/polls")}
                        style={{
                            marginBottom: "24px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "transparent",
                            color: "#64748b",
                            padding: "8px 0",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        <span style={{ fontSize: "18px" }}>←</span> Back to Polls
                    </button>

                    <div className="card" style={{ padding: "40px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9" }}>
                        <div style={{ marginBottom: "32px", borderBottom: "1px solid #e2e8f0", paddingBottom: "20px" }}>
                            <h2 style={{ color: "#0f172a", fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>Create a New Poll</h2>
                            <p style={{ color: "#64748b", fontSize: "15px" }}>Gather feedback from the community on important issues.</p>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div className="form-group">
                                <label>Question</label>
                                <input
                                    type="text"
                                    name="question"
                                    value={formData.question}
                                    onChange={handleChange}
                                    placeholder="e.g., Should we build a new community center?"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Target Location (City, District, etc.)</label>
                                <input
                                    type="text"
                                    name="targetLocation"
                                    value={formData.targetLocation}
                                    onChange={handleChange}
                                    placeholder="e.g., Downtown"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span>Options</span>
                                    <button
                                        type="button"
                                        onClick={addOption}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#2563eb",
                                            cursor: "pointer",
                                            fontWeight: "500"
                                        }}
                                    >
                                        + Add Option
                                    </button>
                                </label>

                                {formData.options.map((option, index) => (
                                    <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            required={index < 2} // First 2 are required visually, API will also validate
                                            style={{ flex: 1, padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#f8fafc", transition: "all 0.2s" }}
                                            onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.background = "#fff"; }}
                                            onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                                        />
                                        {formData.options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeOption(index)}
                                                style={{
                                                    background: "#fef2f2",
                                                    color: "#ef4444",
                                                    border: "1px solid #fecaca",
                                                    borderRadius: "10px",
                                                    width: "46px",
                                                    cursor: "pointer",
                                                    fontSize: "20px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    transition: "all 0.2s"
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; }}
                                                onMouseOut={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; }}
                                                title="Remove Option"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    marginTop: "24px",
                                    padding: "16px",
                                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    opacity: loading ? 0.7 : 1,
                                    transition: "all 0.3s",
                                    boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)"
                                }}
                                onMouseOver={(e) => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
                                onMouseOut={(e) => !loading && (e.currentTarget.style.transform = "translateY(0)")}
                            >
                                {loading ? "Creating Poll..." : "Create Poll"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

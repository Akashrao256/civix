import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import AppSidebar from "../../components/AppSidebar";

const CATEGORIES = ["Infrastructure", "Education", "Health", "Environment", "Safety", "Other"];

export default function CreatePetition() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ title: "", description: "", category: "", location: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.title.trim() || !form.description.trim() || !form.category || !form.location.trim()) {
            setError("All fields are required.");
            return;
        }
        setLoading(true);
        try {
            await API.post("/petitions", form);
            setSuccess(true);
            setTimeout(() => navigate("/petitions"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create petition.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-layout">
            <AppSidebar />
            
            <main className="app-main">
                <header className="page-header">
                    <div>
                        <h1 className="page-title">✍️ Create a Petition</h1>
                        <p className="page-subtitle">Start a campaign for your community</p>
                    </div>
                    <button className="btn btn-ghost" onClick={() => navigate("/petitions")}>
                        ← Back
                    </button>
                </header>

                <div className="cp-form-wrap">
                    {success ? (
                        <div className="cp-success">
                            <div className="cp-success-icon">🎉</div>
                            <h2>Petition Created!</h2>
                            <p>Your petition has been submitted. Redirecting to petitions...</p>
                        </div>
                    ) : (
                        <form className="cp-form" onSubmit={handleSubmit}>
                            {error && <div className="cp-error">⚠️ {error}</div>}

                            <div className="cp-field">
                                <label>Petition Title *</label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Fix the potholes on Main Street"
                                    maxLength={120}
                                />
                                <span className="cp-char">{form.title.length}/120</span>
                            </div>

                            <div className="cp-row">
                                <div className="cp-field">
                                    <label>Category *</label>
                                    <select name="category" value={form.category} onChange={handleChange}>
                                        <option value="">Select a category</option>
                                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="cp-field">
                                    <label>Location *</label>
                                    <input
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Chennai, Tamil Nadu"
                                    />
                                </div>
                            </div>

                            <div className="cp-field">
                                <label>Description *</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={6}
                                    placeholder="Describe the problem and what you'd like officials to do about it..."
                                    maxLength={2000}
                                />
                                <span className="cp-char">{form.description.length}/2000</span>
                            </div>

                            <div className="cp-actions">
                                <button type="button" className="cp-cancel-btn" onClick={() => navigate("/petitions")}>
                                    Cancel
                                </button>
                                <button type="submit" className="cp-submit-btn" disabled={loading}>
                                    {loading ? "⟳ Submitting..." : "🚀 Submit Petition"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}

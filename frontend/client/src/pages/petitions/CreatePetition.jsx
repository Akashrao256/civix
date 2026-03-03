import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = ["Infrastructure", "Education", "Health", "Environment", "Safety", "Other"];

export default function CreatePetition() {
    const { user, logout } = useAuth();
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

    const handleLogout = () => { logout(); navigate("/login"); };

    return (
        <div className="pl-layout">
            {/* Sidebar */}
            <aside className="pl-sidebar">
                <div className="pl-sidebar-brand">
                    <span className="pl-brand-icon">⚖️</span>
                    <div>
                        <h2>Civix</h2>
                        <p>Citizen Portal</p>
                    </div>
                </div>
                <nav className="pl-nav">
                    {[
                        { icon: "⊞", label: "Dashboard", to: "/dashboard" },
                        { icon: "📋", label: "Petitions", to: "/petitions" },
                        { icon: "✍️", label: "Create Petition", to: "/petitions/create" },
                    ].map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) => `pl-nav-item${isActive ? " active" : ""}`}
                        >
                            <span className="pl-nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="pl-sidebar-user">
                    <div className="pl-user-avatar">{user?.fullName?.[0]?.toUpperCase() || "C"}</div>
                    <div className="pl-user-info">
                        <p className="pl-user-name">{user?.fullName || "Citizen"}</p>
                        <p className="pl-user-role">Citizen</p>
                    </div>
                    <button className="pl-logout-icon" onClick={handleLogout} title="Logout">↪</button>
                </div>
            </aside>

            {/* Main */}
            <main className="pl-main">
                <header className="pl-header">
                    <div>
                        <h1 className="pl-header-title">✍️ Create a Petition</h1>
                        <p className="pl-header-sub">Start a campaign for your community</p>
                    </div>
                    <button className="pl-back-btn" onClick={() => navigate("/petitions")}>← Back</button>
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

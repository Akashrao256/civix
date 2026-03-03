import { useEffect, useState } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = ["Infrastructure", "Education", "Health", "Environment", "Safety", "Other"];

export default function EditPetition() {
    const { id } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ title: "", description: "", category: "", location: "" });
    const [original, setOriginal] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await API.get(`/petitions?limit=100`);
                const list = res.data.petitions || [];
                const petition = list.find((p) => p._id === id);
                if (!petition) { setError("Petition not found."); return; }
                if (petition.creator?._id !== user?.id && petition.creator !== user?.id) {
                    setError("You are not authorized to edit this petition."); return;
                }
                if (petition.status === "closed") {
                    setError("This petition is closed and cannot be edited."); return;
                }
                setOriginal(petition);
                setForm({
                    title: petition.title,
                    description: petition.description,
                    category: petition.category,
                    location: petition.location,
                });
            } catch (err) {
                setError("Failed to load petition.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, user]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.title.trim() || !form.description.trim() || !form.category || !form.location.trim()) {
            setError("All fields are required."); return;
        }
        setSaving(true);
        try {
            await API.put(`/petitions/${id}`, form);
            setSuccess(true);
            setTimeout(() => navigate("/petitions"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update petition.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => { logout(); navigate("/login"); };

    return (
        <div className="pl-layout">
            {/* Sidebar */}
            <aside className="pl-sidebar">
                <div className="pl-sidebar-brand">
                    <span className="pl-brand-icon">⚖️</span>
                    <div><h2>Civix</h2><p>Citizen Portal</p></div>
                </div>
                <nav className="pl-nav">
                    {[
                        { icon: "⊞", label: "Dashboard", to: "/dashboard" },
                        { icon: "📋", label: "Petitions", to: "/petitions" },
                        { icon: "✍️", label: "Create Petition", to: "/petitions/create" },
                    ].map((item) => (
                        <NavLink key={item.label} to={item.to}
                            className={({ isActive }) => `pl-nav-item${isActive ? " active" : ""}`}>
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
                        <h1 className="pl-header-title">✏️ Edit Petition</h1>
                        <p className="pl-header-sub">Update your petition details</p>
                    </div>
                    <button className="pl-back-btn" onClick={() => navigate("/petitions")}>← Back</button>
                </header>

                <div className="cp-form-wrap">
                    {loading ? (
                        <div className="pl-loading"><div className="pl-spinner"></div><p>Loading...</p></div>
                    ) : success ? (
                        <div className="cp-success">
                            <div className="cp-success-icon">✅</div>
                            <h2>Petition Updated!</h2>
                            <p>Your changes have been saved. Redirecting...</p>
                        </div>
                    ) : error && !original ? (
                        <div className="cp-error-page">
                            <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
                            <p>{error}</p>
                            <button className="pl-create-btn" onClick={() => navigate("/petitions")}>Go Back</button>
                        </div>
                    ) : (
                        <form className="cp-form" onSubmit={handleSubmit}>
                            {error && <div className="cp-error">⚠️ {error}</div>}

                            <div className="cp-field">
                                <label>Petition Title *</label>
                                <input name="title" value={form.title} onChange={handleChange}
                                    placeholder="e.g. Fix the potholes on Main Street" maxLength={120} />
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
                                    <input name="location" value={form.location} onChange={handleChange}
                                        placeholder="e.g. Chennai, Tamil Nadu" />
                                </div>
                            </div>

                            <div className="cp-field">
                                <label>Description *</label>
                                <textarea name="description" value={form.description} onChange={handleChange}
                                    rows={6} placeholder="Describe the issue..." maxLength={2000} />
                                <span className="cp-char">{form.description.length}/2000</span>
                            </div>

                            <div className="cp-actions">
                                <button type="button" className="cp-cancel-btn" onClick={() => navigate("/petitions")}>
                                    Cancel
                                </button>
                                <button type="submit" className="cp-submit-btn" disabled={saving}>
                                    {saving ? "⟳ Saving..." : "💾 Save Changes"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}

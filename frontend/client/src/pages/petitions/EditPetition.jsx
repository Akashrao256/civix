import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import AppSidebar from "../../components/AppSidebar";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import LoadingState from "../../components/ui/LoadingState";

const CATEGORIES = ["Infrastructure", "Education", "Health", "Environment", "Safety", "Other"];

export default function EditPetition() {
    const { id } = useParams();
    const { user } = useAuth();
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
                const userIdToMatch = user?._id || user?.id;
                if (petition.creator?._id !== userIdToMatch && petition.creator !== userIdToMatch) {
                    setError("You are not authorized to edit this petition."); return;
                }
                if (petition.status !== "pending") {
                    setError("Only pending petitions can be edited."); return;
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

    return (
        <div className="app-layout">
            <AppSidebar />
            <main className="app-main">
                <PageHeader
                    title="✏️ Edit Petition"
                    subtitle="Update your petition details"
                    actions={<Button variant="ghost" onClick={() => navigate("/petitions")}>← Back</Button>}
                />

                <div className="cp-form-wrap">
                    {loading ? (
                        <LoadingState message="Loading petition..." />
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
                            <Button variant="primary" onClick={() => navigate("/petitions")}>Go Back</Button>
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
                                <Button type="button" variant="ghost" className="cp-cancel-btn" onClick={() => navigate("/petitions")}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" className="cp-submit-btn" disabled={saving}>
                                    {saving ? "⟳ Saving..." : "💾 Save Changes"}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}

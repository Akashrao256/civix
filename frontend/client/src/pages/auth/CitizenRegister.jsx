import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function CitizenRegister() {
    const navigate = useNavigate();

    const role = "citizen";

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        location: "",
        department: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            return setError("Passwords do not match.");
        }

        setLoading(true);
        try {
            const payload = {
                fullName: form.fullName,
                email: form.email,
                password: form.password,
                location: form.location,
                role,
            };

            await API.post("/auth/register", payload);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-left">
                <div className="auth-brand">
                    <div className="auth-logo">⚖️</div>
                    <h1>Civix</h1>
                    <p>Digital Civic Engagement & Petition Platform</p>
                </div>

                <div className="auth-feature-list">
                    <div className="auth-feature">🗳️ Create & sign petitions</div>
                    <div className="auth-feature">📊 Vote in public sentiment polls</div>
                    <div className="auth-feature">📍 Geo-targeted community issues</div>
                    <div className="auth-feature">📋 Track official responses</div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-card">

                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join Civix and make your voice count</p>

                    <form onSubmit={handleSubmit} className="auth-form">

                        <div className="form-row">

                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="John Doe"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                        <div className="form-group">
                            <label>Location / City</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. Chennai, Tamil Nadu"
                                value={form.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Repeat your password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? "Creating account..." : "Register as Citizen"}
                        </button>

                    </form>

                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>

                </div>
            </div>
        </div>
    );
}
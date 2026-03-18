import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [role, setRole] = useState("citizen");
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await API.post("/auth/login", { ...form, role });
            login(res.data.user, res.data.token);
            if (res.data.user.role === "official") {
                navigate("/official/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Left Panel */}
            <div className="auth-left">
                <div className="auth-brand">
                    <div className="auth-logo">⚖️</div>
                    <h1>Civix</h1>
                    <p>Digital Civic Engagement &amp; Petition Platform</p>
                </div>
                <div className="auth-feature-list">
                    <div className="auth-feature">🗳️ Create &amp; sign petitions</div>
                    <div className="auth-feature">📊 Vote in public sentiment polls</div>
                    <div className="auth-feature">📍 Geo-targeted community issues</div>
                    <div className="auth-feature">📋 Track official responses</div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="auth-right">
                <div className="auth-card">
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">Sign in to your Civix account</p>

                    {/* Role Selector */}
                    <div className="role-selector">
                        <button
                            type="button"
                            className={`role-btn ${role === "citizen" ? "active" : ""}`}
                            onClick={() => setRole("citizen")}
                        >
                            👤 Citizen
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${role === "official" ? "active" : ""}`}
                            onClick={() => setRole("official")}
                        >
                            🏛️ Official
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
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

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <Link to="/forgot-password" className="auth-forgot-link">
                                Forgot password?
                            </Link>
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? "Signing in..." : `Sign In as ${role === "citizen" ? "Citizen" : "Official"}`}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don&apos;t have an account?{" "}
                        <Link to={role === "official" ? "/register/official" : "/register/citizen"}>Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

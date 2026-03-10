import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            inputRefs.current[5]?.focus();
        }
    };

    const handleStep1 = async (e) => {
        e.preventDefault();
        setError(""); setLoading(true);
        try {
            await API.post("/auth/forgot-password", { email });
            setSuccess("OTP sent to your email.");
            setTimeout(() => setSuccess(""), 3000);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleStep2 = async (e) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length < 6) return setError("Enter all 6 digits.");
        setError(""); setLoading(true);
        try {
            await API.post("/auth/verify-reset-otp", { email, otp: code });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleStep3 = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return setError("Passwords do not match.");
        if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
        setError(""); setLoading(true);
        try {
            await API.post("/auth/reset-password", { email, password: newPassword });
            setSuccess("✅ Password reset successfully! Redirecting...");
            setTimeout(() => navigate("/login", { state: { reset: true } }), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    const stepTitles = ["Forgot Password", "Enter OTP", "New Password"];
    const stepSubs = [
        "Enter your registered email address",
        `We sent a 6-digit code to ${email}`,
        "Choose a strong new password"
    ];

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
                    <div className={`auth-feature fp-step-item ${step >= 1 ? "fp-step-done" : ""}`}>
                        <span className="fp-step-num">1</span> Enter your email
                    </div>
                    <div className={`auth-feature fp-step-item ${step >= 2 ? "fp-step-done" : ""}`}>
                        <span className="fp-step-num">2</span> Verify OTP
                    </div>
                    <div className={`auth-feature fp-step-item ${step >= 3 ? "fp-step-done" : ""}`}>
                        <span className="fp-step-num">3</span> Set new password
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="auth-right">
                <div className="auth-card">
                    {/* Step indicator */}
                    <div className="fp-steps-bar">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`fp-dot ${step >= s ? "active" : ""}`} />
                        ))}
                    </div>

                    <h2 className="auth-title">{stepTitles[step - 1]}</h2>
                    <p className="auth-subtitle">{stepSubs[step - 1]}</p>

                    {success && <div className="auth-success">{success}</div>}
                    {error && <div className="auth-error">{error}</div>}

                    {/* Step 1 */}
                    {step === 1 && (
                        <form onSubmit={handleStep1} className="auth-form">
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        </form>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <form onSubmit={handleStep2} className="auth-form" onPaste={handleOtpPaste}>
                            <div className="otp-grid">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={el => inputRefs.current[i] = el}
                                        className="otp-box"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleOtpChange(i, e.target.value)}
                                        onKeyDown={e => handleOtpKeyDown(i, e)}
                                        autoFocus={i === 0}
                                    />
                                ))}
                            </div>
                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                            <button
                                type="button"
                                className="auth-link-btn"
                                onClick={() => setStep(1)}
                            >
                                ← Change email
                            </button>
                        </form>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                        <form onSubmit={handleStep3} className="auth-form">
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Repeat new password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}

                    <p className="auth-switch">
                        <Link to="/login">← Back to Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

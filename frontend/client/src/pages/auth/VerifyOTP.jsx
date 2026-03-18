import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";

export default function VerifyOTP() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const email = state?.email || "";
    const role = state?.role || "citizen";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const inputRefs = useRef([]);

    useEffect(() => {
        if (!email) navigate("/login");
    }, [email, navigate]);

    useEffect(() => {
        if (countdown > 0) {
            const t = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [countdown]);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length < 6) return setError("Please enter all 6 digits.");
        setError("");
        setLoading(true);
        try {
            await API.post("/auth/register-otp", { email, otp: code });
            setSuccess("✅ Email verified successfully! Redirecting to login...");
            setTimeout(() => navigate("/login", { state: { verified: true } }), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setResending(true);
        setError("");
        try {
            await API.post("/auth/resend-otp", { email });
            setCountdown(60);
            setSuccess("OTP resent to your email.");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setResending(false);
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
                    <div className="auth-feature">🔐 Secure OTP Verification</div>
                    <div className="auth-feature">📧 Code sent to your email</div>
                    <div className="auth-feature">⏱️ Valid for 10 minutes</div>
                    <div className="auth-feature">🔄 Resend if needed</div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="auth-right">
                <div className="auth-card">
                    <div className="otp-icon">✉️</div>
                    <h2 className="auth-title">Verify Your Email</h2>
                    <p className="auth-subtitle">
                        We sent a 6-digit code to<br />
                        <strong style={{ color: "#4f46e5" }}>{email}</strong>
                    </p>

                    {success && <div className="auth-success">{success}</div>}
                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form" onPaste={handlePaste}>
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
                                    onChange={e => handleChange(i, e.target.value)}
                                    onKeyDown={e => handleKeyDown(i, e)}
                                    autoFocus={i === 0}
                                />
                            ))}
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>

                    <div className="otp-resend">
                        {countdown > 0 ? (
                            <p>Resend code in <strong style={{ color: "#4f46e5" }}>{countdown}s</strong></p>
                        ) : (
                            <button
                                className="otp-resend-btn"
                                onClick={handleResend}
                                disabled={resending}
                            >
                                {resending ? "Sending..." : "Resend OTP"}
                            </button>
                        )}
                    </div>

                    <p className="auth-switch">
                        <Link to="/login">← Back to Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

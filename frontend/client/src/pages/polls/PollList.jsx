import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import AppSidebar from "../../components/AppSidebar";

export default function PollList() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            const res = await API.get("/polls");
            setPolls(res.data);
        } catch (err) {
            setError("Failed to load polls. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (pollId, selectedOption) => {
        try {
            await API.post(`/polls/${pollId}/vote`, { selectedOption });
            // Re-fetch to update the UI (could also manually update state for optimist ui)
            alert("Vote submitted successfully!");
            navigate(`/polls/${pollId}/results`);
        } catch (err) {
            alert(err.response?.data?.message || "Error submitting vote");
        }
    };

    return (
        <div className="app-layout">
            <AppSidebar />
            <div className="app-main">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h2>Active Polls</h2>
                    <button className="btn-primary" onClick={() => navigate("/polls/create")}>
                        + Create Poll
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px" }}>Loading polls...</div>
                ) : polls.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px", color: "#64748b", background: "#f8fafc", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                        <p style={{ fontSize: "16px", marginBottom: "16px" }}>No active polls found.</p>
                        <button className="btn-primary" onClick={() => navigate("/polls/create")}>
                            Create the first poll
                        </button>
                    </div>
                ) : (
                    <div className="grid">
                        {polls.map((poll) => (
                            <div key={poll._id} className="card" style={{ display: "flex", flexDirection: "column", padding: "28px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", transition: "transform 0.2s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                                <h3 style={{ marginBottom: "12px", color: "#0f172a", fontSize: "20px", lineHeight: "1.4" }}>{poll.question}</h3>
                                <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "24px", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span>📍</span> {poll.targetLocation}
                                </p>

                                <div style={{ flex: 1, marginBottom: "24px" }}>
                                    {poll.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleVote(poll._id, option)}
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                padding: "14px 16px",
                                                marginBottom: "10px",
                                                border: "1px solid #e2e8f0",
                                                borderRadius: "10px",
                                                background: "#f8fafc",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                color: "#334155",
                                                transition: "all 0.2s",
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.01)"
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.background = "#fff";
                                                e.target.style.borderColor = "#6366f1";
                                                e.target.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.1)";
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.background = "#f8fafc";
                                                e.target.style.borderColor = "#e2e8f0";
                                                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.01)";
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>

                                <div style={{ marginTop: "auto", borderTop: "1px solid #f1f5f9", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <button
                                        onClick={() => navigate(`/polls/${poll._id}/results`)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#6366f1",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            fontSize: "14px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "6px 10px",
                                            borderRadius: "6px",
                                            transition: "background 0.2s"
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = "#eef2ff"}
                                        onMouseOut={(e) => e.currentTarget.style.background = "none"}
                                    >
                                        View Results <span style={{ fontSize: "16px" }}>→</span>
                                    </button>
                                    <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>{poll.options.length} Options</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

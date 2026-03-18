import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import AppSidebar from "../../components/AppSidebar";

export default function PollResults() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pollData, setPollData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchResults();
    }, [id]);

    const fetchResults = async () => {
        try {
            const res = await API.get(`/polls/${id}/results`);
            setPollData(res.data);
        } catch (err) {
            setError("Failed to load poll results.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "40px" }}>Loading results...</div>;
    }

    if (error || !pollData) {
        return (
            <div className="container" style={{ padding: "24px" }}>
                <button className="btn-secondary" onClick={() => navigate("/polls")}>← Back to Polls</button>
                <div className="error-message" style={{ marginTop: "24px" }}>{error || "Poll not found"}</div>
            </div>
        );
    }

    const totalVotes = pollData.results.reduce((sum, item) => sum + item.votes, 0);

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
                        <div style={{ marginBottom: "32px", borderBottom: "1px solid #e2e8f0", paddingBottom: "24px" }}>
                            <div style={{ display: "inline-block", padding: "6px 12px", background: "#f0fdf4", color: "#166534", borderRadius: "20px", fontSize: "12px", fontWeight: "600", marginBottom: "16px" }}>
                                Live Results
                            </div>
                            <h2 style={{ color: "#0f172a", fontSize: "28px", fontWeight: "700", marginBottom: "12px", lineHeight: "1.3" }}>
                                {pollData.question}
                            </h2>
                            <p style={{ color: "#64748b", fontSize: "15px", display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ fontSize: "18px" }}>📊</span> {totalVotes} Total Votes
                            </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            {pollData.results.map((result, index) => {
                                const percentage = totalVotes === 0 ? 0 : Math.round((result.votes / totalVotes) * 100);

                                return (
                                    <div key={index} style={{ padding: "8px 0" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "flex-end" }}>
                                            <span style={{ fontWeight: "600", color: "#1e293b", fontSize: "16px" }}>{result.option}</span>
                                            <div style={{ textAlign: "right" }}>
                                                <div style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700" }}>{percentage}%</div>
                                                <div style={{ color: "#94a3b8", fontSize: "12px", fontWeight: "500" }}>{result.votes} votes</div>
                                            </div>
                                        </div>

                                        {/* Progress bar background */}
                                        <div style={{
                                            width: "100%",
                                            height: "14px",
                                            backgroundColor: "#f1f5f9",
                                            borderRadius: "999px",
                                            overflow: "hidden"
                                        }}>
                                            {/* Progress bar fill */}
                                            <div style={{
                                                height: "100%",
                                                width: `${percentage}%`,
                                                background: "linear-gradient(90deg, #60a5fa, #3b82f6)",
                                                borderRadius: "999px",
                                                transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)"
                                            }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

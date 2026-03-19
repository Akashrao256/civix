import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import AppSidebar from "../../components/AppSidebar";

export default function PollList() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState({});
    useEffect(() => {
        fetchPolls();
    }, []);
    useEffect(() => {
        const savedVotes = JSON.parse(localStorage.getItem("votes")) || {};
        setSelectedOptions(savedVotes);
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
                    <>
                        <style>
                            {`
      .btn-primary {
        background: linear-gradient(135deg, #4f46e5, #6366f1);
        color: white;
        padding: 12px 22px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        transition: 0.3s;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        background: linear-gradient(135deg, #4338ca, #4f46e5);
      }
    `}
                        </style>

                        <button
                            className="btn-primary"
                            onClick={() => navigate("/polls/create")}
                        >
                            Create poll
                        </button>
                    </>
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
                                            onClick={() => {
                                                const previousVote = selectedOptions[poll._id];

                                                // if already voted, don't change highlight
                                                if (previousVote) {
                                                    alert("You've already voted in this poll");
                                                    return;
                                                }
                                                const updatedVotes = {
                                                    ...selectedOptions,
                                                    [poll._id]: option
                                                };

                                                setSelectedOptions(updatedVotes);
                                                localStorage.setItem("votes", JSON.stringify(updatedVotes)); // ✅ SAVE

                                                handleVote(poll._id, option);
                                            }}
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                padding: "14px 16px",
                                                marginBottom: "10px",
                                                borderRadius: "10px",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                transition: "all 0.2s",

                                                background: selectedOptions[poll._id] === option ? "#6366f1" : "#f8fafc",
                                                color: selectedOptions[poll._id] === option ? "#fff" : "#334155",
                                                border: selectedOptions[poll._id] === option ? "1px solid #6366f1" : "1px solid #e2e8f0",
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

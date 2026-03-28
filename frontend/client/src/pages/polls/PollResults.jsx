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
        return (
            <div className="pl-loading">
                <div className="pl-spinner"></div>
                <p>Loading results...</p>
            </div>
        );
    }

    if (error || !pollData) {
        return (
            <div className="app-layout">
                <AppSidebar />
                <div className="app-main">
                    <button className="btn btn-secondary" onClick={() => navigate("/polls")}>← Back to Polls</button>
                    <div className="error-message" style={{ marginTop: "24px" }}>{error || "Poll not found"}</div>
                </div>
            </div>
        );
    }

    const totalVotes = pollData.results.reduce((sum, item) => sum + item.votes, 0);

    return (
        <div className="app-layout">
            <AppSidebar />
            <div className="app-main">
                <div className="poll-results-wrap">
                    <button
                        className="btn btn-ghost"
                        onClick={() => navigate("/polls")}
                        style={{ marginBottom: "18px" }}
                    >
                        ← Back to Polls
                    </button>

                    <div className="card poll-results-card">
                        <div className="poll-results-header">
                            <div className="poll-results-badge">Live Results</div>
                            <h2 className="poll-results-question">
                                {pollData.question}
                            </h2>
                            <p className="poll-results-total">
                                <span>📊</span> {totalVotes} Total Votes
                            </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            {pollData.results.map((result, index) => {
                                const percentage = totalVotes === 0 ? 0 : Math.round((result.votes / totalVotes) * 100);

                                return (
                                    <div key={index} className="poll-result-item">
                                        <div className="poll-result-row">
                                            <span className="poll-result-option">{result.option}</span>
                                            <div className="poll-result-stats">
                                                <div className="poll-result-percent">{percentage}%</div>
                                                <div className="poll-result-votes">{result.votes} votes</div>
                                            </div>
                                        </div>

                                        <div className="poll-progress">
                                            <div className="poll-progress-fill" style={{ width: `${percentage}%` }}></div>
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

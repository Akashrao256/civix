import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import AppSidebar from "../../components/AppSidebar";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";

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
                <PageHeader
                    title="Active Polls"
                    subtitle="Cast your vote or start a new poll for your community."
                    actions={<Button onClick={() => navigate("/polls/create")}>+ Create Poll</Button>}
                />

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <LoadingState message="Loading polls..." />
                ) : polls.length === 0 ? (
                    <EmptyState
                        title="No active polls found"
                        description="Create the first poll to gather public sentiment."
                        action={<Button onClick={() => navigate("/polls/create")}>Create the first poll</Button>}
                    />
                ) : (
                    <div className="poll-grid">
                        {polls.map((poll) => (
                            <div key={poll._id} className="card poll-card">
                                <h3 className="poll-title">{poll.question}</h3>
                                <p className="poll-meta">
                                    <span>📍</span> {poll.targetLocation}
                                </p>

                                <div className="poll-options">
                                    {poll.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            className={`poll-option${selectedOptions[poll._id] === option ? " is-selected" : ""}`}
                                            onClick={() => {
                                                const previousVote = selectedOptions[poll._id];

                                                if (previousVote) {
                                                    alert("You've already voted in this poll");
                                                    return;
                                                }
                                                const updatedVotes = {
                                                    ...selectedOptions,
                                                    [poll._id]: option
                                                };

                                                setSelectedOptions(updatedVotes);
                                                localStorage.setItem("votes", JSON.stringify(updatedVotes));

                                                handleVote(poll._id, option);
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>

                                <div className="poll-footer">
                                    <Button
                                        variant="ghost"
                                        onClick={() => navigate(`/polls/${poll._id}/results`)}
                                    >
                                        View Results →
                                    </Button>
                                    <span className="poll-footer-meta">{poll.options.length} Options</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

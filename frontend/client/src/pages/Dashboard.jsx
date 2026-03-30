import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppSidebar from "../components/AppSidebar";
import StatCard from "../components/StatCard";
import PetitionCard from "../components/PetitionCard";
import Button from "../components/ui/Button";
import SectionHeader from "../components/ui/SectionHeader";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import { useToast } from "../context/ToastContext";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stats, setStats] = useState({ petitions: 0, active: 0, signed: 0 });
  const [petitions, setPetitions] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch first page to display recent petitions (limit=6)
        const petitionsRes = await API.get("/petitions?limit=6");
        const list = petitionsRes.data.petitions || [];
        setPetitions(list);

        // Fetch active count separately (all active petitions, no page limit)
        const activeRes = await API.get("/petitions?status=active&limit=1");
        const totalActive = activeRes.data.total || 0;

        setStats({
          petitions: petitionsRes.data.total || list.length,
          active: totalActive,
          signed: list.reduce((sum, p) => sum + (p.signatureCount || 0), 0),
        });

        const pollsRes = await API.get("/polls?limit=3");
        setPolls(pollsRes.data.slice(0, 3)); // in case limit is not respected by backend
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (petitionId) => {
    if (!window.confirm("Are you sure you want to delete this petition?")) return;
    try {
      const reason = window.prompt("Optional: provide a reason for deletion (visible to admins)") || "";
      await API.delete(`/petitions/${petitionId}`, { data: { reason } });
      setPetitions((prev) => prev.filter((p) => p._id !== petitionId));
      setStats((prev) => ({ ...prev, petitions: prev.petitions - 1 }));
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to delete petition.", "error");
    }
  };

  const handleSign = async (petitionId) => {
    try {
      const res = await API.post(`/petitions/${petitionId}/sign`);
      // Update the signed petition in the list
      setPetitions((prev) => 
        prev.map((p) => {
          if (p._id === petitionId) {
            return {
              ...p,
              hasSigned: true,
              signatureCount: res.data.signatureCount
            };
          }
          return p;
        })
      );
      // Update overall stats
      setStats((prev) => ({ ...prev, signed: prev.signed + 1 }));
      showToast("Petition signed successfully!");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to sign petition.", "error");
    }
  };

  return (
    <div className="app-layout">
      <AppSidebar />

      <div className="app-main">
        <div className="welcome-banner">
          <div>
            <h2>Welcome Back, {user?.fullName?.split(" ")[0] || "Citizen"} 👋</h2>
            <p>Manage petitions and stay updated with community activities.</p>
          </div>
          <Button variant="secondary" onClick={() => navigate("/petitions/create")}>
            + Add Petition
          </Button>
        </div>

        <div className="stats">
          <StatCard title="Total Petitions" value={stats.petitions} />
          <StatCard title="Active Petitions" value={stats.active} />
          <StatCard title="Total Signatures" value={stats.signed} />
        </div>

        <SectionHeader
          title="Recent Petitions"
          action={petitions.length > 0 ? (
            <Button variant="ghost" onClick={() => navigate("/petitions")}>View All Petitions →</Button>
          ) : null}
        />
        {loading ? (
          <LoadingState message="Loading petitions..." />
        ) : petitions.length === 0 ? (
          <EmptyState
            title="No petitions yet"
            description="Start your first petition to gather support from your community."
            action={<Button onClick={() => navigate("/petitions/create")}>Create the first one</Button>}
          />
        ) : (
          <div className="grid">
            {petitions.map((p, i) => (
              <PetitionCard 
                key={p._id} 
                petition={p} 
                currentUser={user} 
                index={i} 
                onSign={handleSign} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <SectionHeader
          title="Recent Polls"
          action={<Button variant="ghost" onClick={() => navigate("/polls")}>View All Polls →</Button>}
        />

        {loading ? (
          <LoadingState message="Loading polls..." />
        ) : polls.length === 0 ? (
          <EmptyState title="No polls available" description="New polls will appear here when created." />
        ) : (
          <div className="grid">
            {polls.map((poll) => (
              <button
                key={poll._id}
                className="card poll-preview"
                onClick={() => navigate(`/polls/${poll._id}/results`)}
                type="button"
              >
                <h4>{poll.question}</h4>
                <p className="poll-preview-meta">
                  📍 {poll.targetLocation}
                </p>
                <div className="poll-preview-link">
                  {poll.options.length} Options available →
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppSidebar from "../components/AppSidebar";
import StatCard from "../components/StatCard";
import PetitionCard from "../components/PetitionCard";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ petitions: 0, active: 0, signed: 0 });
  const [petitions, setPetitions] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const petitionsRes = await API.get("/petitions?limit=6");
        const list = petitionsRes.data.petitions || [];
        setPetitions(list);
        setStats({
          petitions: petitionsRes.data.total || list.length,
          active: list.filter((p) => p.status === "active").length,
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

  return (
    <div className="app-layout">
      <AppSidebar />

      <div className="app-main">
        <div className="welcome-banner">
          <div>
            <h2>Welcome Back, {user?.fullName?.split(" ")[0] || "Citizen"} 👋</h2>
            <p>Manage petitions and stay updated with community activities.</p>
          </div>
          <button className="add-petition-btn" onClick={() => navigate("/petitions/create")}>
            + Add Petition
          </button>
        </div>

        <div className="stats">
          <StatCard title="Total Petitions" value={stats.petitions} />
          <StatCard title="Active Petitions" value={stats.active} />
          <StatCard title="Total Signatures" value={stats.signed} />
        </div>

        <h3>Recent Petitions</h3>
        {loading ? (
          <div className="pl-loading">
            <div className="pl-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : petitions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
            <p>No petitions yet.</p>
            <button className="add-petition-btn" onClick={() => navigate("/petitions/create")}
              style={{ marginTop: 12, display: "inline-block" }}>
              Create the first one
            </button>
          </div>
        ) : (
          <div className="grid">
            {petitions.map((p, i) => (
              <PetitionCard key={p._id} petition={p} currentUser={user} index={i} />
            ))}
          </div>
        )}

        {petitions.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 8, marginBottom: 32 }}>
            <button className="add-petition-btn"
              style={{ background: "#334155", color: "#fff" }}
              onClick={() => navigate("/petitions")}>
              View All Petitions →
            </button>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "32px", marginBottom: "16px" }}>
          <h3>Recent Polls</h3>
          <button className="add-petition-btn" onClick={() => navigate("/polls")} style={{ fontSize: "14px", padding: "8px 16px" }}>
            View All Polls →
          </button>
        </div>

        {loading ? (
          <div className="pl-loading">
            <div className="pl-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : polls.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: "#64748b", background: "#f8fafc", borderRadius: "8px" }}>
            <p>No polls available.</p>
          </div>
        ) : (
          <div className="grid">
            {polls.map((poll) => (
              <div key={poll._id} className="card" onClick={() => navigate(`/polls/${poll._id}/results`)} style={{ cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                <h4 style={{ color: "#1e293b", marginBottom: "12px", fontSize: "1.1rem" }}>{poll.question}</h4>
                <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
                  📍 {poll.targetLocation}
                </p>
                <div style={{ marginTop: "16px", color: "#3b82f6", fontSize: "0.875rem", fontWeight: "500" }}>
                  {poll.options.length} Options available →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
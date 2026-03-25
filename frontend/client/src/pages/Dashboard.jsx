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
      await API.delete(`/petitions/${petitionId}`);
      setPetitions((prev) => prev.filter((p) => p._id !== petitionId));
      setStats((prev) => ({ ...prev, petitions: prev.petitions - 1 }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete petition.");
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
      alert(`✍️ Petition signed successfully!`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to sign petition.");
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
          <button className="add-petition-btn" onClick={() => navigate("/petitions/create")}>
            + Add Petition
          </button>
        </div>

        <div className="stats">
          <StatCard title="Total Petitions" value={stats.petitions} />
          <StatCard title="Active Petitions" value={stats.active} />
          <StatCard title="Total Signatures" value={stats.signed} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "32px", marginBottom: "16px" }}>
          <h3 style={{ margin: 0 }}>Recent Petitions</h3>
          {petitions.length > 0 && (
            <button className="add-petition-btn" onClick={() => navigate("/petitions")} style={{ fontSize: "14px", padding: "8px 16px" }}>
              View All Petitions →
            </button>
          )}
        </div>
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
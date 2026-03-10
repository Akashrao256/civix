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
      </div>
    </div>
  );
}
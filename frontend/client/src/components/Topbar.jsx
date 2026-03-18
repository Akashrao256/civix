import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="topbar">
      <h3>Dashboard Overview</h3>
      <div className="topbar-right">
        <span className="topbar-user">
          {user?.role === "official" ? "🏛️" : "👤"} {user?.fullName || "User"}
          {user?.role === "official" && (
            <span className="topbar-badge">Official</span>
          )}
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
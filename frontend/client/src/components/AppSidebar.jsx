import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CITIZEN_NAV = [
    { icon: "⊞", label: "Dashboard", to: "/dashboard" },
    { icon: "📋", label: "Petitions", to: "/petitions" },
    { icon: "✍️", label: "Create Petition", to: "/petitions/create" },
    { icon: "📊", label: "Polls", to: "/polls" },
    { icon: "📝", label: "Create Poll", to: "/polls/create" },
];

const OFFICIAL_NAV = [
    { icon: "⊞", label: "Dashboard", to: "/official/dashboard" },
];

export default function AppSidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isOfficial = user?.role === "official";
    const navItems = isOfficial ? OFFICIAL_NAV : CITIZEN_NAV;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="app-sidebar">
            {/* Brand */}
            <div className="app-sidebar-brand">
                <span className="app-brand-icon">⚖️</span>
                <div>
                    <h2>Civix</h2>
                    <p>{isOfficial ? "Official Portal" : "Citizen Portal"}</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="app-sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        className={({ isActive }) =>
                            `app-nav-item${isActive ? " active" : ""}`
                        }
                    >
                        <span className="app-nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User / Logout */}
            <div className="app-sidebar-user">
                <div className="app-user-avatar">
                    {user?.fullName?.[0]?.toUpperCase() || (isOfficial ? "O" : "C")}
                </div>
                <div className="app-user-info">
                    <p className="app-user-name">{user?.fullName || "User"}</p>
                    <p className="app-user-role">
                        {isOfficial ? "Government Official" : "Citizen"}
                    </p>
                </div>
                <button
                    className="app-logout-icon"
                    onClick={handleLogout}
                    title="Logout"
                >
                    ↪
                </button>
            </div>
        </aside>
    );
}

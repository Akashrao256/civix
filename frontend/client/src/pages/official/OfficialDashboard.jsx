import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const STATUS_COLORS = {
  active: { bg: "#dcfce7", color: "#16a34a", dot: "#22c55e" },
  under_review: { bg: "#fef9c3", color: "#b45309", dot: "#f59e0b" },
  closed: { bg: "#fee2e2", color: "#dc2626", dot: "#ef4444" },
};
const STATUS_LABELS = {
  active: "Active",
  under_review: "Under Review",
  closed: "Closed",
};

const CATEGORIES = ["All", "Infrastructure", "Education", "Health", "Environment", "Safety", "Other"];
const STATUSES = ["All", "Active", "Under Review", "Closed"];

export default function OfficialDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [petitions, setPetitions] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, review: 0, closed: 0 });
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [search, setSearch] = useState("");
    const [updating, setUpdating] = useState(null);
    const [toast, setToast] = useState(null);
    const [activeNav, setActiveNav] = useState("Dashboard");

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchPetitions = async () => {
        try {
            setLoading(true);
            const res = await API.get("/petitions?limit=100");
            const list = res.data.petitions || [];
            setPetitions(list);
            setStats({
                total: list.length,
                active: list.filter(p => p.status === "Active").length,
                review: list.filter(p => p.status === "Under Review").length,
                closed: list.filter(p => p.status === "Closed").length,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPetitions(); }, []);

    const handleStatusChange = async (petitionId, newStatus) => {
        setUpdating(petitionId);
        try {
            await API.patch(`/petitions/${petitionId}/status`, { status: newStatus });
            setPetitions(prev =>
                prev.map(p => p._id === petitionId ? { ...p, status: newStatus } : p)
            );
            setStats(prev => {
    const oldPetition = petitions.find(p => p._id === petitionId);
    if (!oldPetition) return prev;

    const updated = { ...prev };

    if (oldPetition.status !== newStatus) {

        if (oldPetition.status === "active" && updated.active > 0)
            updated.active--;

        if (oldPetition.status === "under_review" && updated.review > 0)
            updated.review--;

        if (oldPetition.status === "closed" && updated.closed > 0)
            updated.closed--;

        if (newStatus === "active")
            updated.active++;

        if (newStatus === "under_review")
            updated.review++;

        if (newStatus === "closed")
            updated.closed++;
    }

    return updated;
});
            showToast("Petition status updated successfully!");
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to update status.", "error");
        } finally {
            setUpdating(null);
        }
    };

    const handleLogout = () => { logout(); navigate("/login"); };

    const filtered = petitions.filter(p => {
        const matchCat = filterCategory === "All" || p.category === filterCategory;
        const matchStatus = filterStatus === "All" || p.status === filterStatus;
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.location?.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchStatus && matchSearch;
    });

    const navItems = [
        { icon: "⊞", label: "Dashboard" },
        { icon: "📋", label: "Petitions" },
        { icon: "📊", label: "Analytics" },
        { icon: "👥", label: "Citizens" },
        { icon: "⚙️", label: "Settings" },
    ];

    return (
        <div className="od-layout">
            {/* Toast */}
            {toast && (
                <div className={`od-toast ${toast.type === "error" ? "od-toast-error" : ""}`}>
                    {toast.type === "error" ? "❌" : "✅"} {toast.message}
                </div>
            )}

            {/* Sidebar */}
            <aside className="od-sidebar">
                <div className="od-sidebar-brand">
                    <span className="od-brand-icon">⚖️</span>
                    <div>
                        <h2>Civix</h2>
                        <p>Official Portal</p>
                    </div>
                </div>

                <nav className="od-nav">
                    {navItems.map(item => (
                        <button
                            key={item.label}
                            className={`od-nav-item ${activeNav === item.label ? "active" : ""}`}
                            onClick={() => setActiveNav(item.label)}
                        >
                            <span className="od-nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="od-sidebar-user">
                    <div className="od-user-avatar">
                        {user?.fullName?.[0]?.toUpperCase() || "O"}
                    </div>
                    <div className="od-user-info">
                        <p className="od-user-name">{user?.fullName || "Official"}</p>
                        <p className="od-user-role">Government Official</p>
                    </div>
                    <button className="od-logout-icon" onClick={handleLogout} title="Logout">↪</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="od-main">
                {/* Header */}
                <header className="od-header">
                    <div>
                        <h1 className="od-header-title">Official Dashboard</h1>
                        <p className="od-header-sub">Manage and respond to citizen petitions</p>
                    </div>
                    <div className="od-header-right">
                        <div className="od-official-badge">
                            <span>🏛️</span> {user?.location || "Government"}
                        </div>
                        <div className="od-time">
                            {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                        </div>
                    </div>
                </header>

                {/* Stats */}
                <div className="od-stats">
                    {[
                        { label: "Total Petitions", value: stats.total, icon: "📋", gradient: "od-grad-blue" },
                        { label: "Active", value: stats.active, icon: "🔥", gradient: "od-grad-green" },
                        { label: "Under Review", value: stats.review, icon: "🔍", gradient: "od-grad-yellow" },
                        { label: "Closed", value: stats.closed, icon: "✅", gradient: "od-grad-red" },
                    ].map((s, i) => (
                        <div key={i} className={`od-stat-card ${s.gradient}`} style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="od-stat-icon">{s.icon}</div>
                            <div className="od-stat-value">{s.value}</div>
                            <div className="od-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="od-filters">
                    <div className="od-search-wrap">
                        <span className="od-search-icon">🔍</span>
                        <input
                            className="od-search"
                            placeholder="Search by title or location..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select className="od-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <select className="od-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <div className="od-filter-count">{filtered.length} petition{filtered.length !== 1 ? "s" : ""}</div>
                </div>

                {/* Petitions Table */}
                <div className="od-table-wrap">
                    {loading ? (
                        <div className="od-loading">
                            <div className="od-spinner"></div>
                            <p>Loading petitions...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="od-empty">
                            <p>📭 No petitions found matching your filters.</p>
                        </div>
                    ) : (
                        <table className="od-table">
                            <thead>
                                <tr>
                                    <th>Petition</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Signatures</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p, i) => {
                                    const sc = STATUS_COLORS[p.status] || STATUS_COLORS["Active"];
                                    return (
                                        <tr key={p._id} className="od-table-row" style={{ animationDelay: `${i * 0.04}s` }}>
                                            <td>
                                                <div className="od-petition-title">{p.title}</div>
                                                <div className="od-petition-desc">{p.description?.slice(0, 70)}{p.description?.length > 70 ? "..." : ""}</div>
                                            </td>
                                            <td>
                                                <span className="od-category-tag">{p.category}</span>
                                            </td>
                                            <td>
                                                <span className="od-location">📍 {p.location}</span>
                                            </td>
                                            <td>
                                                <span className="od-sig-count">✍️ {p.signatureCount ?? 0}</span>
                                            </td>
                                            <td>
                                                <span className="od-status-badge" style={{ background: sc.bg, color: sc.color }}>
                                                    <span className="od-status-dot" style={{ background: sc.dot }}></span>
                                                    {STATUS_LABELS[p.status]}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    className="od-action-select"
                                                    value={p.status}
                                                    disabled={updating === p._id}
                                                    onChange={e => handleStatusChange(p._id, e.target.value)}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="under_review">Under Review</option>
                                                    <option value="closed">Closed</option>
                                                </select>
                                                {updating === p._id && <span className="od-updating">⟳</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}

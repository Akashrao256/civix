import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import AppSidebar from "../../components/AppSidebar";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";

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
const STATUSES = ["All", "active", "under_review", "closed"];
const FILTER_STATUS_LABELS = { All: "All", active: "Active", under_review: "Under Review", closed: "Closed" };

export default function OfficialDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [petitions, setPetitions] = useState([]);
    const [pendingOfficials, setPendingOfficials] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, review: 0, closed: 0 });
    const [loading, setLoading] = useState(true);
    const [pendingLoading, setPendingLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [search, setSearch] = useState("");
    const [useLocationFilter, setUseLocationFilter] = useState(false);
    const [updating, setUpdating] = useState(null);
    const [approvingOfficialId, setApprovingOfficialId] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchPetitions = async () => {
        try {
            setLoading(true);
            const userLoc = user?.location ? encodeURIComponent(user.location) : "";
            const url = userLoc && useLocationFilter
                ? `/petitions?limit=100&location=${userLoc}`
                : "/petitions?limit=100";
            const res = await API.get(url);
            const list = res.data.petitions || [];
            setPetitions(list);
            setStats({
                total: list.length,
                active: list.filter(p => p.status === "active").length,
                review: list.filter(p => p.status === "under_review").length,
                closed: list.filter(p => p.status === "closed").length,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingOfficials = async () => {
        try {
            setPendingLoading(true);
            const res = await API.get("/admin/pending-officials");
            setPendingOfficials(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || "Failed to load pending officials.", "error");
        } finally {
            setPendingLoading(false);
        }
    };

    useEffect(() => { fetchPetitions(); }, [user?.location, useLocationFilter]);
    useEffect(() => { fetchPendingOfficials(); }, []);

    const handleAddResponse = async (petitionId) => {
        const message = window.prompt("Enter your official response to this petition:");
        if (!message || !message.trim()) return;
        setUpdating(petitionId);
        try {
            await API.post(`/petitions/${petitionId}/respond`, { message: message.trim() });
            showToast("✅ Response added successfully!");
            fetchPetitions();
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to add response.", "error");
        } finally {
            setUpdating(null);
        }
    };

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
                    if (oldPetition.status === "active" && updated.active > 0) updated.active--;
                    if (oldPetition.status === "under_review" && updated.review > 0) updated.review--;
                    if (oldPetition.status === "closed" && updated.closed > 0) updated.closed--;
                    if (newStatus === "active") updated.active++;
                    if (newStatus === "under_review") updated.review++;
                    if (newStatus === "closed") updated.closed++;
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

    const handleApproveOfficial = async (officialId, officialName) => {
        setApprovingOfficialId(officialId);
        try {
            await API.put(`/admin/approve-official/${officialId}`);
            setPendingOfficials(prev => prev.filter(official => official._id !== officialId));
            showToast(`${officialName || "Official"} approved successfully!`);
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to approve official.", "error");
        } finally {
            setApprovingOfficialId(null);
        }
    };

    const formatResponseDate = (timestamp) => {
        if (!timestamp) return "Date unavailable";
        return new Date(timestamp).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filtered = petitions.filter(p => {
        const matchCat = filterCategory === "All" || p.category === filterCategory;
        const matchStatus = filterStatus === "All" || p.status === filterStatus;
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.location?.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchStatus && matchSearch;
    });

    return (
        <div className="app-layout">
            {/* Toast */}
            {toast && (
                <div className={`od-toast ${toast.type === "error" ? "od-toast-error" : ""}`}>
                    {toast.type === "error" ? "❌" : "✅"} {toast.message}
                </div>
            )}

            <AppSidebar />

            {/* Main Content */}
            <main className="app-main">
                {/* Header */}
                <PageHeader
                    title="Official Dashboard"
                    subtitle="Manage and respond to citizen petitions"
                    className="od-header"
                    actions={(
                        <div className="od-header-right">
                            <div className="od-official-badge">
                                <span>🏛️</span> {user?.location || "Government"}
                            </div>
                            <div className="od-time">
                                {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                            </div>
                        </div>
                    )}
                />

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
                <div className="pl-filters">
                    <div className="pl-search-wrap">
                        <span className="pl-search-icon">🔍</span>
                        <input
                            className="pl-search"
                            placeholder="Search by title or location..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <label className="od-filter-toggle">
                        <input
                            type="checkbox"
                            checked={useLocationFilter}
                            onChange={(e) => setUseLocationFilter(e.target.checked)}
                        />
                        Only my location
                    </label>
                    <select className="pl-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select className="pl-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        {STATUSES.map(s => <option key={s} value={s}>{FILTER_STATUS_LABELS[s]}</option>)}
                    </select>
                    {!loading && (
                        <span className="pl-count-badge">
                            {filtered.length} petition{filtered.length !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {/* Pending Officials */}
                <section className="od-pending-wrap">
                    <div className="od-pending-header">
                        <div>
                            <h3 className="od-pending-title">Pending Official Approvals</h3>
                            <p className="od-pending-subtitle">Review newly registered officials and approve verified requests.</p>
                        </div>
                        {!pendingLoading && (
                            <span className="od-pending-count">
                                {pendingOfficials.length} pending
                            </span>
                        )}
                    </div>

                    {pendingLoading ? (
                        <LoadingState message="Loading pending officials..." />
                    ) : pendingOfficials.length === 0 ? (
                        <EmptyState
                            title="No pending officials"
                            description="All official registrations are up to date right now."
                        />
                    ) : (
                        <div className="od-pending-table-wrap">
                            <table className="od-pending-table">
                                <thead>
                                    <tr>
                                        <th>Official</th>
                                        <th>Email</th>
                                        <th>Location</th>
                                        <th>Registered On</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingOfficials.map((official, i) => (
                                        <tr key={official._id} className="od-table-row" style={{ animationDelay: `${i * 0.04}s` }}>
                                            <td>
                                                <div className="od-petition-title">{official.fullName}</div>
                                            </td>
                                            <td>
                                                <span className="od-location">{official.email}</span>
                                            </td>
                                            <td>
                                                <span className="od-location">📍 {official.location}</span>
                                            </td>
                                            <td>
                                                <span className="od-location">
                                                    {official.createdAt
                                                        ? new Date(official.createdAt).toLocaleDateString("en-IN")
                                                        : "N/A"}
                                                </span>
                                            </td>
                                            <td>
                                                <Button
                                                    className="od-approve-btn"
                                                    disabled={approvingOfficialId === official._id}
                                                    onClick={() => handleApproveOfficial(official._id, official.fullName)}
                                                >
                                                    {approvingOfficialId === official._id ? "Approving..." : "Approve"}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Petitions Table */}
                <div className="od-table-wrap">
                    {loading ? (
                        <LoadingState message="Loading petitions..." />
                    ) : filtered.length === 0 ? (
                        <EmptyState title="No petitions found" description="Try changing filters or disable location-only mode." />
                    ) : (
                        <table className="od-table">
                            <thead>
                                <tr>
                                    <th>Petition</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Signatures</th>
                                    <th>Responses</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p, i) => {
                                    const statusKey = (p.status || "").toLowerCase().replace(/\s+/g, "_");
                                    const sc = STATUS_COLORS[statusKey] || STATUS_COLORS.active;
                                    const statusLabel = STATUS_LABELS[statusKey] || p.status || "Unknown";
                                    const responseList = Array.isArray(p.responses)
                                        ? [...p.responses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                        : [];
                                    const previewResponses = responseList.slice(0, 2);
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
                                                {previewResponses.length ? (
                                                    <div className="od-response-stack">
                                                        {previewResponses.map((response, idx) => {
                                                            const previewMessage = response.message && response.message.length > 160
                                                                ? `${response.message.slice(0, 160)}…`
                                                                : response.message;
                                                            return (
                                                            <div
                                                                key={response._id || `${p._id}-response-${idx}`}
                                                                className="od-response-item"
                                                            >
                                                                    <p className="od-response-message">{previewMessage || "--"}</p>
                                                                    <div className="od-response-meta">
                                                                        <span>{response.respondedBy?.fullName || "Official"}</span>
                                                                        <span>{formatResponseDate(response.createdAt)}</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                        {responseList.length > 2 && (
                                                            <button
                                                                type="button"
                                                                className="od-response-view"
                                                                onClick={() => navigate(`/petitions/${p._id}`)}
                                                            >
                                                                View all {responseList.length}
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="od-response-empty">No responses yet</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className="od-status-badge" style={{ background: sc.bg, color: sc.color }}>
                                                    <span className="od-status-dot" style={{ background: sc.dot }}></span>
                                                    {statusLabel}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="od-action-row">
                                                    <select
                                                        className="od-action-select"
                                                        value={p.status}
                                                        disabled={updating === p._id || p.status === "closed"}
                                                        onChange={e => handleStatusChange(p._id, e.target.value)}
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="under_review">Under Review</option>
                                                        <option value="closed">Closed</option>
                                                    </select>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => handleAddResponse(p._id)}
                                                        disabled={updating === p._id}
                                                        className="od-action-btn"
                                                    >
                                                        💬 Respond
                                                    </Button>
                                                    {updating === p._id && <span className="od-updating">⟳</span>}
                                                </div>
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

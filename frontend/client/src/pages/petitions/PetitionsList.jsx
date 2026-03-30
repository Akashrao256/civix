import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import PetitionCard from "../../components/PetitionCard";
import AppSidebar from "../../components/AppSidebar";
import { City } from "country-state-city";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";

const CATEGORIES = ["All", "Infrastructure", "Education", "Health", "Environment", "Safety", "Other"];
const STATUSES = ["All", "pending", "active", "under_review", "closed"];
const STATUS_LABELS = { All: "All", pending: "Pending", active: "Active", under_review: "Under Review", closed: "Closed" };

export default function PetitionsList() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [petitions, setPetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [signing, setSigning] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [toast, setToast] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [status, setStatus] = useState("All");
    const [location, setLocation] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const fetchPetitions = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 9 });
            if (category !== "All") params.append("category", category);
            if (status !== "All") params.append("status", status);
            if (location.trim()) params.append("location", location.trim());
            if (debouncedSearch) params.append("q", debouncedSearch);

            const res = await API.get(`/petitions?${params.toString()}`);
            const list = res.data.petitions || [];

            setPetitions(list);
            setTotalCount(res.data.total || list.length);
            setTotalPages(res.data.totalPages || 1);

        } catch (err) {
            console.error(err);
            showToast("Failed to load petitions.", "error");
        } finally {
            setLoading(false);
        }
    }, [page, category, status, location, debouncedSearch]);

    useEffect(() => {
        fetchPetitions();
    }, [fetchPetitions]);

    const handleSign = async (petitionId) => {
        if (!user) { navigate("/login"); return; }
        setSigning(petitionId);
        try {
            const res = await API.post(`/petitions/${petitionId}/sign`);
            showToast(`✍️ Petition signed! Total signatures: ${res.data.signatureCount}`);
            fetchPetitions();
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to sign petition.", "error");
        } finally {
            setSigning(null);
        }
    };

    const handleDelete = async (petitionId) => {
        if (!window.confirm("Are you sure you want to delete this petition?")) return;
        const reason = window.prompt("Optional: provide a reason for deletion (visible to admins)") || "";
        setDeletingId(petitionId);
        try {
            await API.delete(`/petitions/${petitionId}`, { data: { reason } });
            showToast("🗑️ Petition deleted successfully!");
            fetchPetitions();
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to delete petition.", "error");
        } finally {
            setDeletingId(null);
        }
    };

    const resetFilters = () => {
        setSearch(""); setCategory("All"); setStatus("All"); setLocation(""); setPage(1);
    };

    const cities = City.getCitiesOfCountry("IN");

    return (
        <div className="app-layout">
            {/* Toast */}
            {toast && (
                <div className={`pl-toast ${toast.type === "error" ? "pl-toast-error" : ""}`}>
                    {toast.message}
                </div>
            )}

            <AppSidebar />

            {/* Main */}
            <main className="app-main">
                {/* Header */}
                <PageHeader
                    title="📋 Petitions"
                    subtitle="Browse, filter, and sign community petitions"
                    actions={<Button onClick={() => navigate("/petitions/create")}>+ Create Petition</Button>}
                />

                {/* Filters */}
                <div className="pl-filters">
                    <div className="pl-search-wrap">
                        <span className="pl-search-icon">🔍</span>
                        <input
                            className="pl-search"
                            placeholder="Search petitions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select className="pl-select" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select className="pl-select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                        {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>

                    <select
                        className="pl-select"
                        value={location}
                        onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                    >
                        <option value="">All Cities</option>
                        {cities.map((city, index) => (
                            <option key={`${city.name}-${index}`} value={city.name}>
                                {city.name}
                            </option>
                        ))}
                    </select>

                    <Button variant="secondary" className="pl-reset-btn" onClick={resetFilters}>✕ Reset</Button>

                    {!loading && (
                        <span className="pl-count-badge">
                            {totalCount} petition{totalCount !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {/* Grid */}
                {loading ? (
                    <LoadingState message="Loading petitions..." />
                ) : petitions.length === 0 ? (
                    <EmptyState
                        title="No petitions found"
                        description="Try changing your filters or create a new petition."
                        action={<Button onClick={() => navigate("/petitions/create")}>Be the first to create one</Button>}
                    />
                ) : (
                    <div className="pl-grid">
                        {petitions.map((p, i) => (
                            <PetitionCard
                                key={p._id}
                                petition={p}
                                currentUser={user}
                                onSign={handleSign}
                                signing={signing === p._id}
                                onDelete={handleDelete}
                                deleting={deletingId === p._id}
                                index={i}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pl-pagination">
                        <Button
                            variant="secondary"
                            className="pl-page-btn"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            ← Prev
                        </Button>
                        <span className="pl-page-info">Page {page} of {totalPages}</span>
                        <Button
                            variant="secondary"
                            className="pl-page-btn"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next →
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}

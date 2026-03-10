import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import PetitionCard from "../../components/PetitionCard";
import AppSidebar from "../../components/AppSidebar";
import { City } from "country-state-city";

const CATEGORIES = ["All", "Infrastructure", "Education", "Health", "Environment", "Safety", "Other"];
const STATUSES = ["All", "active", "under_review", "closed"];
const STATUS_LABELS = { All: "All", active: "Active", under_review: "Under Review", closed: "Closed" };

export default function PetitionsList() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [petitions, setPetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [signing, setSigning] = useState(null);
    const [toast, setToast] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [status, setStatus] = useState("All");
    const [location, setLocation] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchPetitions = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 9 });
            if (category !== "All") params.append("category", category);
            if (status !== "All") params.append("status", status);
            if (location.trim()) params.append("location", location.trim());

            const res = await API.get(`/petitions?${params.toString()}`);
            let list = res.data.petitions || [];

            if (search.trim()) {
                const q = search.toLowerCase();
                list = list.filter(
                    (p) =>
                        p.title.toLowerCase().includes(q) ||
                        p.description.toLowerCase().includes(q)
                );
            }

            setPetitions(list);
            setTotalCount(list.length);
            setTotalPages(res.data.totalPages || 1);

        } catch (err) {
            console.error(err);
            showToast("Failed to load petitions.", "error");
        } finally {
            setLoading(false);
        }
    }, [page, category, status, location, search]);

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
                <header className="pl-header">
                    <div>
                        <h1 className="pl-header-title">📋 Petitions</h1>
                        <p className="pl-header-sub">Browse, filter, and sign community petitions</p>
                    </div>
                    <button className="pl-create-btn" onClick={() => navigate("/petitions/create")}>
                        + Create Petition
                    </button>
                </header>

                {/* Filters */}
                <div className="pl-filters">
                    <div className="pl-search-wrap">
                        <span className="pl-search-icon">🔍</span>
                        <input
                            className="pl-search"
                            placeholder="Search petitions..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
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

                    <button className="pl-reset-btn" onClick={resetFilters}>✕ Reset</button>

                    {!loading && (
                        <span className="pl-count-badge">
                            {totalCount} petition{totalCount !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="pl-loading">
                        <div className="pl-spinner"></div>
                        <p>Loading petitions...</p>
                    </div>
                ) : petitions.length === 0 ? (
                    <div className="pl-empty">
                        <div className="pl-empty-icon">📭</div>
                        <p>No petitions found.</p>
                        <button className="pl-create-btn" onClick={() => navigate("/petitions/create")}>
                            Be the first to create one
                        </button>
                    </div>
                ) : (
                    <div className="pl-grid">
                        {petitions.map((p, i) => (
                            <PetitionCard
                                key={p._id}
                                petition={p}
                                currentUser={user}
                                onSign={handleSign}
                                signing={signing === p._id}
                                index={i}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pl-pagination">
                        <button
                            className="pl-page-btn"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            ← Prev
                        </button>
                        <span className="pl-page-info">Page {page} of {totalPages}</span>
                        <button
                            className="pl-page-btn"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

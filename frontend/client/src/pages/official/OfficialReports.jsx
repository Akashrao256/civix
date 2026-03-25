import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import AppSidebar from "../../components/AppSidebar";

const PETITION_CARDS = (report) => [
    { label: "Total Petitions",    value: report.totalPetitions,      icon: "📋", gradient: "linear-gradient(135deg, #6366f1, #4f46e5)" },
    { label: "Active Petitions",   value: report.activePetitions,     icon: "🔥", gradient: "linear-gradient(135deg, #10b981, #059669)" },
    { label: "Under Review",       value: report.underReviewPetitions,icon: "🔍", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
    { label: "Closed Petitions",   value: report.closedPetitions,     icon: "🔒", gradient: "linear-gradient(135deg, #ef4444, #dc2626)" },
    { label: "Total Signatures",   value: report.totalSignatures,     icon: "✍️", gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
];

const POLL_CARDS = (report) => [
    { label: "Total Polls",      value: report.totalPolls,  icon: "📊", gradient: "linear-gradient(135deg, #3b82f6, #2563eb)" },
    { label: "Total Votes Cast", value: report.totalVotes,  icon: "🗳️", gradient: "linear-gradient(135deg, #ec4899, #db2777)" },
];

function ReportStatCard({ label, value, icon, gradient }) {
    return (
        <div
            style={{
                background: gradient,
                borderRadius: "16px",
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                transition: "transform 0.2s ease",
                cursor: "default",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
            <span style={{ fontSize: "28px" }}>{icon}</span>
            <p style={{ fontSize: "34px", fontWeight: "800", color: "#fff", margin: 0, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.9)", margin: 0 }}>{label}</p>
        </div>
    );
}

export default function OfficialReports() {
    const { user } = useAuth();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await API.get("/reports/monthly");
                setReport(res.data);
            } catch (err) {
                console.error("Failed to load report", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    const handleExport = async (type) => {
        setDownloading(true);
        try {
            const res = await API.get(`/reports/export/${type}`, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `monthly-civic-engagement-report.${type}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error(`Failed to export ${type}`, err);
            alert(`Failed to export ${type.toUpperCase()}`);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="app-layout">
            <AppSidebar />

            <div className="app-main">
                {/* Header */}
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                    <div>
                        <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#1e1b4b", margin: 0 }}>
                            📊 Civic Engagement Reports
                        </h1>
                        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                            Monthly overview of activity in your locality
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button
                            onClick={() => handleExport("csv")}
                            disabled={downloading}
                            style={{ background: "#10b981", color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: downloading ? "not-allowed" : "pointer", fontWeight: "600", fontSize: "14px" }}
                        >
                            {downloading ? "⟳ Downloading..." : "📥 Export CSV"}
                        </button>
                        <button
                            onClick={() => handleExport("pdf")}
                            disabled={downloading}
                            style={{ background: "#ef4444", color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: downloading ? "not-allowed" : "pointer", fontWeight: "600", fontSize: "14px" }}
                        >
                            {downloading ? "⟳ Downloading..." : "📄 Export PDF"}
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="pl-loading">
                        <div className="pl-spinner"></div>
                        <p>Generating Monthly Report...</p>
                    </div>
                ) : !report ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                        <p>No report data available.</p>
                    </div>
                ) : (
                    <div>
                        <p style={{ marginBottom: "20px", color: "#475569", fontWeight: "600" }}>
                            Report Month: <span style={{ color: "#4f46e5" }}>{report.month}</span>
                        </p>

                        {/* Petitions */}
                        <h3 style={{ marginBottom: "14px", color: "#334155", fontSize: "16px" }}>📋 Petitions Overview</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                            {PETITION_CARDS(report).map((card) => (
                                <ReportStatCard key={card.label} {...card} />
                            ))}
                        </div>

                        {/* Polls */}
                        <h3 style={{ marginBottom: "14px", color: "#334155", fontSize: "16px" }}>📊 Polls Overview</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: "16px" }}>
                            {POLL_CARDS(report).map((card) => (
                                <ReportStatCard key={card.label} {...card} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

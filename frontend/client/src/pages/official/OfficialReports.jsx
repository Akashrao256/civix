import { useEffect, useMemo, useRef, useState } from "react";
import API from "../../api/axios";
import AppSidebar from "../../components/AppSidebar";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import { useToast } from "../../context/ToastContext";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
);

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
});

const getMonthValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
};

const buildMonthOptions = (count = 12) => {
    const current = new Date();
    current.setDate(1);
    current.setHours(0, 0, 0, 0);

    return Array.from({ length: count }, (_, index) => {
        const optionDate = new Date(current.getFullYear(), current.getMonth() - index, 1);

        return {
            value: getMonthValue(optionDate),
            label: MONTH_LABEL_FORMATTER.format(optionDate),
        };
    });
};

const PETITION_CARDS = (report) => [
    { label: "Total Petitions", value: report.totalPetitions, icon: "\u{1F4CB}", gradient: "linear-gradient(135deg, #0ea5e9, #2563eb)" },
    { label: "Active Petitions", value: report.activePetitions, icon: "\u{1F525}", gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)" },
    { label: "Under Review", value: report.underReviewPetitions, icon: "\u{1F50D}", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
    { label: "Pending", value: report.pendingPetitions, icon: "\u{23F3}", gradient: "linear-gradient(135deg, #38bdf8, #0ea5e9)" },
    { label: "Closed Petitions", value: report.closedPetitions, icon: "\u{1F512}", gradient: "linear-gradient(135deg, #ef4444, #dc2626)" },
    { label: "Total Signatures", value: report.totalSignatures, icon: "\u270D\uFE0F", gradient: "linear-gradient(135deg, #60a5fa, #1d4ed8)" },
];

const POLL_CARDS = (report) => [
    { label: "Total Polls", value: report.totalPolls, icon: "\u{1F4CA}", gradient: "linear-gradient(135deg, #3b82f6, #2563eb)" },
    { label: "Total Votes Cast", value: report.totalVotes, icon: "\u{1F5F3}\uFE0F", gradient: "linear-gradient(135deg, #ec4899, #db2777)" },
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
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            <span style={{ fontSize: "28px" }}>{icon}</span>
            <p style={{ fontSize: "34px", fontWeight: "800", color: "#fff", margin: 0, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.9)", margin: 0 }}>{label}</p>
        </div>
    );
}

function normalizeReport(raw) {
    if (!raw) return null;
    const summary = raw.summary || {};
    const status = raw.statusBreakdown || {};

    return {
        month: raw.month || raw.meta?.month || "",
        totalPetitions: raw.totalPetitions ?? summary.totalPetitions ?? 0,
        activePetitions: raw.activePetitions ?? status.active ?? 0,
        underReviewPetitions: raw.underReviewPetitions ?? status.underReview ?? 0,
        pendingPetitions: raw.pendingPetitions ?? status.pending ?? 0,
        closedPetitions: raw.closedPetitions ?? status.closed ?? 0,
        totalSignatures: raw.totalSignatures ?? summary.totalSignatures ?? 0,
        totalPolls: raw.totalPolls ?? summary.totalPolls ?? 0,
        totalVotes: raw.totalVotes ?? summary.totalVotes ?? 0,
    };
}

export default function OfficialReports() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshingReport, setIsRefreshingReport] = useState(false);
    const [downloadingType, setDownloadingType] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [exportFeedback, setExportFeedback] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(() => getMonthValue(new Date()));
    const exportMenuRef = useRef(null);
    const exportFeedbackTimer = useRef(null);
    const hasLoadedReport = useRef(false);
    const { showToast } = useToast();

    const monthOptions = useMemo(() => buildMonthOptions(12), []);

    useEffect(() => {
        let ignore = false;

        const fetchReport = async () => {
            const initialLoad = !hasLoadedReport.current;

            try {
                if (initialLoad) {
                    setLoading(true);
                } else {
                    setIsRefreshingReport(true);
                }

                const res = await API.get("/reports/monthly", {
                    params: { month: selectedMonth },
                });

                if (!ignore) {
                    setReport(normalizeReport(res.data));
                    hasLoadedReport.current = true;
                }
            } catch (err) {
                console.error("Failed to load report", err);
                if (!ignore) {
                    showToast("Failed to load report data", "error");
                }
            } finally {
                if (!ignore) {
                    if (initialLoad) {
                        setLoading(false);
                    } else {
                        setIsRefreshingReport(false);
                    }
                }
            }
        };

        fetchReport();

        return () => {
            ignore = true;
        };
    }, [selectedMonth, showToast]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setShowExportMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        return () => {
            if (exportFeedbackTimer.current) {
                window.clearTimeout(exportFeedbackTimer.current);
            }
        };
    }, []);

    const pushExportFeedback = (type, message) => {
        setExportFeedback({ type, message });
        window.clearTimeout(exportFeedbackTimer.current);
        exportFeedbackTimer.current = window.setTimeout(() => setExportFeedback(null), 3200);
    };

    const chartConfig = useMemo(() => {
        if (!report) return null;

        const statusLabels = ["Active", "Under Review", "Pending", "Closed"];
        const statusValues = [
            report.activePetitions,
            report.underReviewPetitions,
            report.pendingPetitions,
            report.closedPetitions,
        ];

        const statusColors = ["#10b981", "#f59e0b", "#38bdf8", "#ef4444"];
        const statusBorder = ["#059669", "#d97706", "#0284c7", "#dc2626"];

        return {
            barData: {
                labels: statusLabels,
                datasets: [
                    {
                        label: "Petitions",
                        data: statusValues,
                        backgroundColor: statusColors,
                        borderColor: statusBorder,
                        borderWidth: 1,
                        borderRadius: 10,
                        maxBarThickness: 48,
                    },
                ],
            },
            lineData: {
                labels: ["Petitions", "Signatures", "Polls", "Votes"],
                datasets: [
                    {
                        label: "Engagement Mix",
                        data: [
                            report.totalPetitions,
                            report.totalSignatures,
                            report.totalPolls,
                            report.totalVotes,
                        ],
                        borderColor: "#6366f1",
                        backgroundColor: "rgba(99, 102, 241, 0.18)",
                        pointBackgroundColor: "#4f46e5",
                        tension: 0.35,
                        fill: true,
                    },
                ],
            },
            doughnutData: {
                labels: statusLabels,
                datasets: [
                    {
                        label: "Status Share",
                        data: statusValues,
                        backgroundColor: statusColors,
                        borderColor: "#ffffff",
                        borderWidth: 2,
                    },
                ],
            },
        };
    }, [report]);

    const chartOptions = useMemo(() => {
        const base = {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 600 },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: { color: "#475569", font: { size: 12, weight: "500" } },
                },
                tooltip: {
                    backgroundColor: "#0f172a",
                    titleColor: "#fff",
                    bodyColor: "#e2e8f0",
                    padding: 10,
                    cornerRadius: 10,
                },
            },
        };

        return {
            bar: {
                ...base,
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: "#64748b", font: { size: 11 } },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: "rgba(148, 163, 184, 0.2)" },
                        ticks: { color: "#64748b", font: { size: 11 } },
                    },
                },
            },
            line: {
                ...base,
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: "#64748b", font: { size: 11 } },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: "rgba(148, 163, 184, 0.2)" },
                        ticks: { color: "#64748b", font: { size: 11 } },
                    },
                },
            },
            doughnut: {
                ...base,
                cutout: "60%",
            },
        };
    }, []);

    const handleExport = async (type) => {
        setDownloadingType(type);
        try {
            const res = await API.get(`/reports/export/${type}`, {
                responseType: "blob",
                params: { month: selectedMonth },
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `monthly-civic-engagement-report-${selectedMonth}.${type}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setShowExportMenu(false);
            const successMessage = `${type.toUpperCase()} report exported successfully`;
            showToast(successMessage);
            pushExportFeedback("success", successMessage);
        } catch (err) {
            console.error(`Failed to export ${type}`, err);
            const errorMessage = `Failed to export ${type.toUpperCase()}`;
            showToast(errorMessage, "error");
            pushExportFeedback("error", errorMessage);
        } finally {
            setDownloadingType(null);
        }
    };

    return (
        <div className="app-layout">
            <AppSidebar />

            <div className="app-main">
                <PageHeader
                    title="📊 Civic Engagement Reports"
                    subtitle="Monthly overview of activity in your locality"
                    actions={(
                        <div className="or-export" ref={exportMenuRef}>
                            <Button
                                variant="primary"
                                onClick={() => setShowExportMenu((prev) => !prev)}
                                disabled={Boolean(downloadingType)}
                                aria-haspopup="menu"
                                aria-expanded={showExportMenu}
                            >
                                {downloadingType ? "\u27F3 Downloading..." : "\u{1F4E4} Export"}
                            </Button>

                            {showExportMenu && (
                                <div className="or-export-menu" role="menu" aria-label="Export options">
                                    <button
                                        type="button"
                                        className="or-export-item"
                                        onClick={() => handleExport("csv")}
                                        disabled={Boolean(downloadingType)}
                                    >
                                        {"\u{1F4E5} Export as CSV"}
                                    </button>
                                    <button
                                        type="button"
                                        className="or-export-item"
                                        onClick={() => handleExport("pdf")}
                                        disabled={Boolean(downloadingType)}
                                    >
                                        {"\u{1F4C4} Export as PDF"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                />

                {exportFeedback && (
                    <div className={`or-export-banner${exportFeedback.type === "error" ? " error" : ""}`}>
                        {exportFeedback.message}
                    </div>
                )}

                {loading ? (
                    <LoadingState message="Generating monthly report..." />
                ) : !report ? (
                    <EmptyState title="No report data available" description="Try refreshing or check report generation status." />
                ) : (
                    <div>
                        <div className="or-month-row">
                            <div className="or-month-copy">
                                <p className="or-month-label">
                                    Report Month: <span>{report.month}</span>
                                </p>
                                <p className="or-month-help">
                                    Choose a recent month to refresh cards, charts, and exports.
                                </p>
                            </div>

                            <div className="or-month-select-wrap">
                                <label className="or-month-select-label" htmlFor="report-month-select">
                                    Select month
                                </label>
                                <select
                                    id="report-month-select"
                                    className="or-month-select"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    disabled={isRefreshingReport}
                                >
                                    {monthOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <h3 style={{ marginBottom: "14px", color: "#334155", fontSize: "16px" }}>
                            {"\u{1F4CB} Petitions Overview"}
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                            {PETITION_CARDS(report).map((card) => (
                                <ReportStatCard key={card.label} {...card} />
                            ))}
                        </div>

                        <h3 style={{ marginBottom: "14px", color: "#334155", fontSize: "16px" }}>
                            {"\u{1F4CA} Polls Overview"}
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: "16px" }}>
                            {POLL_CARDS(report).map((card) => (
                                <ReportStatCard key={card.label} {...card} />
                            ))}
                        </div>

                        <div className="or-section">
                            <div className="or-section-header">
                                <div>
                                    <h3 className="or-section-title">{"\u{1F4C8} Visual Insights"}</h3>
                                    <p className="or-section-sub">Charts highlight petition status share and overall engagement mix.</p>
                                </div>
                                <span className="or-pill">
                                    {isRefreshingReport ? "Updating..." : "Auto-refreshed monthly"}
                                </span>
                            </div>

                            <div className="or-charts-grid">
                                <div className="or-chart-card">
                                    <div className="or-chart-header">
                                        <h4>Petition Status Breakdown</h4>
                                        <span>Counts by current status</span>
                                    </div>
                                    <div className="or-chart-body">
                                        <Bar data={chartConfig.barData} options={chartOptions.bar} />
                                    </div>
                                </div>

                                <div className="or-chart-card">
                                    <div className="or-chart-header">
                                        <h4>Engagement Mix</h4>
                                        <span>Petitions, signatures, polls, and votes</span>
                                    </div>
                                    <div className="or-chart-body">
                                        <Line data={chartConfig.lineData} options={chartOptions.line} />
                                    </div>
                                </div>

                                <div className="or-chart-card or-chart-card--compact">
                                    <div className="or-chart-header">
                                        <h4>Status Share</h4>
                                        <span>Relative distribution this month</span>
                                    </div>
                                    <div className="or-chart-body or-chart-body--donut">
                                        <Doughnut data={chartConfig.doughnutData} options={chartOptions.doughnut} />
                                    </div>
                                </div>

                                <div className="or-insights-card">
                                    <h4>Key Insights</h4>
                                    <ul>
                                        <li><strong>{report.activePetitions}</strong> active petitions driving engagement.</li>
                                        <li><strong>{report.totalVotes}</strong> votes cast across polls this month.</li>
                                        <li><strong>{report.totalSignatures}</strong> signatures collected across petitions.</li>
                                        <li><strong>{report.pendingPetitions}</strong> petitions awaiting review.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

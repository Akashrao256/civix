import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import AppSidebar from "../../components/AppSidebar";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import LoadingState from "../../components/ui/LoadingState";

const STATUS_STYLES = {
  pending: { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8", label: "Pending" },
  active: { bg: "#dcfce7", color: "#16a34a", dot: "#22c55e", label: "Active" },
  under_review: { bg: "#fef9c3", color: "#b45309", dot: "#f59e0b", label: "Under Review" },
  closed: { bg: "#fee2e2", color: "#dc2626", dot: "#ef4444", label: "Closed" },
};

export default function PetitionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [petition, setPetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPetition = async () => {
      try {
        const res = await API.get(`/petitions/${id}`);
        const found = res.data?.petition;

        if (!found) {
          setError("Petition not found.");
          return;
        }

        setPetition(found);
      } catch (err) {
        setError("Failed to load petition details.");
      } finally {
        setLoading(false);
      }
    };

    loadPetition();
  }, [id]);

  const statusStyle = petition ? STATUS_STYLES[petition.status] || STATUS_STYLES.pending : null;
  const createdDate = petition?.createdAt
    ? new Date(petition.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  return (
    <div className="app-layout">
      <AppSidebar />

      <main className="app-main">
        <PageHeader
          title="Petition Details"
          subtitle="View the complete petition information"
          actions={
            <Button variant="ghost" onClick={() => navigate("/petitions")}>
              Back
            </Button>
          }
        />

        {loading ? (
          <LoadingState message="Loading petition..." />
        ) : error ? (
          <div className="cp-error-page">
            <div style={{ fontSize: 48, marginBottom: 16 }}>X</div>
            <p>{error}</p>
            <Button onClick={() => navigate("/petitions")}>Go Back</Button>
          </div>
        ) : (
          <section className="pd-shell">
            <div className="pd-card">
              <div className="pd-hero">
                <div>
                  <span
                    className="pd-status-pill"
                    style={{ background: statusStyle.bg, color: statusStyle.color }}
                  >
                    <span className="pd-status-dot" style={{ background: statusStyle.dot }}></span>
                    {statusStyle.label}
                  </span>
                  <h2 className="pd-title">{petition.title}</h2>
                </div>
              </div>

              <div className="pd-grid">
                <div className="pd-meta-card">
                  <span>Category</span>
                  <strong>{petition.category}</strong>
                </div>
                <div className="pd-meta-card">
                  <span>Location</span>
                  <strong>{petition.location}</strong>
                </div>
                <div className="pd-meta-card">
                  <span>Status</span>
                  <strong>{statusStyle.label}</strong>
                </div>
                <div className="pd-meta-card">
                  <span>Creator</span>
                  <strong>{petition.creator?.fullName || "Unknown"}</strong>
                </div>
                <div className="pd-meta-card">
                  <span>Created Date</span>
                  <strong>{createdDate}</strong>
                </div>
              </div>

              <div className="pd-section">
                <h3>Description</h3>
                <p className="pd-description">
                  {petition.description || "No description available."}
                </p>
              </div>

              <div className="pd-section">
                <h3>Official Responses</h3>
                {petition.responses?.length ? (
                  <div className="pd-responses">
                    {petition.responses
                      .slice()
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((response, index) => (
                        <article
                          key={response._id || `${response.respondedBy?._id || "official"}-${response.createdAt}-${index}`}
                          className="pd-response-item"
                        >
                          <p className="pd-response-message">{response.message}</p>
                          <div className="pd-response-meta">
                            <span>{response.respondedBy?.fullName || "Official"}</span>
                            <span>
                              {response.createdAt
                                ? new Date(response.createdAt).toLocaleString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Date unavailable"}
                            </span>
                          </div>
                        </article>
                      ))}
                  </div>
                ) : (
                  <p className="pd-empty-responses">No official responses yet.</p>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

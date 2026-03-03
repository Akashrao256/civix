import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  active: { bg: "#dcfce7", color: "#16a34a", dot: "#22c55e", label: "Active" },
  under_review: { bg: "#fef9c3", color: "#b45309", dot: "#f59e0b", label: "Under Review" },
  closed: { bg: "#fee2e2", color: "#dc2626", dot: "#ef4444", label: "Closed" },
};

const CATEGORY_COLORS = {
  Infrastructure: "#e0e7ff",
  Education: "#fce7f3",
  Health: "#d1fae5",
  Environment: "#d1fae5",
  Safety: "#fee2e2",
  Other: "#f1f5f9",
};

export default function PetitionCard({ petition, currentUser, onSign, signing, index = 0 }) {
  const navigate = useNavigate();
  const st = STATUS_STYLES[petition.status] || STATUS_STYLES.active;
  const catColor = CATEGORY_COLORS[petition.category] || "#f1f5f9";

  const isOwner =
    currentUser &&
    (petition.creator?._id === currentUser.id || petition.creator === currentUser.id);
  const isCitizen = currentUser?.role === "citizen";
  const isClosed = petition.status === "closed";

  return (
    <div
      className="pc-card"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Top Row: Category + Status */}
      <div className="pc-top">
        <span className="pc-category" style={{ background: catColor }}>
          {petition.category}
        </span>
        <span className="pc-status" style={{ background: st.bg, color: st.color }}>
          <span className="pc-dot" style={{ background: st.dot }}></span>
          {st.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="pc-title">{petition.title}</h3>

      {/* Description */}
      <p className="pc-desc">
        {petition.description?.length > 110
          ? petition.description.slice(0, 110) + "..."
          : petition.description}
      </p>

      {/* Meta */}
      <div className="pc-meta">
        <span className="pc-meta-item">📍 {petition.location}</span>
        <span className="pc-meta-item">👤 {petition.creator?.fullName || "Unknown"}</span>
      </div>

      {/* Footer */}
      <div className="pc-footer">
        <div className="pc-sig-count">
          <span className="pc-sig-icon">✍️</span>
          <span>{petition.signatureCount ?? 0} signature{petition.signatureCount !== 1 ? "s" : ""}</span>
        </div>

        <div className="pc-actions">
          {/* Edit – only creator, not closed */}
          {isOwner && !isClosed && (
            <button
              className="pc-btn pc-edit-btn"
              onClick={() => navigate(`/petitions/${petition._id}/edit`)}
            >
              ✏️ Edit
            </button>
          )}

          {/* Sign – only citizens */}
          {isCitizen && !isOwner && !isClosed && (
            <button
              className="pc-btn pc-sign-btn"
              onClick={() => onSign(petition._id)}
              disabled={signing}
            >
              {signing ? "⟳" : "✍️ Sign"}
            </button>
          )}

          {isClosed && (
            <span className="pc-closed-badge">🔒 Closed</span>
          )}
        </div>
      </div>
    </div>
  );
}
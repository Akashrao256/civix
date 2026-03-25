import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  pending: { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8", label: "Pending" },
  active: { bg: "#dcfce7", color: "#16a34a", dot: "#22c55e", label: "Active" },
  under_review: { bg: "#fef9c3", color: "#b45309", dot: "#f59e0b", label: "Under Review" },
  closed: { bg: "#fee2e2", color: "#dc2626", dot: "#ef4444", label: "Closed" },
};

const FALLBACK_STATUS = { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8", label: petition => petition.status || "Unknown" };

const CATEGORY_COLORS = {
  Infrastructure: "#e0e7ff",
  Education: "#fce7f3",
  Health: "#d1fae5",
  Environment: "#d1fae5",
  Safety: "#fee2e2",
  Other: "#f1f5f9",
};

export default function PetitionCard({ petition, currentUser, onSign, signing, onDelete, deleting, index = 0 }) {
  const navigate = useNavigate();
  const stRaw = STATUS_STYLES[petition.status];
  const st = stRaw
    ? stRaw
    : { ...FALLBACK_STATUS, label: FALLBACK_STATUS.label(petition) };
  const catColor = CATEGORY_COLORS[petition.category] || "#f1f5f9";

  const isOwner =
    currentUser &&
    (petition.creator?._id === (currentUser._id || currentUser.id) || petition.creator === (currentUser._id || currentUser.id));
  const isCitizen = currentUser?.role === "citizen";
  const isClosed = petition.status === "closed";
  const hasSigned = petition.hasSigned;

  const handleDownload = () => {
    const content = `Title: ${petition.title}\nCategory: ${petition.category}\nLocation: ${petition.location}\nStatus: ${st.label}\nSignatures: ${petition.signatureCount ?? 0}\n\nDescription:\n${petition.description}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `petition-${petition._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

      {/* Description — flex-grow so footer is always pinned */}
      <p className="pc-desc">
        {petition.description?.length > 110
          ? petition.description.slice(0, 110) + "..."
          : petition.description}
      </p>

      {/* Spacer pushes footer down */}
      <div className="pc-spacer" />

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
          {/* Sign – only citizens */}
          {isCitizen && !isOwner && !isClosed && !hasSigned && onSign && (
            <button
              className="pc-btn pc-sign-btn"
              onClick={() => onSign(petition._id)}
              disabled={signing}
            >
              {signing ? "⟳" : "✍️ Sign"}
            </button>
          )}

          {/* Already Signed Badge */}
          {isCitizen && hasSigned && !isClosed && (
            <span className="pc-signed-badge">
              ✅ Signed
            </span>
          )}

          {/* Download – only creator */}
          {isOwner && (
            <button className="pc-btn pc-download-btn" onClick={handleDownload} title="Download Petition Details">
              📥 Download
            </button>
          )}

          {/* Edit – only creator, not closed */}
          {isOwner && !isClosed && (
            <button
              className="pc-btn pc-edit-btn"
              onClick={() => navigate(`/petitions/${petition._id}/edit`)}
            >
              ✏️ Edit
            </button>
          )}

          {/* Delete – only creator, pending or active */}
          {isOwner && (petition.status === "pending" || petition.status === "active") && (
            <button
              className="pc-btn pc-delete-btn"
              onClick={() => onDelete(petition._id)}
              disabled={deleting}
              title="Delete Petition"
            >
              {deleting ? "⟳" : "🗑️ Delete"}
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
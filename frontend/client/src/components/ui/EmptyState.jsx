export default function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <p className="empty-state-title">{title}</p>
      {description ? <p className="empty-state-description">{description}</p> : null}
      {action ? <div className="empty-state-action">{action}</div> : null}
    </div>
  );
}

export default function SectionHeader({ title, action }) {
  return (
    <div className="section-header">
      <h3>{title}</h3>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export default function PetitionCard({ petition }) {
  return (
    <div className="card">
      <h4>{petition.title}</h4>
      <p>{petition.description}</p>
      <span>Signatures: {petition.signatures}</span>
    </div>
  );
}
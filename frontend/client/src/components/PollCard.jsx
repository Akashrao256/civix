export default function PollCard({ poll }) {
  return (
    <div className="card">
      <h4>{poll.question}</h4>
      <p>Status: {poll.status}</p>
    </div>
  );
}
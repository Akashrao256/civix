export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="pl-loading" role="status" aria-live="polite">
      <div className="pl-spinner"></div>
      <p>{message}</p>
    </div>
  );
}

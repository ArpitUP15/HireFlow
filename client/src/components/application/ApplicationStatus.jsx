export default function ApplicationStatus({ status = "applied" }) {
  return (
    <span className={`status-label status-${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

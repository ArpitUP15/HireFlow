import { Link } from "react-router-dom";
import { statuses } from "../application/statuses";
export default function PipelineCard({
  application,
  onStatusChange,
  disabled,
}) {
  return (
    <article className="portal-card">
      <Link to={`/applications/${application._id}`}>
        <strong>
          {application.candidate?.firstName} {application.candidate?.lastName}
        </strong>
      </Link>
      <p>{application.job?.title}</p>
      <label>
        Stage
        <select
          disabled={disabled}
          value={application.status}
          onChange={(e) => onStatusChange?.(application._id, e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
    </article>
  );
}

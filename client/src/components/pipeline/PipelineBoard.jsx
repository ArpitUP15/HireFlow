import PipelineColumn from "./PipelineColumn";
import { statuses } from "../application/statuses";
export default function PipelineBoard({
  applications = [],
  onStatusChange,
  disabled,
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {statuses.map((s) => (
        <PipelineColumn
          key={s}
          status={s}
          applications={applications.filter((a) => a.status === s)}
          onStatusChange={onStatusChange}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

import PipelineCard from "./PipelineCard";
export default function PipelineColumn({
  status,
  applications = [],
  onStatusChange,
  disabled,
}) {
  return (
    <section>
      <h2>
        {status} ({applications.length})
      </h2>
      <div className="portal-history">
        {applications.map((a) => (
          <PipelineCard
            key={a._id}
            application={a}
            onStatusChange={onStatusChange}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  );
}

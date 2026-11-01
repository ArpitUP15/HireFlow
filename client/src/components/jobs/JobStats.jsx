export default function JobStats({ jobs = [] }) {
  return (
    <div className="portal-stats">
      {["draft", "published", "closed"].map((s) => (
        <div className="portal-stat" key={s}>
          <span>{s}</span>
          <strong>{jobs.filter((j) => j.status === s).length}</strong>
        </div>
      ))}
    </div>
  );
}

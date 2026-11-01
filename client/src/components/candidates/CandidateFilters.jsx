export default function CandidateFilters({ filters = {}, onChange }) {
  return (
    <div className="portal-filters">
      {["search", "location"].map((k) => (
        <label key={k}>
          {k === "search" ? "Search name, email or skills" : "Location"}
          <input
            value={filters[k] || ""}
            onChange={(e) => onChange?.({ ...filters, [k]: e.target.value })}
          />
        </label>
      ))}
    </div>
  );
}

export default function JobFilters({ filters = {}, onChange }) {
  return (
    <div className="portal-filters">
      <label>
        Search jobs
        <input
          value={filters.search || ""}
          onChange={(e) => onChange?.({ ...filters, search: e.target.value })}
        />
      </label>
      <label>
        Status
        <select
          value={filters.status || ""}
          onChange={(e) => onChange?.({ ...filters, status: e.target.value })}
        >
          <option value="">All statuses</option>
          {["draft", "published", "closed"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../../services/api";
export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((r) => setData(r.data.dashboard))
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load system overview"),
      );
  }, []);
  return (
    <section className="portal-page">
      <h1>System administration</h1>
      {error && <p role="alert">{error}</p>}
      {data ? (
        <div className="portal-stats">
          {Object.entries(data).map(([key, value]) => (
            <div className="portal-stat" key={key}>
              <span>{key.replace(/([A-Z])/g, " $1")}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </section>
  );
}

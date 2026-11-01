import { useEffect, useState } from "react";
import { useOrganization } from "../../context/useOrganization";
import {
  getCurrentOrganization,
  updateOrganization,
} from "../../services/organizationService";
import OrganizationForm from "../../components/organization/OrganizationForm";
import { Link } from "react-router-dom";
export default function OrganizationSettings() {
  const { refreshOrganization, membership } = useOrganization();
  const [organization, setOrganization] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    getCurrentOrganization()
      .then((d) => setOrganization(d.organization))
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load organization"),
      );
  }, []);
  const save = async (data) => {
    setSaving(true);
    try {
      const d = await updateOrganization(data);
      setOrganization(d.organization);
      await refreshOrganization();
      setMessage("Organization saved");
      setError("");
    } catch (e) {
      setError(e.response?.data?.message || "Could not save organization");
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="portal-page">
      <h1>Organization settings</h1>
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      {organization &&
        (["owner", "hr_admin"].includes(membership?.role) ? (
          <OrganizationForm
            key={organization._id}
            organization={organization}
            onSubmit={save}
            loading={saving}
          />
        ) : (
          <p>
            Only organization owners and HR administrators can edit these
            settings.
          </p>
        ))}
      <p>
        <Link to="/team">Manage team membership</Link>
      </p>
    </section>
  );
}

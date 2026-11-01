import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InterviewForm from "../../components/interviews/InterviewForm";
import { getApplications } from "../../services/applicationService";
import { getMembers } from "../../services/organizationService";
import {
  getInterviewById,
  updateInterview,
} from "../../services/interviewServices";
export default function EditInterview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    Promise.all([getApplications(), getMembers(), getInterviewById(id)])
      .then(([a, m, i]) =>
        setData({
          applications: a.applications || [],
          members: m.members || [],
          interview: i.interview,
        }),
      )
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load interview form"),
      );
  }, [id]);
  const save = async (body) => {
    setSaving(true);
    setError("");
    try {
      const result = await updateInterview(id, body);
      navigate(`/interviews/${result.interview._id}`);
    } catch (e) {
      setError(e.response?.data?.message || "Could not save interview");
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="portal-page">
      <h1>Edit interview</h1>
      {error && (
        <p role="alert" className="portal-message error">
          {error}
        </p>
      )}
      {data ? (
        <InterviewForm
          {...data}
          onSubmit={save}
          loading={saving}
          onCancel={() => navigate("/interviews")}
        />
      ) : (
        !error && <p>Loading form...</p>
      )}
    </section>
  );
}

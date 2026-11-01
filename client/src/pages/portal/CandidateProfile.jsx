import { useEffect, useState } from "react";
import {
  getProfile,
  saveProfile,
  uploadProfileResume,
  downloadResume,
} from "../../services/portalService";
export default function CandidateProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const accept = (p) => {
    setProfile(p);
    setForm({ ...p, skills: p.skills.join(", ") });
  };
  useEffect(() => {
    let mounted = true;
    getProfile()
      .then((d) => {
        if (mounted) {
          accept(d.profile);
          setEmail(d.email);
        }
      })
      .catch((e) => {
        if (mounted)
          setError(e.response?.data?.message || "Could not load profile");
      });
    return () => {
      mounted = false;
    };
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const d = await saveProfile({
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experience: Number(form.experience),
      });
      accept(d.profile);
      setMessage("Profile saved.");
    } catch (e) {
      setError(e.response?.data?.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };
  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError("");
    setMessage("");
    try {
      const d = await uploadProfileResume(file);
      setProfile(d.profile);
      setFile(null);
      e.target.reset();
      setMessage("Resume uploaded. Future applications will share this PDF.");
    } catch (e) {
      setError(e.response?.data?.message || "Could not upload resume");
    } finally {
      setUploading(false);
    }
  };
  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  return (
    <section className="portal-page">
      <p className="eyebrow">YOUR PROFILE</p>
      <h1>Personal details and resume</h1>
      <p>
        Keep your application information complete. Your email is linked to your
        account.
      </p>
      {error && (
        <p className="portal-message error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="portal-message" role="status">
          {message}
        </p>
      )}
      {!profile ? (
        <p role="status">
          {error ? "Refresh this page to try again." : "Loading profile..."}
        </p>
      ) : (
        <div className="portal-profile-layout">
          <form className="portal-card" onSubmit={submit}>
            <h2>Personal and professional details</h2>
            <div className="portal-form-grid">
              {[
                ["firstName", "First name", "text", 50],
                ["lastName", "Last name", "text", 50],
                ["phone", "Phone", "tel", 30],
                ["location", "City / location", "text", 200],
                ["headline", "Professional headline", "text", 200],
                ["experience", "Experience (years)", "number", null],
                ["linkedinUrl", "LinkedIn URL", "url", 1000],
                ["githubUrl", "GitHub URL", "url", 1000],
                ["portfolioUrl", "Portfolio URL", "url", 1000],
              ].map(([key, label, type, maxLength]) => (
                <label key={key}>
                  {label}
                  <input
                    name={key}
                    type={type}
                    required={["firstName", "lastName", "phone"].includes(key)}
                    min={type === "number" ? 0 : undefined}
                    max={type === "number" ? 70 : undefined}
                    step={type === "number" ? "0.5" : undefined}
                    maxLength={maxLength || undefined}
                    value={form[key] ?? ""}
                    onChange={change}
                  />
                </label>
              ))}
              <label>
                Email
                <input type="email" readOnly value={email} />
              </label>
              <label className="full-width">
                Address
                <textarea
                  name="address"
                  maxLength={500}
                  value={form.address || ""}
                  onChange={change}
                />
              </label>
              <label className="full-width">
                Skills (comma separated)
                <input
                  name="skills"
                  required
                  value={form.skills || ""}
                  onChange={change}
                  placeholder="Python, React, SQL"
                />
              </label>
              <label className="full-width">
                Education
                <textarea
                  required
                  name="education"
                  maxLength={3000}
                  value={form.education || ""}
                  onChange={change}
                  placeholder="Degree, institution and graduation year"
                />
              </label>
              <label className="full-width">
                Professional summary
                <textarea
                  name="summary"
                  rows={5}
                  maxLength={5000}
                  value={form.summary || ""}
                  onChange={change}
                />
              </label>
            </div>
            <button disabled={saving || uploading} className="portal-button">
              {saving ? "Saving..." : "Save profile"}
            </button>
          </form>
          <aside className="portal-card">
            <h2>Resume</h2>
            <p>
              Upload a text-based PDF, up to 10 MB. Scanned or encrypted PDFs
              cannot be screened.
            </p>
            {profile.resume?.fileName ? (
              <>
                <p>{profile.resume.originalName}</p>
                <p>
                  Uploaded{" "}
                  {new Date(profile.resume.uploadedAt).toLocaleString()}
                </p>
                <button
                  className="portal-button secondary"
                  onClick={() =>
                    downloadResume(
                      "/portal/profile/resume",
                      profile.resume.originalName,
                    ).catch(() => setError("Resume could not be downloaded"))
                  }
                >
                  Download resume
                </button>
              </>
            ) : (
              <p>No resume uploaded.</p>
            )}
            <form onSubmit={upload}>
              <label>
                Choose PDF resume
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
              <button
                className="portal-button"
                disabled={!file || uploading || saving}
              >
                {uploading ? "Uploading..." : "Upload resume"}
              </button>
            </form>
            <p className="portal-help">
              Save your phone, education and skills and upload a resume before
              applying. Recruiters see the details submitted with your
              applications.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}

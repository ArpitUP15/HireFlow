import { useState } from "react";
import { Upload } from "lucide-react";
import api from "../../services/api";

const ResumeUpload = ({ candidateId, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("resume", file);

    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        `/candidates/${candidateId}/resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      onUploaded?.(response.data.candidate);

      setFile(null);
    } catch (error) {
      setError(error.response?.data?.message || "Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-primary/5 p-5">
      <h3 className="font-semibold text-text">Resume</h3>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(event) => setFile(event.target.files?.[0] || null)}
        className="mt-4 block w-full text-sm text-muted"
      />

      {error && <p role="alert">{error}</p>}
      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || loading}
        className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-background disabled:opacity-50"
      >
        <Upload size={18} />

        {loading ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
};

export default ResumeUpload;

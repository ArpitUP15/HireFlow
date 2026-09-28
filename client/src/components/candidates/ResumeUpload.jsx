import { useState } from "react";
import { Upload } from "lucide-react";
import api from "../../services/api";

const ResumeUpload = ({
  candidateId,
  onUploaded,
}) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] =
    useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("resume", file);

    try {
      setLoading(true);

      const response = await api.post(
        `/candidates/${candidateId}/resume`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      onUploaded?.(
        response.data.candidate
      );

      setFile(null);
    } catch (error) {
      console.error(
        "Resume upload failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="font-semibold text-white">
        Resume
      </h3>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(event) =>
          setFile(
            event.target.files?.[0] || null
          )
        }
        className="mt-4 block w-full text-sm text-slate-400"
      />

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || loading}
        className="mt-4 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        <Upload size={18} />

        {loading
          ? "Uploading..."
          : "Upload Resume"}
      </button>
    </div>
  );
};

export default ResumeUpload;
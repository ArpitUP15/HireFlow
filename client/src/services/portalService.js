import api from "./api";
export const getProfile = () => api.get("/portal/profile").then((r) => r.data);
export const saveProfile = (data) =>
  api.put("/portal/profile", data).then((r) => r.data);
export const getPortalJobs = (params, signal) =>
  api.get("/portal/jobs", { params, signal }).then((r) => r.data);
export const applyToJob = (id, coverLetter) =>
  api.post(`/portal/jobs/${id}/apply`, { coverLetter }).then((r) => r.data);
export const getMyApplications = (params, signal) =>
  api.get("/portal/applications", { params, signal }).then((r) => r.data);
export const uploadProfileResume = (file) => {
  const form = new FormData();
  form.append("resume", file);
  return api
    .post("/portal/profile/resume", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};
export const downloadResume = async (endpoint, filename) => {
  const { data } = await api.get(endpoint, { responseType: "blob" });
  const url = URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "resume.pdf";
  link.click();
  URL.revokeObjectURL(url);
};

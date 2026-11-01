import api from "./api";
const options = { timeout: 100000 };
export async function parseResume(file, candidateId) {
  const body = new FormData();
  body.append("resume", file);
  if (candidateId) body.append("candidateId", candidateId);
  return (
    await api.post("/ai/parse-resume", body, {
      ...options,
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
}
export async function runAI(type, data) {
  return (await api.post(`/ai/${type}`, data, options)).data;
}
export async function getAIHistory(params) {
  return (await api.get("/ai/history", { params })).data.data;
}

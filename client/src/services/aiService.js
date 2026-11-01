import api from "./api";

export const screenCandidate = async (candidateId, jobId, applicationId) => {
  const response = await api.post(`/ai/screen/${candidateId}`, {
    jobId,
    applicationId,
  });

  return response.data;
};

import api from "./api";

export const screenCandidate = async (
  candidateId,
  jobId
) => {
  const response = await api.post(
    `/ai/screen/${candidateId}`,
    {
      jobId,
    }
  );

  return response.data;
};
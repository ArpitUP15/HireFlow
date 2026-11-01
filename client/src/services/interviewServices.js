import api from "./api";

export const getInterviews = async () => {
  const response = await api.get("/interviews");

  return response.data;
};

export const getInterviewById = async (id) => {
  const response = await api.get(`/interviews/${id}`);

  return response.data;
};

export const createInterview = async (data) => {
  const response = await api.post("/interviews", data);

  return response.data;
};

export const updateInterview = async (id, data) => {
  const response = await api.put(`/interviews/${id}`, data);

  return response.data;
};

export const deleteInterview = async (id) => {
  const response = await api.delete(`/interviews/${id}`);

  return response.data;
};

export const updateInterviewStatus = async (id, status) => {
  const response = await api.put(`/interviews/${id}`, { status });

  return response.data;
};

export const addInterviewFeedback = async (id, data = {}) => {
  const response = await api.put(`/interviews/${id}`, {
    feedback: data.feedback ?? "",
    overallScore: data.score ?? undefined,
    notes: data.recommendation ?? "",
  });

  return response.data;
};

export const updateHiringDecision = async (id, decision) => {
  const { data } = await api.get(`/interviews/${id}`);
  const applicationId =
    data.interview.application?._id || data.interview.application;
  if (!["selected", "rejected"].includes(decision))
    throw new Error("Choose selected or rejected");
  await api.patch(`/applications/${applicationId}/status`, {
    status: decision,
  });
  return { success: true };
};

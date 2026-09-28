import api from "./api";

export const getInterviews = async () => {
  const response = await api.get("/interviews");

  return response.data;
};

export const getInterviewById = async (id) => {
  const response = await api.get(
    `/interviews/${id}`
  );

  return response.data;
};

export const createInterview = async (data) => {
  const response = await api.post(
    "/interviews",
    data
  );

  return response.data;
};

export const updateInterview = async (
  id,
  data
) => {
  const response = await api.put(
    `/interviews/${id}`,
    data
  );

  return response.data;
};

export const deleteInterview = async (id) => {
  const response = await api.delete(
    `/interviews/${id}`
  );

  return response.data;
};

export const updateInterviewStatus = async (
  id,
  status
) => {
  const response = await api.put(
    `/interviews/${id}`,
    { status }
  );

  return response.data;
};

export const addInterviewFeedback = async (
  id,
  data = {}
) => {
  const response = await api.put(
    `/interviews/${id}`,
    {
      feedback: data.feedback ?? "",
      overallScore:
        data.score ?? undefined,
      notes: data.recommendation ?? "",
    }
  );

  return response.data;
};

export const updateHiringDecision = async (
  id,
  decision
) => {
  const response = await api.put(
    `/interviews/${id}`,
    {
      status: decision,
      notes: `Hiring decision: ${decision}`,
    }
  );

  return response.data;
};
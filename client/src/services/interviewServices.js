import api from "./api";


// =====================================================
// GET INTERVIEWS
// =====================================================

export const getInterviews =
  async (params = {}) => {

    const response =
      await api.get(
        "/interviews",
        {
          params,
        }
      );

    return response.data;
  };


// =====================================================
// GET INTERVIEW BY ID
// =====================================================

export const getInterviewById =
  async (id) => {

    const response =
      await api.get(
        `/interviews/${id}`
      );

    return response.data;
  };


// =====================================================
// CREATE INTERVIEW
// =====================================================

export const createInterview =
  async (interviewData) => {

    const response =
      await api.post(
        "/interviews",
        interviewData
      );

    return response.data;
  };


// =====================================================
// UPDATE INTERVIEW
// =====================================================

export const updateInterview =
  async (
    id,
    interviewData
  ) => {

    const response =
      await api.put(
        `/interviews/${id}`,
        interviewData
      );

    return response.data;
  };


// =====================================================
// UPDATE STATUS
// =====================================================

export const updateInterviewStatus =
  async (
    id,
    status
  ) => {

    const response =
      await api.patch(
        `/interviews/${id}/status`,
        {
          status,
        }
      );

    return response.data;
  };


// =====================================================
// ADD FEEDBACK
// =====================================================

export const addInterviewFeedback =
  async (
    id,
    feedbackData
  ) => {

    const response =
      await api.patch(
        `/interviews/${id}/feedback`,
        feedbackData
      );

    return response.data;
  };


// =====================================================
// UPDATE HIRING DECISION
// =====================================================

export const updateHiringDecision =
  async (
    id,
    hiringDecision
  ) => {

    const response =
      await api.patch(
        `/interviews/${id}/hiring-decision`,
        {
          hiringDecision,
        }
      );

    return response.data;
  };


// =====================================================
// DELETE INTERVIEW
// =====================================================

export const deleteInterview =
  async (id) => {

    const response =
      await api.delete(
        `/interviews/${id}`
      );

    return response.data;
  };
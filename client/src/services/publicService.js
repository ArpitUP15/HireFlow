import api from "./api";


// =====================================================
// GET PUBLIC PLATFORM STATISTICS
// =====================================================

export const getPublicStats =
  async () => {

    const response =
      await api.get(
        "/public/stats"
      );

    return response.data;
  };


// =====================================================
// SEND CONTACT MESSAGE
// =====================================================

export const submitContactMessage =
  async (contactData) => {

    const response =
      await api.post(
        "/public/contact",
        contactData
      );

    return response.data;
  };
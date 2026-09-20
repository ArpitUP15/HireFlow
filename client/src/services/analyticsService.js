import api from "./api";

/*
|--------------------------------------------------------------------------
| Get Dashboard Analytics
|--------------------------------------------------------------------------
*/

export const getDashboardAnalytics =
  async () => {
    const response = await api.get(
      "/analytics/dashboard"
    );

    return response.data;
  };
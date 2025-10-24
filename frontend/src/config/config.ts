// API Base URL - can be overridden by environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9092/pollapi';

// Admin Endpoints
export const config = {
  // Base URL
  baseUrl: API_BASE_URL,

  // Admin Authentication Endpoints
  adminLoginUrl: `${API_BASE_URL}/admin/login`,
  adminLogoutUrl: `${API_BASE_URL}/admin/logout`,
  adminCurrentUrl: `${API_BASE_URL}/admin/current`,
  adminCheckSessionUrl: `${API_BASE_URL}/admin/check-session`,

  // Admin Details Endpoint (requires adminId parameter)
  adminDetailsUrl: `${API_BASE_URL}/admin/details`,

  // ==========================
  // 📊 Poll Endpoints
  // ==========================

  // Create poll (POST) → /polls/create?adminId={adminId}
  createPollUrl: `${API_BASE_URL}/polls/create`,

  // Get poll by code (GET) → /polls/code/{pollCode}
  getPollByCodeUrl: `${API_BASE_URL}/polls/code`,

  // Get polls by admin (GET) → /polls/admin/{adminId}
  getPollsByAdminUrl: `${API_BASE_URL}/polls/admin`,

  // Get admin dashboard (GET) → /polls/dashboard/{adminId}
  getAdminDashboardUrl: `${API_BASE_URL}/polls/dashboard`,

  // Update poll status (PUT) → /polls/{pollId}/status/{statusId}
  updatePollStatusUrl: `${API_BASE_URL}/polls`,

  // Delete poll (DELETE) → /polls/{pollId}
  deletePollUrl: `${API_BASE_URL}/polls`,

  // Get poll results (GET) → /polls/{pollCode}/results
  getPollResultsUrl: `${API_BASE_URL}/polls`,

  // Submit poll response (POST) → /responses/submit
submitResponseUrl: `${API_BASE_URL}/responses/submit`,

  // ==========================
  // 🛑 Poll Status Constants
  // ==========================
  POLL_STATUS: {
    ACTIVE: 1,
    STOPPED: 2,
    COMPLETED: 3,
  },
};

// ==========================
// Helper Functions
// ==========================

// Stop poll → PUT /polls/{pollId}/status/2
export const stopPollUrl = (pollId: number | string) => {
  return `${config.updatePollStatusUrl}/${pollId}/status/${config.POLL_STATUS.STOPPED}`;
};

// General poll status update → PUT /polls/{pollId}/status/{statusId}
export const updatePollStatusUrl = (pollId: number | string, statusId: number | string) => {
  return `${config.updatePollStatusUrl}/${pollId}/status/${statusId}`;
};

export default config;

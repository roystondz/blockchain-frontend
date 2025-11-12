const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const api = {
  async post(endpoint, data, isFormData = false) {
    try {
      const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers,
        body: isFormData ? data : JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Request failed');
      return result.data;
    } catch (error) {
      throw error;
    }
  },
  
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Request failed');
      return result.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;
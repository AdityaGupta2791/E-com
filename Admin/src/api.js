import axios from 'axios';

// Create an axios instance with the API base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
});

// Attach token from localStorage to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Handle 401 responses: remove token and redirect to /signin
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err && err.response && err.response.status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch {
        // ignore localStorage errors
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
});

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
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

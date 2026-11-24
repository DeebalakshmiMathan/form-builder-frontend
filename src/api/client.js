import axios from 'axios';

export const TOKEN_KEY = 'fb_token';

const client = axios.create({ baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`, timeout: 15000 });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const onAdmin = window.location.pathname.startsWith('/admin');
    if (err.response?.status === 401 && onAdmin) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.assign('/login');
    }
    return Promise.reject(err);
  }
);

// Normalises any failure into a serialisable { message, errors } for Redux
export const toApiError = (err) => ({
  message: err.response?.data?.message || err.message || 'Something went wrong',
  errors: err.response?.data?.errors || null,
});

export default client;

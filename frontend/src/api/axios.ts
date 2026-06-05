import axios from 'axios';
import { showLoader, hideLoader } from '../context/LoaderContext';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!(config as any).skipGlobalLoader) {
      showLoader();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (!(response.config as any)?.skipGlobalLoader) {
      hideLoader();
    }
    return response;
  },
  (error) => {
    if (!(error.config as any)?.skipGlobalLoader) {
      hideLoader();
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

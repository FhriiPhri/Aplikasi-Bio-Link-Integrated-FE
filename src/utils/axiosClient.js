import axios from "axios";

const api = axios.create({
  // Vite bakal otomatis milih env yang sesuai saat build
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Penting untuk session/cookie
});

// Request interceptor (udah OK)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token Invalid
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosClient;

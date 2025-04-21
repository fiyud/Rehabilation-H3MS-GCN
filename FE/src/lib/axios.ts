import axios from "axios";

// Create a custom axios instance
const http = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user");
    const parsedToken = token ? JSON.parse(token) : null;
    console.log(parsedToken);
    if (token) {
      config.headers.Authorization = `Bearer ${parsedToken?.id}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;

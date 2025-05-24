import axios from "axios";

// Create Axios instance
// export const baseURL = "http://localhost:5000";
export const baseURL = "https://assessment-backend-89ff.onrender.com";
const api = axios.create({
  baseURL, // 🔁 Replace with your actual base URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 180000, // optional: timeout after 10s
});

export default api;

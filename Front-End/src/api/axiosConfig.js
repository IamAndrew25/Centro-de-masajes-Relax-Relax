import axios from "axios";

const API_URL = "http://localhost:8080"; // URL base de tu backend

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
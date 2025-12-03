import axios from "axios";

const API_URL = "http://3.16.225.135:8080"; // URL base de tu backend

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
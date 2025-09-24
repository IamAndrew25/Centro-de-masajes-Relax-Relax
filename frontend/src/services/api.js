import axios from 'axios';

let baseURL = '';
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
  baseURL = import.meta.env.VITE_API_URL;
} else if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
  baseURL = process.env.REACT_APP_API_URL;
} else {
  baseURL = 'http://localhost:8080/api';
}

const api = axios.create({ baseURL });
export default api;

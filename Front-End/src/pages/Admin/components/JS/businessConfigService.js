
import axios from "axios";

const API_URL = "http://3.16.225.135:8080"; // 

// Recuperar el JWT del localStorage (ajusta la clave si usas otra)
const getToken = () => localStorage.getItem("token");

// Config común para todas las peticiones
const axiosConfig = () => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return { headers };
};

// ✅ GET - lo usan Admin y Contact
export const getBusinessBasics = async () => {
  const res = await axios.get(`${API_URL}/config`, axiosConfig());
  const data = res.data; // BusinessConfigModel

  // Mapear a los nombres que usas en React
  return {
    nombreSpa: data.name,
    direccion: data.address,
    telefono: data.phone,
    email: data.email,
    schedule: data.schedule || null,
  };
};

// ✅ PUT - solo Admin (panel)
export const updateBusinessBasics = async (basics) => {
  // Mapear de vuelta a lo que espera el backend
  const payload = {
    name: basics.nombreSpa,
    address: basics.direccion,
    phone: basics.telefono,
    email: basics.email,
    schedule: basics.schedule || null,
  };

  const res = await axios.put(`${API_URL}/config`, payload, axiosConfig());
  return res.data;
};

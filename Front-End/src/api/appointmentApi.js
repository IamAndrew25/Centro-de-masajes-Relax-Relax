import apiClient from "./axiosConfig";
import { getToken } from './authApi';
const API_URL = '/appointments';

export const createAppointment = async (appointmentData) => {
  const token = getToken();
  if (!token) throw new Error("Usuario no autenticado.");

  try {
    const response = await apiClient.post(API_URL, appointmentData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    console.log("RESPUESTA DEL SERVIDOR:", response.data);

    // Si response.data es string → parsear
    const data =
      typeof response.data === "string"
        ? JSON.parse(response.data)
        : response.data;

    if (!data || !data.id) {
      throw new Error("El backend no devolvió ID");
    }

    return data;

  } catch (error) {
    console.error("Error al crear la cita:", error.response?.data || error);
    throw new Error("Error al crear la cita.");
  }
};


export const getAllAppointments = async () => {
    const token = getToken();
    if (!token) {
        throw new Error("Acceso denegado. Se requiere autenticación.");
    }
    try {
        const response = await apiClient.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener las citas:", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || "Error al cargar las citas.";
        throw new Error(errorMessage);
    }
};
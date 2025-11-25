import axios from 'axios';

const API_URL = 'http://localhost:8080';

const getToken = () => localStorage.getItem('token');

const axiosConfig = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

export const getAllAppointments = async () => {
  try {
    const response = await axios.get(`${API_URL}/appointments`, axiosConfig());
    console.log("📡 Respuesta limpia del backend:", response);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(" Error al obtener las reservas:", error);
    throw error;
  }
};

export const getAllServices = async () => {
    const response = await axios.get(`${API_URL}/services`, axiosConfig());
    return response.data;
};

export const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/user/all`, axiosConfig());
    return response.data;
};

export const createAppointment = async (data) => {
    const response = await axios.post(`${API_URL}/appointments`, data, axiosConfig());
    return response.data;
};

export const updateAppointment = async (id, data) => {
    const response = await axios.put(`${API_URL}/appointments/${id}`, data, axiosConfig());
    return response.data;
};

export const deleteAppointment = async (id) => {
    const response = await axios.delete(`${API_URL}/appointments/${id}`, axiosConfig());
    return response.data;
};

export const getAllClients = async () => {
    const response = await axios.get(`${API_URL}/user/clients`, axiosConfig());
    return response.data;
};

export const getAllWorkers = async () => {
    const response = await axios.get(`${API_URL}/user/workers`, axiosConfig());
    return response.data;
};


//Enviar Excel de reservas por correo 
export const enviarExcelReservas = async () => {
  try {
    const correo = prompt("Ingresa el correo al que enviar el Excel de reservas:");
    if (!correo) return;
    const response = await fetch(`${API_URL}/reports/reservas?correo=${correo}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (response.ok) {
      alert("Reporte de reservas enviado correctamente");
    } else {
      alert("Error al enviar el reporte de reservas");
    }
  } catch (error) {
    console.error(error);
    alert("Error al enviar el reporte de reservas");
  }
};

//  Descargar Excel de reservas 
export const descargarExcelReservas = async () => {
  try {
    const response = await fetch(`${API_URL}/reports/reservas/download`, {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (!response.ok) throw new Error("Error al descargar el Excel");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ReporteReservas.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Error al descargar el reporte de reservas");
  }
};
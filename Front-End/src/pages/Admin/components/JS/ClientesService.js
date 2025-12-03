import axios from 'axios';

const API_URL = 'http://3.16.225.135:8080'; 

const getToken = () => localStorage.getItem('token');

const axiosConfig = () => ({
    headers: { Authorization: `Bearer ${getToken()}` }
});

export const getAllUser = async () => {
    const response = await axios.get(`${API_URL}/user/all`, axiosConfig());
    return response.data;
};

export const createClient = async (data) => {
    const response = await axios.post(`${API_URL}/user`, data, axiosConfig());
    return response.data;
};

export const updateClient = async (id, data) => {
    const response = await axios.put(`${API_URL}/user/${id}`, data, axiosConfig());
    return response.data;
};

export const deleteClient = async (id) => {
    const response = await axios.delete(`${API_URL}/user/${id}`, axiosConfig());
    return response.data;
};

export const getAllClients = async () => {
    const response = await axios.get(`${API_URL}/user/clients`, axiosConfig());
    return response.data;
};

// Enviar reporte de clientes por correo
export const enviarReporteClientes = async () => {
  try {
    const correo = prompt("Ingresa el correo al que enviar el Excel de clientes:");
    if (!correo) return;

    const response = await fetch(`${API_URL}/reports/clientes?correo=${correo}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (response.ok) {
      alert("Reporte de clientes enviado correctamente");
    } else {
      alert("Error al enviar el reporte de clientes");
    }
  } catch (error) {
    console.error(error);
    alert("Error al enviar el reporte de clientes");
  }
};

// Descargar Excel de clientes
export const descargarExcelClientes = async () => {
  try {
    const response = await fetch(`${API_URL}/reports/clientes/download`, {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (!response.ok) throw new Error("Error al descargar el Excel");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ReporteClientes.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Error al descargar el reporte de clientes");
  }
};
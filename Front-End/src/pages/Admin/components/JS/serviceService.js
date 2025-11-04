import axios from 'axios';

const API_URL = 'http://localhost:8080/services';

// Función para obtener el token del localStorage
const getToken = () => localStorage.getItem('token');

// Obtener todos los servicios
export const getAllServices = async () => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

// Crear nuevo servicio
export const createService = async (serviceData) => {
  const response = await axios.post(API_URL, serviceData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

// Actualizar servicio
export const updateService = async (id, serviceData) => {
  const response = await axios.put(`${API_URL}/${id}`, serviceData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

// Eliminar servicio
export const deleteService = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

// Enviar Excel por correo
export const enviarExcelServicios = async () => {
  try {
    const correo = prompt("Ingresa el correo al que enviar el Excel de servicios:");
    if (!correo) return;

    const response = await fetch(`http://localhost:8080/reports/servicios?correo=${correo}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (response.ok) alert("Reporte de servicios enviado correctamente");
    else alert("Error al enviar el reporte de servicios");
  } catch (error) {
    console.error(error);
    alert("Error al enviar el reporte de servicios");
  }
};

// Descargar Excel
export const descargarExcelServicios = async () => {
  try {
    const response = await fetch(`http://localhost:8080/reports/servicios/download`, {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error("Error al descargar el Excel");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ReporteServicios.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Error al descargar el reporte de servicios");
  }
};
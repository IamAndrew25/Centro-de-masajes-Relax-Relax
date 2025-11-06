import axios from 'axios';

const API_URL = 'http://localhost:8080';

const getToken = () => localStorage.getItem('token');

const axiosConfig = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});
//crud x d
export const getAllWorkers = async () => {
    const response = await axios.get(`${API_URL}/user/workers`, axiosConfig());
    return response.data;
};

export const createWorker = async (worker) => {
    const response = await axios.post(`${API_URL}/user`, worker, axiosConfig());
    return response.data;
};

export const updateWorker = async (id, worker) => {
    const response = await axios.put(`${API_URL}/user/worker/${id}`, worker, axiosConfig());
    return response.data;
};

export const deleteWorker = async (id) => {
    const response = await axios.delete(`${API_URL}/user/worker/${id}`, axiosConfig());
    return response.data;
};


//Obtener las disponibilidades de un trabajador
export const getWorkerAvailability = async (workerId) => {
  const response = await axios.get(`${API_URL}/availability/${workerId}`, axiosConfig());
  return response.data;
};

export const saveWorkerAvailability = async (workerId, availability) => {
  const response = await axios.post(
    `${API_URL}/user/worker/${workerId}/availability`,
    availability,
    axiosConfig()
  );
  return response.data;
};

//se envia al correo

export const enviarExcelTrabajadores = async () => {
  try {
    const correo = prompt("Ingresa el correo al que enviar el Excel de trabajadores:");
    if (!correo) return;

    const response = await fetch(`${API_URL}/reports/trabajadores?correo=${correo}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (response.ok) {
      alert("Reporte de trabajadores enviado correctamente");
    } else {
      alert("Error al enviar el reporte de trabajadores");
    }
  } catch (error) {
    console.error(error);
    alert("Error al enviar el reporte de trabajadores");
  }
};
//se descarga 
export const descargarExcelTrabajadores = async () => {
  try {
    const response = await fetch(`${API_URL}/reports/trabajadores/download`, {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (!response.ok) throw new Error("Error al descargar el Excel");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ReporteTrabajadores.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Error al descargar el reporte de trabajadores");
  }
};
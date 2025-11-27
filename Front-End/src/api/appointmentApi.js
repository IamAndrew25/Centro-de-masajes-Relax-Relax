import apiClient from "./axiosConfig";
import { getToken } from "./authApi";
import { createPayment } from "./paymentApi"; // use la lógica existente de pagos

const API_URL = "/appointments";

// ------------
// Crear CITA 
// ------------
export const createAppointment = async (appointmentData) => {
  const token = getToken();
  if (!token) throw new Error("Usuario no autenticado.");

  try {
    const response = await apiClient.post(API_URL, appointmentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    console.log("RESPUESTA DEL SERVIDOR:", response.data);

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

// ------------------------
// Obtener TODAS las citas 
// ------------------------
export const getAllAppointments = async () => {
  const token = getToken();
  if (!token) {
    throw new Error("Acceso denegado. Se requiere autenticación.");
  }
  try {
    const response = await apiClient.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener las citas:",
      error.response?.data || error.message
    );
    const errorMessage =
      error.response?.data?.message || "Error al cargar las citas.";
    throw new Error(errorMessage);
  }
};

// ----------------------------------------
// NUEVO: crear pago para una cita existente
// Usa createPayment de paymentApi
// Añadi la función createPaymentForAppointment, que reutiliza el flujo de pagos que ya existía en paymentApi.
// ----------------------------------------
export const createPaymentForAppointment = async (
  appointmentId,
  amount,
  invoiceType // "BOLETA" o "FACTURA"
) => {
  if (!appointmentId) {
    throw new Error("Falta el ID de la cita (appointmentId).");
  }
  if (typeof amount !== "number" || amount <= 0) {
    throw new Error("Monto inválido para el pago.");
  }
 // Cree un objeto de datos de pago que se le envia al backend.
  const paymentData = {
    appointmentId,
    amount,
    method: "Visa",
    coveredBySubscription: false,
    invoiceType, // El tipo de comprobante que el usuario elija
  };

  // llamo al metodo de la creacion del pago que ya existe en paymentApi.js(createPayment)
  return await createPayment(paymentData);
};

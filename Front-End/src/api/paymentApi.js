import apiClient from "./axiosConfig";
import { jwtDecode } from 'jwt-decode'; 

// Obtener id desde el token
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      // Decodifica el token para obtener la información (claims)
      const decodedToken = jwtDecode(token);
      console.log("Token decodificado:", decodedToken);
      return decodedToken.userId || null;

    } catch (error) {
      console.error("Error decodificando token:", error);
      localStorage.removeItem("token");
      return null;
    }
  }
  return null;
};


// Para crear un pago
export const createPayment = async (paymentData) => {
  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken();

  if (!token) {
    throw new Error("Usuario no autenticado. Por favor, inicia sesión.");
  }
  if (!userId) {
     throw new Error("No se pudo obtener la información del usuario desde la sesión.");
  }
  if (!paymentData || typeof paymentData.amount !== 'number' || paymentData.amount <= 0) {
      throw new Error("Información de pago inválida: Falta el monto o es incorrecto.");
  }

 
  const requestPayload = {
    userId: userId,
    appointmentId: paymentData.appointmentId,
    amount: paymentData.amount,
    method: paymentData.method || "CREDIT_CARD",
    paymentDate: new Date().toISOString(),
    coveredBySubscription: paymentData.coveredBySubscription || false,
  };

  console.log("Enviando payload de pago:", requestPayload);
  try {
    // Realiza la llamada POST al endpoint /payments
    const response = await apiClient.post("/payments", requestPayload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Respuesta del backend (pago):", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear el pago:", error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || error.response?.data?.error || "Error en el servidor al procesar el pago.";
    throw new Error(errorMessage);
  }
};

// Otras funciones relacionadas con pagos

// Ejemplo: Obtener historial de pagos del usuario (GET /payments/my)
export const getUserPayments = async () => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken();

    if (!token || !userId) {
        throw new Error("Usuario no autenticado o ID no encontrado.");
    }

    try {
        const response = await apiClient.get(`/payments/my?userId=${userId}`, {
             headers: {
                Authorization: `Bearer ${token}`
             }
        });
        return response.data;
    } catch (error) {
         console.error("Error al obtener historial de pagos:", error.response?.data || error.message);
         throw error.response?.data || new Error("Error al cargar el historial de pagos.");
    }
};
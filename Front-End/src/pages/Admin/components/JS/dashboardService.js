import apiClient from '../../../../api/axiosConfig';

const API_URL = 'http://localhost:8080/api/dashboard';

// Función para obtener el token del localStorage
const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('⚠️ No se encontró token en localStorage');
  } else {
    console.log('✅ Token encontrado:', token.substring(0, 20) + '...');
  }
  return token;
};

// Configuración de headers con token
const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Obtener todos los servicios
export const getAllServices = async () => {
  const response = await apiClient.get(API_URL, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Obtiene las estadísticas del dashboard desde el backend
 */
export const getDashboardStats = async () => {
    try {
        const response = await apiClient.get(`${API_URL}/stats`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener estadísticas del dashboard:', error);
        throw error;
    }
};

/**
 * Obtiene las reservas recientes desde el backend
 */
export const getRecentReservations = async (limit = 10) => {
    try {
        const response = await apiClient.get(`${API_URL}/reservations/recent`, {
            params: { limit },
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener reservas recientes:', error);
        throw error;
    }
};

/**
 * Obtiene los ingresos por mes desde el backend
 */
export const getMonthlyRevenue = async (months = 6) => {
    try {
        const response = await apiClient.get(`${API_URL}/revenue/monthly`, {
            params: { months },
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener ingresos mensuales:', error);
        throw error;
    }
};

/**
 * Obtiene las reservas por semana desde el backend
 */
export const getWeeklyReservations = async (weeks = 4) => {
    try {
        const response = await apiClient.get(`${API_URL}/reservations/weekly`, {
            params: { weeks },
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener reservas semanales:', error);
        throw error;
    }
};

/**
 * Obtiene los servicios más populares desde el backend
 */
export const getPopularServices = async (limit = 5) => {
    try {
        const response = await apiClient.get(`${API_URL}/services/popular`, {
            params: { limit },
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener servicios populares:', error);
        throw error;
    }
};

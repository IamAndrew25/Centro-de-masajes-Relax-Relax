import axios from '../../../../api/axiosConfig';

const API_URL = '/admin/dashboard';

/**
 * Obtiene las estadísticas del dashboard desde el backend
 */
export const getDashboardStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/stats`);
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
        const response = await axios.get(`${API_URL}/reservations/recent`, {
            params: { limit }
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
        const response = await axios.get(`${API_URL}/revenue/monthly`, {
            params: { months }
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
        const response = await axios.get(`${API_URL}/reservations/weekly`, {
            params: { weeks }
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
        const response = await axios.get(`${API_URL}/services/popular`, {
            params: { limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener servicios populares:', error);
        throw error;
    }
};

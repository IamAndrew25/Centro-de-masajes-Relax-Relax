import axios from '../../../../api/axiosConfig';

/**
 * Obtiene las estadísticas del dashboard
 */
export const getDashboardStats = async () => {
    try {
        const response = await axios.get('/api/dashboard/stats');
        return response.data;
    } catch (error) {
        console.error('Error al obtener estadísticas del dashboard:', error);
        throw error;
    }
};

/**
 * Obtiene las reservas recientes
 */
export const getRecentReservations = async (limit = 10) => {
    try {
        const response = await axios.get(`/api/dashboard/reservations/recent?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener reservas recientes:', error);
        throw error;
    }
};

/**
 * Obtiene los ingresos por mes
 */
export const getMonthlyRevenue = async (months = 6) => {
    try {
        const response = await axios.get(`/api/dashboard/revenue/monthly?months=${months}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener ingresos mensuales:', error);
        throw error;
    }
};

/**
 * Obtiene las reservas por semana
 */
export const getWeeklyReservations = async (weeks = 4) => {
    try {
        const response = await axios.get(`/api/dashboard/reservations/weekly?weeks=${weeks}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener reservas semanales:', error);
        throw error;
    }
};

/**
 * Obtiene los servicios más populares
 */
export const getPopularServices = async (limit = 5) => {
    try {
        const response = await axios.get(`/api/dashboard/services/popular?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener servicios populares:', error);
        throw error;
    }
};

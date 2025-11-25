import apiClient from '../../../../api/axiosConfig';

// ============================================
// SERVICIO DEL DASHBOARD (CONECTADO AL BACKEND)
// ============================================

/**
 * Obtiene las estadísticas principales del dashboard
 * (Reservas hoy, semana, ingresos mes, clientes nuevos)
 */
export const getDashboardStats = async () => {
    try {
        const response = await apiClient.get('/api/dashboard/stats');
        return response.data;
    } catch (error) {
        console.error('Error al obtener estadísticas del dashboard:', error);
        throw error;
    }
};

/**
 * Obtiene las reservas más recientes
 * @param {number} limit - Cantidad de reservas a obtener (defecto: 10)
 */
export const getRecentReservations = async (limit = 10) => {
    try {
        const response = await apiClient.get(`/api/dashboard/reservations/recent`, {
            params: { limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener reservas recientes:', error);
        throw error;
    }
};

/**
 * Obtiene los ingresos agrupados por mes
 * @param {number} months - Cantidad de meses hacia atrás (defecto: 6)
 */
export const getMonthlyRevenue = async (months = 6) => {
    try {
        const response = await apiClient.get(`/api/dashboard/revenue/monthly`, {
            params: { months }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener ingresos mensuales:', error);
        throw error;
    }
};

/**
 * Obtiene el conteo de reservas por semana
 * @param {number} weeks - Cantidad de semanas hacia atrás (defecto: 4)
 */
export const getWeeklyReservations = async (weeks = 4) => {
    try {
        const response = await apiClient.get(`/api/dashboard/reservations/weekly`, {
            params: { weeks }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener reservas semanales:', error);
        throw error;
    }
};

/**
 * Obtiene los servicios más populares
 * @param {number} limit - Cantidad de servicios a mostrar (defecto: 5)
 */
export const getPopularServices = async (limit = 5) => {
    try {
        const response = await apiClient.get(`/api/dashboard/services/popular`, {
            params: { limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener servicios populares:', error);
        // En caso de error, podrías devolver un array vacío para no romper la UI
        throw error; 
    }
};
// import axios from '../../../../api/axiosConfig';

// ============================================
// DATOS MOCK PARA DESARROLLO
// ============================================

// Simular delay de API (optimizado para mejor UX)
const delay = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

// Datos mock para estadísticas del dashboard
const mockDashboardStats = {
    totalReservations: 145,
    totalRevenue: 62000,
    activeClients: 87,
    pendingReservations: 12
};

// Datos mock para reservas recientes
const mockRecentReservations = [
    { id: 1, cliente: 'María García', servicio: 'Masaje Relajante', fecha: '2025-11-07', hora: '10:00', estado: 'confirmada' },
    { id: 2, cliente: 'Juan Pérez', servicio: 'Masaje Deportivo', fecha: '2025-11-07', hora: '14:00', estado: 'pendiente' },
    { id: 3, cliente: 'Ana López', servicio: 'Reflexología', fecha: '2025-11-06', hora: '16:00', estado: 'completada' },
    { id: 4, cliente: 'Carlos Ruiz', servicio: 'Aromaterapia', fecha: '2025-11-06', hora: '11:00', estado: 'completada' },
    { id: 5, cliente: 'Laura Martínez', servicio: 'Masaje de Piedras', fecha: '2025-11-05', hora: '15:00', estado: 'completada' },
];

// Datos mock para ingresos mensuales
const mockMonthlyRevenue = [
    { mes: 'Junio', ingresos: 45000 },
    { mes: 'Julio', ingresos: 52000 },
    { mes: 'Agosto', ingresos: 48000 },
    { mes: 'Septiembre', ingresos: 55000 },
    { mes: 'Octubre', ingresos: 58500 },
    { mes: 'Noviembre', ingresos: 62000 }
];

// Datos mock para reservas por semana
const mockWeeklyReservations = [
    { semana: 'Semana 1', reservas: 12 },
    { semana: 'Semana 2', reservas: 15 },
    { semana: 'Semana 3', reservas: 10 },
    { semana: 'Semana 4', reservas: 18 }
];

// Datos mock para servicios populares
const mockPopularServices = [
    { nombre: 'Masaje Relajante', cantidad: 45 },
    { nombre: 'Masaje Deportivo', cantidad: 38 },
    { nombre: 'Reflexología', cantidad: 32 },
    { nombre: 'Aromaterapia', cantidad: 28 },
    { nombre: 'Masaje de Piedras', cantidad: 25 }
];

/**
 * Obtiene las estadísticas del dashboard
 */
export const getDashboardStats = async () => {
    await delay();
    return mockDashboardStats;
};

/**
 * Obtiene las reservas recientes
 */
export const getRecentReservations = async (limit = 10) => {
    await delay();
    return mockRecentReservations.slice(0, limit);
};

/**
 * Obtiene los ingresos por mes
 */
export const getMonthlyRevenue = async (months = 6) => {
    await delay();
    return mockMonthlyRevenue.slice(-months);
};

/**
 * Obtiene las reservas por semana
 */
export const getWeeklyReservations = async (weeks = 4) => {
    await delay();
    return mockWeeklyReservations.slice(-weeks);
};

/**
 * Obtiene los servicios más populares
 */
export const getPopularServices = async (limit = 5) => {
    await delay();
    return mockPopularServices.slice(0, limit);
};

// Servicio para gestión de Planes y Membresías
// Mock data temporal - reemplazar con llamadas API reales cuando el backend esté listo

let planesData = [
    {
        id: 1,
        nombre: '3 meses',
        descripcion: 'Acceso a reservas online y descuentos exclusivos',
        tipo: 'plan',
        precio: 90,
        precio_anterior: null,
        duracion: 3,
        duracion_unidad: 'meses',
        servicios_incluidos: [
            'Acceso a reservas online sin costo extra',
            'Confirmación inmediata de disponibilidad'
        ],
        beneficios: [
            '5% de descuento en compras de temporada'
        ],
        estado: 'activo',
        destacado: false,
        color: '#4facfe',
        icono: '📅'
    },
    {
        id: 2,
        nombre: '6 meses',
        descripcion: 'Atención prioritaria y descuentos especiales',
        tipo: 'plan',
        precio: 160,
        precio_anterior: null,
        duracion: 6,
        duracion_unidad: 'meses',
        servicios_incluidos: [
            'Todos los beneficios del plan básico',
            'Atención prioritaria en reservas',
            'Acceso anticipado a promociones'
        ],
        beneficios: [
            '10% de descuento en paquetes especiales',
            '10% ahorro comparado al plan mensual'
        ],
        estado: 'activo',
        destacado: true,
        color: '#667eea',
        icono: '💎'
    },
    {
        id: 3,
        nombre: '1 año',
        descripcion: 'Experiencia VIP completa con máximos beneficios',
        tipo: 'membresia',
        precio: 350,
        precio_anterior: null,
        duracion: 12,
        duracion_unidad: 'meses',
        servicios_incluidos: [
            'Todos los beneficios del plan Premium',
            'Atención VIP personalizada',
            'Eventos exclusivos para miembros',
            'Regalo de bienvenida premium'
        ],
        beneficios: [
            '15% de descuento en todos los servicios',
            '25% ahorro comparado al plan mensual',
            'Acceso prioritario a nuevos servicios',
            'Sesión de consulta personalizada gratuita'
        ],
        estado: 'activo',
        destacado: false,
        color: '#f093fb',
        icono: '👑'
    }
];

let nextId = 4;

// Simular delay de API (optimizado para mejor UX)
const delay = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

// GET - Obtener todos los planes
export const getPlanes = async () => {
    await delay();
    return [...planesData];
};

// GET - Obtener un plan por ID
export const getPlanById = async (id) => {
    await delay();
    const plan = planesData.find(p => p.id === parseInt(id));
    if (!plan) {
        throw new Error('Plan no encontrado');
    }
    return plan;
};

// POST - Crear nuevo plan
export const createPlan = async (planData) => {
    await delay();
    const newPlan = {
        id: nextId++,
        ...planData,
        fecha_creacion: new Date().toISOString()
    };
    planesData.push(newPlan);
    return newPlan;
};

// PUT - Actualizar plan existente
export const updatePlan = async (id, planData) => {
    await delay();
    const index = planesData.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
        throw new Error('Plan no encontrado');
    }
    planesData[index] = {
        ...planesData[index],
        ...planData,
        fecha_actualizacion: new Date().toISOString()
    };
    return planesData[index];
};

// DELETE - Eliminar plan
export const deletePlan = async (id) => {
    await delay();
    const index = planesData.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
        throw new Error('Plan no encontrado');
    }
    planesData.splice(index, 1);
    return { success: true, message: 'Plan eliminado correctamente' };
};

// GET - Obtener planes activos
export const getPlanesActivos = async () => {
    await delay();
    return planesData.filter(p => p.estado === 'activo');
};

// GET - Obtener planes por tipo (plan/membresia)
export const getPlanesPorTipo = async (tipo) => {
    await delay();
    return planesData.filter(p => p.tipo === tipo && p.estado === 'activo');
};

// GET - Obtener planes destacados
export const getPlanesDestacados = async () => {
    await delay();
    return planesData.filter(p => p.destacado && p.estado === 'activo');
};

// GET - Obtener estadísticas de planes
export const getEstadisticasPlanes = async () => {
    await delay();
    const activos = planesData.filter(p => p.estado === 'activo').length;
    const planes = planesData.filter(p => p.tipo === 'plan').length;
    const membresias = planesData.filter(p => p.tipo === 'membresia').length;
    const destacados = planesData.filter(p => p.destacado).length;
    
    return {
        total: planesData.length,
        activos: activos,
        inactivos: planesData.filter(p => p.estado === 'inactivo').length,
        planes: planes,
        membresias: membresias,
        destacados: destacados
    };
};

// POST - Calcular precio con descuento
export const calcularPrecioConDescuento = async (planId, codigoPromocion) => {
    await delay();
    const plan = planesData.find(p => p.id === parseInt(planId));
    if (!plan) {
        throw new Error('Plan no encontrado');
    }
    
    // Aquí se integraría con el servicio de promociones
    // Por ahora retornamos el precio base
    return {
        precioBase: plan.precio,
        descuento: 0,
        precioFinal: plan.precio
    };
};

// GET - Comparar planes
export const compararPlanes = async (idsPlanes) => {
    await delay();
    const planes = planesData.filter(p => idsPlanes.includes(p.id));
    
    return {
        planes: planes,
        comparacion: {
            precioMinimo: Math.min(...planes.map(p => p.precio)),
            precioMaximo: Math.max(...planes.map(p => p.precio)),
            serviciosTotales: [...new Set(planes.flatMap(p => p.servicios_incluidos))].length
        }
    };
};

// POST - Activar/Desactivar plan
export const toggleEstadoPlan = async (id) => {
    await delay();
    const plan = planesData.find(p => p.id === parseInt(id));
    if (!plan) {
        throw new Error('Plan no encontrado');
    }
    
    plan.estado = plan.estado === 'activo' ? 'inactivo' : 'activo';
    return plan;
};

// POST - Destacar/Quitar destacado de plan
export const toggleDestacadoPlan = async (id) => {
    await delay();
    const plan = planesData.find(p => p.id === parseInt(id));
    if (!plan) {
        throw new Error('Plan no encontrado');
    }
    
    plan.destacado = !plan.destacado;
    return plan;
};

export default {
    getPlanes,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan,
    getPlanesActivos,
    getPlanesPorTipo,
    getPlanesDestacados,
    getEstadisticasPlanes,
    calcularPrecioConDescuento,
    compararPlanes,
    toggleEstadoPlan,
    toggleDestacadoPlan
};

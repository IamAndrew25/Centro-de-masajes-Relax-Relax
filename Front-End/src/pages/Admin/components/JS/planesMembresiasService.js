// Servicio para gestión de Planes y Membresías
// Mock data temporal - reemplazar con llamadas API reales cuando el backend esté listo

let planesData = [
    {
        id: 1,
        nombre: 'Plan Básico',
        descripcion: 'Perfecto para comenzar tu viaje de relajación',
        tipo: 'plan',
        precio: 89.99,
        precio_anterior: null,
        duracion: 1,
        duracion_unidad: 'meses',
        servicios_incluidos: [
            '2 Masajes relajantes (60 min)',
            '1 Masaje de piedras calientes',
            'Acceso a sauna'
        ],
        beneficios: [
            '10% descuento en servicios adicionales',
            'Reservas con prioridad'
        ],
        estado: 'activo',
        destacado: false,
        color: '#4facfe',
        icono: '🌊'
    },
    {
        id: 2,
        nombre: 'Plan Premium',
        descripcion: 'La experiencia completa de relajación y bienestar',
        tipo: 'plan',
        precio: 149.99,
        precio_anterior: 199.99,
        duracion: 1,
        duracion_unidad: 'meses',
        servicios_incluidos: [
            '4 Masajes de tu elección (60 min)',
            '2 Masajes con aromaterapia',
            '1 Tratamiento facial',
            'Acceso ilimitado a sauna y jacuzzi'
        ],
        beneficios: [
            '20% descuento en todos los servicios',
            'Reservas con prioridad',
            '1 invitación gratis para acompañante',
            'Productos de spa con 15% descuento'
        ],
        estado: 'activo',
        destacado: true,
        color: '#667eea',
        icono: '💎'
    },
    {
        id: 3,
        nombre: 'Membresía VIP',
        descripcion: 'Acceso ilimitado a todos nuestros servicios premium',
        tipo: 'membresia',
        precio: 299.99,
        precio_anterior: 399.99,
        duracion: 3,
        duracion_unidad: 'meses',
        servicios_incluidos: [
            'Masajes ilimitados (60 min)',
            '8 Masajes premium (90 min)',
            '4 Tratamientos faciales',
            'Acceso VIP a todas las instalaciones',
            'Terapia de pareja mensual'
        ],
        beneficios: [
            '30% descuento permanente',
            'Reservas sin restricciones',
            'Atención personalizada 24/7',
            'Invitaciones ilimitadas',
            'Kit de productos premium mensual',
            'Acceso a eventos exclusivos'
        ],
        estado: 'activo',
        destacado: false,
        color: '#f093fb',
        icono: '👑'
    },
    {
        id: 4,
        nombre: 'Plan Parejas',
        descripcion: 'Momentos especiales para compartir en pareja',
        tipo: 'plan',
        precio: 179.99,
        precio_anterior: null,
        duracion: 1,
        duracion_unidad: 'meses',
        servicios_incluidos: [
            '2 Masajes en pareja (90 min)',
            '1 Sesión de aromaterapia para dos',
            'Acceso a sala VIP de parejas',
            'Copa de champagne incluida'
        ],
        beneficios: [
            '15% descuento en próximas sesiones',
            'Fotografía romántica de cortesía',
            'Reserva de aniversario gratis'
        ],
        estado: 'activo',
        destacado: false,
        color: '#ff6b6b',
        icono: '💑'
    }
];

let nextId = 5;

// Simular delay de API
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

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

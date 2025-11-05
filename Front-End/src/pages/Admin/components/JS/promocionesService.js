// Servicio para gestión de Promociones
// Mock data temporal - reemplazar con llamadas API reales cuando el backend esté listo

let promocionesData = [
    {
        id: 1,
        nombre: 'Descuento Verano 2024',
        descripcion: 'Aprovecha un 25% de descuento en todos nuestros servicios de masajes durante todo el verano',
        descuento: 25,
        tipo_descuento: 'porcentaje',
        codigo: 'VERANO2024',
        fecha_inicio: '2024-06-01',
        fecha_fin: '2024-08-31',
        estado: 'activa',
        imagen_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
        condiciones: 'Válido para reservas superiores a S/ 150'
    },
    {
        id: 2,
        nombre: 'Primera Visita',
        descripcion: 'Descuento especial para nuevos clientes en su primera sesión',
        descuento: 50,
        tipo_descuento: 'monto',
        codigo: 'PRIMERAVEZ',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        estado: 'activa',
        imagen_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
        condiciones: 'Solo para clientes nuevos. No acumulable con otras promociones'
    },
    {
        id: 3,
        nombre: 'Happy Hour',
        descripcion: 'Descuento especial en horarios de 2pm a 4pm de lunes a viernes',
        descuento: 20,
        tipo_descuento: 'porcentaje',
        codigo: 'HAPPYHOUR',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        estado: 'activa',
        imagen_url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400',
        condiciones: 'Válido de lunes a viernes de 2pm a 4pm'
    }
];

let nextId = 4;

// Simular delay de API
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// GET - Obtener todas las promociones
export const getPromociones = async () => {
    await delay();
    return [...promocionesData];
};

// GET - Obtener una promoción por ID
export const getPromocionById = async (id) => {
    await delay();
    const promocion = promocionesData.find(p => p.id === parseInt(id));
    if (!promocion) {
        throw new Error('Promoción no encontrada');
    }
    return promocion;
};

// POST - Crear nueva promoción
export const createPromocion = async (promocionData) => {
    await delay();
    const newPromocion = {
        id: nextId++,
        ...promocionData,
        fecha_creacion: new Date().toISOString()
    };
    promocionesData.push(newPromocion);
    return newPromocion;
};

// PUT - Actualizar promoción existente
export const updatePromocion = async (id, promocionData) => {
    await delay();
    const index = promocionesData.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
        throw new Error('Promoción no encontrada');
    }
    promocionesData[index] = {
        ...promocionesData[index],
        ...promocionData,
        fecha_actualizacion: new Date().toISOString()
    };
    return promocionesData[index];
};

// DELETE - Eliminar promoción
export const deletePromocion = async (id) => {
    await delay();
    const index = promocionesData.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
        throw new Error('Promoción no encontrada');
    }
    promocionesData.splice(index, 1);
    return { success: true, message: 'Promoción eliminada correctamente' };
};

// GET - Obtener promociones activas
export const getPromocionesActivas = async () => {
    await delay();
    const ahora = new Date();
    return promocionesData.filter(p => {
        const fechaInicio = new Date(p.fecha_inicio);
        const fechaFin = new Date(p.fecha_fin);
        return p.estado === 'activa' && ahora >= fechaInicio && ahora <= fechaFin;
    });
};

// POST - Validar código promocional
export const validarCodigoPromocion = async (codigo) => {
    await delay();
    const ahora = new Date();
    const promocion = promocionesData.find(p => {
        const fechaInicio = new Date(p.fecha_inicio);
        const fechaFin = new Date(p.fecha_fin);
        return p.codigo.toUpperCase() === codigo.toUpperCase() &&
               p.estado === 'activa' &&
               ahora >= fechaInicio &&
               ahora <= fechaFin;
    });
    
    if (!promocion) {
        throw new Error('Código promocional inválido o expirado');
    }
    
    return {
        valido: true,
        promocion: promocion
    };
};

// GET - Obtener estadísticas de promociones
export const getEstadisticasPromociones = async () => {
    await delay();
    const ahora = new Date();
    const activas = promocionesData.filter(p => {
        const fechaInicio = new Date(p.fecha_inicio);
        const fechaFin = new Date(p.fecha_fin);
        return p.estado === 'activa' && ahora >= fechaInicio && ahora <= fechaFin;
    }).length;
    
    return {
        total: promocionesData.length,
        activas: activas,
        inactivas: promocionesData.filter(p => p.estado === 'inactiva').length,
        proximas: promocionesData.filter(p => {
            const fechaInicio = new Date(p.fecha_inicio);
            return fechaInicio > ahora;
        }).length
    };
};

export default {
    getPromociones,
    getPromocionById,
    createPromocion,
    updatePromocion,
    deletePromocion,
    getPromocionesActivas,
    validarCodigoPromocion,
    getEstadisticasPromociones
};

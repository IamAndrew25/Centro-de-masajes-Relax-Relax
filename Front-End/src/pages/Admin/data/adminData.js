// Datos estáticos para la aplicación admin

export const RESERVAS_DATA = [
    { id: 1, cliente: "María García", servicio: "Masaje Relajante", fecha: "2025-09-27", hora: "10:00", estado: "confirmada" },
    { id: 2, cliente: "Juan Pérez", servicio: "Masaje Deportivo", fecha: "2025-09-27", hora: "14:30", estado: "pendiente" },
    { id: 3, cliente: "Ana López", servicio: "Masaje Terapéutico", fecha: "2025-09-27", hora: "16:00", estado: "confirmada" },
    { id: 4, cliente: "Carlos Ruiz", servicio: "Masaje con Piedras", fecha: "2025-09-28", hora: "11:00", estado: "pendiente" }
];

export const SERVICIOS_DATA = [
    { id: 1, nombre: "Masaje Relajante", duracion: "60 min", precio: 450 },
    { id: 2, nombre: "Masaje Deportivo", duracion: "90 min", precio: 650 },
    { id: 3, nombre: "Masaje Terapéutico", duracion: "75 min", precio: 580 },
    { id: 4, nombre: "Masaje con Piedras", duracion: "120 min", precio: 850 }
];

export const CLIENTES_DATA = [
    { id: 1, nombre: "👩 María García", telefono: "+1 (555) 123-4567", email: "maria@email.com", ultimaVisita: "15/09/2025", servicios: 12 },
    { id: 2, nombre: "👨 Juan Pérez", telefono: "+1 (555) 987-6543", email: "juan@email.com", ultimaVisita: "20/09/2025", servicios: 8 },
    { id: 3, nombre: "👩 Ana López", telefono: "+1 (555) 456-7890", email: "ana@email.com", ultimaVisita: "22/09/2025", servicios: 15 },
    { id: 4, nombre: "👨 Carlos Ruiz", telefono: "+1 (555) 321-0987", email: "carlos@email.com", ultimaVisita: "25/09/2025", servicios: 5 }
];

export const REPORTES_DATA = {
    ingresosPorServicio: [
        { nombre: "Masaje Relajante", monto: 19980, porcentaje: 34 },
        { nombre: "Masaje Deportivo", monto: 15540, porcentaje: 26 },
        { nombre: "Masaje Terapéutico", monto: 14615, porcentaje: 25 },
        { nombre: "Masaje con Piedras", monto: 9065, porcentaje: 16 }
    ],
    metodosPago: [
        { metodo: "💳 Tarjeta", porcentaje: 65 },
        { metodo: "💵 Efectivo", porcentaje: 25 },
        { metodo: "📱 Transferencia", porcentaje: 10 }
    ],
    ocupacionHorarios: [
        { horario: "9:00 - 11:00", porcentaje: 85 },
        { horario: "11:00 - 13:00", porcentaje: 95 },
        { horario: "13:00 - 15:00", porcentaje: 70 },
        { horario: "15:00 - 17:00", porcentaje: 90 }
    ],
    diasPopulares: [
        { dia: "Viernes", porcentaje: 92 },
        { dia: "Sábado", porcentaje: 88 },
        { dia: "Jueves", porcentaje: 76 },
        { dia: "Miércoles", porcentaje: 65 }
    ],
    clientesFrecuentes: [
        { nombre: "María García", visitas: 15 },
        { nombre: "Ana López", visitas: 12 },
        { nombre: "Carmen Silva", visitas: 10 },
        { nombre: "Laura Martín", visitas: 8 }
    ]
};

export const FORM_OPTIONS = {
    preferencias: [
        { value: "relajante", label: "Masaje Relajante" },
        { value: "deportivo", label: "Masaje Deportivo" },
        { value: "terapeutico", label: "Masaje Terapéutico" },
        { value: "piedras", label: "Masaje con Piedras Calientes" }
    ],
    fuentes: [
        { value: "instagram", label: "Instagram" },
        { value: "facebook", label: "Facebook" },
        { value: "tiktok", label: "TikTok" },
        { value: "google", label: "Google" },
        { value: "referido", label: "Referido por cliente" },
        { value: "walk-in", label: "Pasó por el local" },
        { value: "otros", label: "Otros" }
    ]
};
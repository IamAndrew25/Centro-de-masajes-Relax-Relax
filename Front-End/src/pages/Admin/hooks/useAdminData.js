import { useState, useEffect } from 'react';
import { getDashboardStats } from '../components/JS/dashboardService';

// Hook para manejar datos de clientes
export const useClienteData = () => {
    const [showNewClientModal, setShowNewClientModal] = useState(false);
    const [newClientData, setNewClientData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        fechaNacimiento: '',
        direccion: '',
        preferencias: '',
        notas: '',
        fuente: ''
    });

    const handleNewClient = () => {
        setShowNewClientModal(true);
    };

    const handleInputChange = (field, value) => {
        setNewClientData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveClient = () => {
        console.log('Guardando cliente:', newClientData);
        alert('Cliente guardado exitosamente!');
        setShowNewClientModal(false);
        setNewClientData({
            nombre: '',
            telefono: '',
            email: '',
            fechaNacimiento: '',
            direccion: '',
            preferencias: '',
            notas: '',
            fuente: ''
        });
    };

    return {
        showNewClientModal,
        setShowNewClientModal,
        newClientData,
        handleNewClient,
        handleInputChange,
        handleSaveClient
    };
};

// Hook para manejar datos de servicios
export const useServicioData = () => {
    const [showNewServiceModal, setShowNewServiceModal] = useState(false);
    const [newServiceData, setNewServiceData] = useState({
        nombre: '',
        duracion: '',
        precio: '',
        descripcion: ''
    });

    const handleNewService = () => {
        setShowNewServiceModal(true);
    };

    const handleServiceInputChange = (field, value) => {
        setNewServiceData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveService = () => {
        console.log('Guardando servicio:', newServiceData);
        alert('Servicio creado exitosamente!');
        setShowNewServiceModal(false);
        setNewServiceData({
            nombre: '',
            duracion: '',
            precio: '',
            descripcion: ''
        });
    };

    return {
        showNewServiceModal,
        setShowNewServiceModal,
        newServiceData,
        handleNewService,
        handleServiceInputChange,
        handleSaveService
    };
};

// Hook para manejar datos de trabajadores
export const useWorkersData = () => {
    const [showNewWorkerModal, setShowNewWorkerModal] = useState(false);
    const [showEditWorkerModal, setShowEditWorkerModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [newWorkerData, setNewWorkerData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        fechaNacimiento: '',
        direccion: '',
        especialidad: '',
        tipoHorario: '',
        experiencia: '',
        salario: '',
        licencia: '',
        estado: '',
        notas: ''
    });

    const [editWorkerData, setEditWorkerData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        fechaNacimiento: '',
        direccion: '',
        especialidad: '',
        tipoHorario: '',
        experiencia: '',
        salario: '',
        licencia: '',
        estado: '',
        notas: ''
    });

    const [scheduleData, setScheduleData] = useState({
        lunes: { inicio: '09:00', fin: '17:00', activo: true },
        martes: { inicio: '09:00', fin: '17:00', activo: true },
        miercoles: { inicio: '09:00', fin: '17:00', activo: true },
        jueves: { inicio: '09:00', fin: '17:00', activo: true },
        viernes: { inicio: '09:00', fin: '17:00', activo: true },
        sabado: { inicio: '09:00', fin: '14:00', activo: true },
        domingo: { inicio: '09:00', fin: '14:00', activo: false }
    });

    const handleNewWorker = () => {
        setShowNewWorkerModal(true);
    };

    const handleEditWorker = (worker) => {
        setSelectedWorker(worker);
        setEditWorkerData({
            nombre: worker.nombre.replace('🧑‍⚕️ ', ''),
            telefono: worker.telefono,
            email: worker.email,
            fechaNacimiento: '',
            direccion: '',
            especialidad: worker.especialidad,
            tipoHorario: '',
            experiencia: worker.experiencia,
            salario: '',
            licencia: '',
            estado: worker.estado.toLowerCase(),
            notas: ''
        });
        setShowEditWorkerModal(true);
    };

    const handleScheduleWorker = (worker) => {
        setSelectedWorker(worker);
        setShowScheduleModal(true);
    };

    const handleWorkerInputChange = (field, value) => {
        setNewWorkerData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditWorkerInputChange = (field, value) => {
        setEditWorkerData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleScheduleChange = (day, field, value) => {
        setScheduleData(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }));
    };

    const handleSaveWorker = () => {
        console.log('Guardando trabajador:', newWorkerData);
        alert('Trabajador guardado exitosamente!');
        setShowNewWorkerModal(false);
        setNewWorkerData({
            nombre: '',
            telefono: '',
            email: '',
            fechaNacimiento: '',
            direccion: '',
            especialidad: '',
            tipoHorario: '',
            experiencia: '',
            salario: '',
            licencia: '',
            estado: '',
            notas: ''
        });
    };

    const handleSaveEditWorker = () => {
        console.log('Actualizando trabajador:', selectedWorker.id, editWorkerData);
        alert(`Trabajador ${editWorkerData.nombre} actualizado exitosamente!`);
        setShowEditWorkerModal(false);
        setSelectedWorker(null);
        setEditWorkerData({
            nombre: '',
            telefono: '',
            email: '',
            fechaNacimiento: '',
            direccion: '',
            especialidad: '',
            tipoHorario: '',
            experiencia: '',
            salario: '',
            licencia: '',
            estado: '',
            notas: ''
        });
    };

    const handleSaveSchedule = () => {
        console.log('Guardando horarios para:', selectedWorker.nombre, scheduleData);
        alert(`Horarios de ${selectedWorker.nombre.replace('🧑‍⚕️ ', '')} actualizados exitosamente!`);
        setShowScheduleModal(false);
        setSelectedWorker(null);
    };

    return {
        showNewWorkerModal,
        setShowNewWorkerModal,
        showEditWorkerModal,
        setShowEditWorkerModal,
        showScheduleModal,
        setShowScheduleModal,
        selectedWorker,
        newWorkerData,
        editWorkerData,
        scheduleData,
        handleNewWorker,
        handleEditWorker,
        handleScheduleWorker,
        handleWorkerInputChange,
        handleEditWorkerInputChange,
        handleScheduleChange,
        handleSaveWorker,
        handleSaveEditWorker,
        handleSaveSchedule
    };
};

// Hook para estadísticas
export const useStats = () => {
    const [stats, setStats] = useState({
        reservasHoy: 0,
        reservasSemana: 0,
        ingresosMes: 0,
        clientesNuevos: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getDashboardStats();
                setStats(data);
                setError(null);
            } catch (err) {
                console.error('Error al cargar estadísticas:', err);
                setError('Error al cargar estadísticas');
                // Mantener datos de ejemplo si falla
                setStats({
                    reservasHoy: 12,
                    reservasSemana: 45,
                    ingresosMes: 58500,
                    clientesNuevos: 8
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        
        // Actualizar cada 5 minutos
        const interval = setInterval(fetchStats, 5 * 60 * 1000);
        
        return () => clearInterval(interval);
    }, []);

    return { stats, loading, error };
};
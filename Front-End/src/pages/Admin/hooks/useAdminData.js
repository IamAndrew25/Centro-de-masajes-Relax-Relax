import { useState } from 'react';

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

// Hook para estadísticas
export const useStats = () => {
    const stats = {
        reservasHoy: 12,
        reservasSemana: 45,
        ingresosMes: 58500,
        clientesNuevos: 8
    };

    return { stats };
};
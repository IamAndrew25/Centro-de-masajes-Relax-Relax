import React, { useState } from 'react';
import './Admin.css';

// Importar componentes modulares
import Dashboard from './components/Dashboard';
import Reservas from './components/Reservas';
import Servicios from './components/Servicios';
import Clientes from './components/Clientes';
import Trabajadores from './components/Trabajadores';
import Reportes from './components/Reportes';
import Configuracion from './components/Configuracion';

// Importar hooks personalizados
import { useClienteData, useServicioData, useWorkersData, useStats } from './hooks/useAdminData';

const Admin = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    
    // Usar hooks personalizados para manejar estados
    const { stats } = useStats();
    const clienteHooks = useClienteData();
    const servicioHooks = useServicioData();
    const workersHooks = useWorkersData();

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <div className="admin-sidebar">
                <div className="admin-logo">
                    <h2>Relax Total</h2>
                    <span>Admin Panel</span>
                </div>
                
                <nav className="admin-nav">
                    <button 
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        📊 Dashboard
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'reservas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reservas')}
                    >
                        📅 Reservas
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'clientes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('clientes')}
                    >
                        👥 Clientes
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'trabajadores' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trabajadores')}
                    >
                        👨‍💼 Trabajadores
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'servicios' ? 'active' : ''}`}
                        onClick={() => setActiveTab('servicios')}
                    >
                        💆‍♀️ Servicios
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'reportes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reportes')}
                    >
                        📈 Reportes
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'config' ? 'active' : ''}`}
                        onClick={() => setActiveTab('config')}
                    >
                        ⚙️ Configuración
                    </button>
                </nav>

                <div className="admin-footer">
                    <button className="logout-btn" onClick={onLogout}>🚪 Cerrar Sesión</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-main">
                {/* Header */}
                <div className="admin-header">
                    <h1>Panel de Administración</h1>
                    <div className="admin-user">
                        <span>👤 Administrador</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="admin-content">
                    {activeTab === 'dashboard' && (
                        <Dashboard stats={stats} setActiveTab={setActiveTab} />
                    )}

                    {activeTab === 'reservas' && (
                        <Reservas />
                    )}

                    {activeTab === 'servicios' && (
                        <Servicios 
                            handleNewService={servicioHooks.handleNewService}
                            showNewServiceModal={servicioHooks.showNewServiceModal}
                            setShowNewServiceModal={servicioHooks.setShowNewServiceModal}
                            newServiceData={servicioHooks.newServiceData}
                            handleServiceInputChange={servicioHooks.handleServiceInputChange}
                            handleSaveService={servicioHooks.handleSaveService}
                        />
                    )}

                    {activeTab === 'clientes' && (
                        <Clientes 
                            handleNewClient={clienteHooks.handleNewClient}
                            showNewClientModal={clienteHooks.showNewClientModal}
                            setShowNewClientModal={clienteHooks.setShowNewClientModal}
                            newClientData={clienteHooks.newClientData}
                            handleInputChange={clienteHooks.handleInputChange}
                            handleSaveClient={clienteHooks.handleSaveClient}
                        />
                    )}

                    {activeTab === 'trabajadores' && (
                        <Trabajadores 
                            handleNewWorker={workersHooks.handleNewWorker}
                            showNewWorkerModal={workersHooks.showNewWorkerModal}
                            setShowNewWorkerModal={workersHooks.setShowNewWorkerModal}
                            newWorkerData={workersHooks.newWorkerData}
                            handleWorkerInputChange={workersHooks.handleWorkerInputChange}
                            handleSaveWorker={workersHooks.handleSaveWorker}
                            showEditWorkerModal={workersHooks.showEditWorkerModal}
                            setShowEditWorkerModal={workersHooks.setShowEditWorkerModal}
                            showScheduleModal={workersHooks.showScheduleModal}
                            setShowScheduleModal={workersHooks.setShowScheduleModal}
                            selectedWorker={workersHooks.selectedWorker}
                            editWorkerData={workersHooks.editWorkerData}
                            scheduleData={workersHooks.scheduleData}
                            handleEditWorker={workersHooks.handleEditWorker}
                            handleScheduleWorker={workersHooks.handleScheduleWorker}
                            handleEditWorkerInputChange={workersHooks.handleEditWorkerInputChange}
                            handleScheduleChange={workersHooks.handleScheduleChange}
                            handleSaveEditWorker={workersHooks.handleSaveEditWorker}
                            handleSaveSchedule={workersHooks.handleSaveSchedule}
                        />
                    )}

                    {activeTab === 'reportes' && (
                        <Reportes />
                    )}

                    {activeTab === 'config' && (
                        <Configuracion />
                    )}
                </div>
            </div>

            {/* Modal Nuevo Cliente */}
            {/* Modal movido al componente Clientes */}

            {/* Modal Nuevo Servicio */}
            {/* Modal movido al componente Servicios */}
        </div>
    );
};

export default Admin;
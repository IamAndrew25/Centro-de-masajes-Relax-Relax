import React, { useState } from 'react';
import './Admin.css';

const Admin = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showNewClientModal, setShowNewClientModal] = useState(false);
    const [showNewServiceModal, setShowNewServiceModal] = useState(false);
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
    const [newServiceData, setNewServiceData] = useState({
        nombre: '',
        duracion: '',
        precio: '',
        descripcion: ''
    });

    // Datos de ejemplo para las estadísticas
    const stats = {
        reservasHoy: 12,
        reservasSemana: 45,
        ingresosMes: 58500, // Convertido a soles (15,850 USD * 3.7)
        clientesNuevos: 8
    };

    // Funciones para manejar el nuevo cliente
    const handleNewClient = () => {
        setShowNewClientModal(true);
    };

    const handleCloseModal = () => {
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

    const handleInputChange = (field, value) => {
        setNewClientData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveClient = () => {
        // Aquí irían las validaciones y el guardado real
        console.log('Guardando cliente:', newClientData);
        alert('Cliente guardado exitosamente!');
        handleCloseModal();
    };

    // Funciones para manejar nuevo servicio
    const handleNewService = () => {
        setShowNewServiceModal(true);
    };

    const handleCloseServiceModal = () => {
        setShowNewServiceModal(false);
        setNewServiceData({
            nombre: '',
            duracion: '',
            precio: '',
            descripcion: ''
        });
    };

    const handleServiceInputChange = (field, value) => {
        setNewServiceData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveService = () => {
        // Aquí irían las validaciones y el guardado real
        console.log('Guardando servicio:', newServiceData);
        alert('Servicio creado exitosamente!');
        handleCloseServiceModal();
    };

    // Datos de ejemplo para reservas
    const reservas = [
        { id: 1, cliente: "María García", servicio: "Masaje Relajante", fecha: "2025-09-27", hora: "10:00", estado: "confirmada" },
        { id: 2, cliente: "Juan Pérez", servicio: "Masaje Deportivo", fecha: "2025-09-27", hora: "14:30", estado: "pendiente" },
        { id: 3, cliente: "Ana López", servicio: "Masaje Terapéutico", fecha: "2025-09-27", hora: "16:00", estado: "confirmada" },
        { id: 4, cliente: "Carlos Ruiz", servicio: "Masaje con Piedras", fecha: "2025-09-28", hora: "11:00", estado: "pendiente" }
    ];

    // Datos de ejemplo para servicios
    const servicios = [
        { id: 1, nombre: "Masaje Relajante", duracion: "60 min", precio: 450 },
        { id: 2, nombre: "Masaje Deportivo", duracion: "90 min", precio: 650 },
        { id: 3, nombre: "Masaje Terapéutico", duracion: "75 min", precio: 580 },
        { id: 4, nombre: "Masaje con Piedras", duracion: "120 min", precio: 850 }
    ];

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
                        <div className="dashboard">
                            <h2>Dashboard Principal</h2>
                            
                            {/* Stats Cards */}
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">📅</div>
                                    <div className="stat-info">
                                        <h3>{stats.reservasHoy}</h3>
                                        <p>Reservas Hoy</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">📊</div>
                                    <div className="stat-info">
                                        <h3>{stats.reservasSemana}</h3>
                                        <p>Reservas Semana</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-info">
                                        <h3>S/ {stats.ingresosMes.toLocaleString()}</h3>
                                        <p>Ingresos Mes</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">👥</div>
                                    <div className="stat-info">
                                        <h3>{stats.clientesNuevos}</h3>
                                        <p>Clientes Nuevos</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="quick-actions">
                                <h3>Acciones Rápidas</h3>
                                <div className="action-buttons">
                                    <button className="action-btn" onClick={() => setActiveTab('reservas')}>
                                        Nueva Reserva
                                    </button>
                                    <button className="action-btn" onClick={() => setActiveTab('clientes')}>
                                        Agregar Cliente
                                    </button>
                                    <button className="action-btn" onClick={() => setActiveTab('reportes')}>
                                        Ver Reportes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reservas' && (
                        <div className="reservas">
                            <div className="section-header">
                                <h2>Gestión de Reservas</h2>
                                <button className="btn-primary">Nueva Reserva</button>
                            </div>
                            
                            <div className="table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Cliente</th>
                                            <th>Servicio</th>
                                            <th>Fecha</th>
                                            <th>Hora</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservas.map(reserva => (
                                            <tr key={reserva.id}>
                                                <td>{reserva.cliente}</td>
                                                <td>{reserva.servicio}</td>
                                                <td>{reserva.fecha}</td>
                                                <td>{reserva.hora}</td>
                                                <td>
                                                    <span className={`status ${reserva.estado}`}>
                                                        {reserva.estado}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons-small">
                                                        <button className="btn-edit">✏️</button>
                                                        <button className="btn-delete">🗑️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'servicios' && (
                        <div className="servicios">
                            <div className="section-header">
                                <h2>💆‍♀️ Gestión de Servicios</h2>
                                <button className="btn-primary" onClick={handleNewService}>
                                    ➕ Nuevo Servicio
                                </button>
                            </div>
                            
                            <div className="services-grid">
                                {servicios.map(servicio => (
                                    <div key={servicio.id} className="service-card">
                                        <h3>{servicio.nombre}</h3>
                                        <p className="duration">⏱️ {servicio.duracion}</p>
                                        <p className="price">S/ {servicio.precio}</p>
                                        <div className="service-actions">
                                            <button className="btn-edit">Editar</button>
                                            <button className="btn-delete">Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'clientes' && (
                        <div className="clientes">
                            <div className="section-header">
                                <h2>👥 Gestión de Clientes</h2>
                                <button className="btn-primary" onClick={handleNewClient}>
                                    ➕ Nuevo Cliente
                                </button>
                            </div>
                            
                            {/* Lista de Clientes */}
                            <div className="clients-grid">
                                <div className="client-card">
                                    <div className="client-info">
                                        <h4>👩 María García</h4>
                                        <p>📞 +1 (555) 123-4567</p>
                                        <p>📧 maria@email.com</p>
                                        <p>🗓️ Última visita: 15/09/2025</p>
                                        <p>💆‍♀️ Servicios: 12 sesiones</p>
                                    </div>
                                    <div className="client-actions">
                                        <button className="edit-btn">✏️ Editar</button>
                                        <button className="history-btn">📋 Historial</button>
                                    </div>
                                </div>
                                
                                <div className="client-card">
                                    <div className="client-info">
                                        <h4>👨 Juan Pérez</h4>
                                        <p>📞 +1 (555) 987-6543</p>
                                        <p>📧 juan@email.com</p>
                                        <p>🗓️ Última visita: 20/09/2025</p>
                                        <p>💆‍♀️ Servicios: 8 sesiones</p>
                                    </div>
                                    <div className="client-actions">
                                        <button className="edit-btn">✏️ Editar</button>
                                        <button className="history-btn">📋 Historial</button>
                                    </div>
                                </div>
                                
                                <div className="client-card">
                                    <div className="client-info">
                                        <h4>👩 Ana López</h4>
                                        <p>📞 +1 (555) 456-7890</p>
                                        <p>📧 ana@email.com</p>
                                        <p>🗓️ Última visita: 22/09/2025</p>
                                        <p>💆‍♀️ Servicios: 15 sesiones</p>
                                    </div>
                                    <div className="client-actions">
                                        <button className="edit-btn">✏️ Editar</button>
                                        <button className="history-btn">📋 Historial</button>
                                    </div>
                                </div>
                                
                                <div className="client-card">
                                    <div className="client-info">
                                        <h4>👨 Carlos Ruiz</h4>
                                        <p>📞 +1 (555) 321-0987</p>
                                        <p>📧 carlos@email.com</p>
                                        <p>🗓️ Última visita: 25/09/2025</p>
                                        <p>💆‍♀️ Servicios: 5 sesiones</p>
                                    </div>
                                    <div className="client-actions">
                                        <button className="edit-btn">✏️ Editar</button>
                                        <button className="history-btn">📋 Historial</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reportes' && (
                        <div className="reportes">
                            <h2>Reportes y Analytics</h2>
                            
                            {/* Reportes Financieros */}
                            <div className="report-section">
                                <h3>📊 Reportes Financieros</h3>
                                <div className="reports-grid">
                                    <div className="report-card">
                                        <h4>Ingresos del Mes</h4>
                                        <div className="report-value">S/ 58,500</div>
                                        <div className="report-change positive">+12% vs mes anterior</div>
                                    </div>
                                    <div className="report-card">
                                        <h4>Ingresos por Servicio</h4>
                                        <div className="service-income">
                                            <div className="income-item">
                                                <span>Masaje Relajante</span>
                                                <span>S/ 19,980 (34%)</span>
                                            </div>
                                            <div className="income-item">
                                                <span>Masaje Deportivo</span>
                                                <span>S/ 15,540 (26%)</span>
                                            </div>
                                            <div className="income-item">
                                                <span>Masaje Terapéutico</span>
                                                <span>S/ 14,615 (25%)</span>
                                            </div>
                                            <div className="income-item">
                                                <span>Masaje con Piedras</span>
                                                                                                <span>S/ 9,065 (16%)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="report-card">
                                        <h4>Métodos de Pago</h4>
                                        <div className="payment-methods">
                                            <div className="payment-item">
                                                <span>💳 Tarjeta</span>
                                                <span>65%</span>
                                            </div>
                                            <div className="payment-item">
                                                <span>💵 Efectivo</span>
                                                <span>25%</span>
                                            </div>
                                            <div className="payment-item">
                                                <span>📱 Transferencia</span>
                                                <span>10%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reportes de Reservas */}
                            <div className="report-section">
                                <h3>📅 Reportes de Reservas</h3>
                                <div className="reports-grid">
                                    <div className="report-card">
                                        <h4>Ocupación por Horarios</h4>
                                        <div className="schedule-chart">
                                            <div className="schedule-item">
                                                <span>9:00 - 11:00</span>
                                                <div className="schedule-bar">
                                                    <div className="bar-fill" style={{width: '85%'}}></div>
                                                    <span>85%</span>
                                                </div>
                                            </div>
                                            <div className="schedule-item">
                                                <span>11:00 - 13:00</span>
                                                <div className="schedule-bar">
                                                    <div className="bar-fill" style={{width: '95%'}}></div>
                                                    <span>95%</span>
                                                </div>
                                            </div>
                                            <div className="schedule-item">
                                                <span>13:00 - 15:00</span>
                                                <div className="schedule-bar">
                                                    <div className="bar-fill" style={{width: '70%'}}></div>
                                                    <span>70%</span>
                                                </div>
                                            </div>
                                            <div className="schedule-item">
                                                <span>15:00 - 17:00</span>
                                                <div className="schedule-bar">
                                                    <div className="bar-fill" style={{width: '90%'}}></div>
                                                    <span>90%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="report-card">
                                        <h4>Días Más Populares</h4>
                                        <div className="days-popularity">
                                            <div className="day-item">
                                                <span>Viernes</span>
                                                <span className="day-percentage">92%</span>
                                            </div>
                                            <div className="day-item">
                                                <span>Sábado</span>
                                                <span className="day-percentage">88%</span>
                                            </div>
                                            <div className="day-item">
                                                <span>Jueves</span>
                                                <span className="day-percentage">76%</span>
                                            </div>
                                            <div className="day-item">
                                                <span>Miércoles</span>
                                                <span className="day-percentage">65%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="report-card">
                                        <h4>Estadísticas de Reservas</h4>
                                        <div className="booking-stats">
                                            <div className="stat-row">
                                                <span>Tasa de Cancelación:</span>
                                                <span className="negative">8.5%</span>
                                            </div>
                                            <div className="stat-row">
                                                <span>Reservas Completadas:</span>
                                                <span className="positive">91.5%</span>
                                            </div>
                                            <div className="stat-row">
                                                <span>Tiempo Promedio:</span>
                                                <span>75 min</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reportes de Clientes */}
                            <div className="report-section">
                                <h3>👥 Reportes de Clientes</h3>
                                <div className="reports-grid">
                                    <div className="report-card">
                                        <h4>Clientes Frecuentes</h4>
                                        <div className="client-list">
                                            <div className="client-item">
                                                <span>María García</span>
                                                <span>15 visitas</span>
                                            </div>
                                            <div className="client-item">
                                                <span>Ana López</span>
                                                <span>12 visitas</span>
                                            </div>
                                            <div className="client-item">
                                                <span>Carmen Silva</span>
                                                <span>10 visitas</span>
                                            </div>
                                            <div className="client-item">
                                                <span>Laura Martín</span>
                                                <span>8 visitas</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="report-card">
                                        <h4>Nuevos Clientes</h4>
                                        <div className="new-clients-chart">
                                            <div className="month-stat">
                                                <span>Este mes:</span>
                                                <span className="highlight">23 nuevos</span>
                                            </div>
                                            <div className="month-stat">
                                                <span>Mes anterior:</span>
                                                <span>18 nuevos</span>
                                            </div>
                                            <div className="growth-indicator positive">
                                                +27.8% de crecimiento
                                            </div>
                                        </div>
                                    </div>
                                    <div className="report-card">
                                        <h4>Demografía</h4>
                                        <div className="demographics">
                                            <div className="demo-item">
                                                <span>👩 Mujeres:</span>
                                                <span>72%</span>
                                            </div>
                                            <div className="demo-item">
                                                <span>👨 Hombres:</span>
                                                <span>28%</span>
                                            </div>
                                            <div className="demo-item">
                                                <span>📊 Edad promedio:</span>
                                                <span>35 años</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reportes de Servicios */}
                            <div className="report-section">
                                <h3>💆‍♀️ Reportes de Servicios</h3>
                                <div className="reports-grid">
                                    <div className="report-card">
                                        <h4>Servicios Más Solicitados</h4>
                                        <div className="service-ranking">
                                            <div className="rank-item">
                                                <span className="rank">1°</span>
                                                <span>Masaje Relajante</span>
                                                <span className="count">45 servicios</span>
                                            </div>
                                            <div className="rank-item">
                                                <span className="rank">2°</span>
                                                <span>Masaje Deportivo</span>
                                                <span className="count">32 servicios</span>
                                            </div>
                                            <div className="rank-item">
                                                <span className="rank">3°</span>
                                                <span>Masaje Terapéutico</span>
                                                <span className="count">28 servicios</span>
                                            </div>
                                            <div className="rank-item">
                                                <span className="rank">4°</span>
                                                <span>Masaje con Piedras</span>
                                                <span className="count">18 servicios</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="report-card">
                                        <h4>Duración Promedio</h4>
                                        <div className="duration-stats">
                                            <div className="duration-item">
                                                <span>Relajante:</span>
                                                <span>65 min</span>
                                            </div>
                                            <div className="duration-item">
                                                <span>Deportivo:</span>
                                                <span>85 min</span>
                                            </div>
                                            <div className="duration-item">
                                                <span>Terapéutico:</span>
                                                <span>70 min</span>
                                            </div>
                                            <div className="duration-item">
                                                <span>Con Piedras:</span>
                                                <span>110 min</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="report-card">
                                        <h4>Rentabilidad</h4>
                                        <div className="profitability">
                                            <div className="profit-item">
                                                <span>Masaje con Piedras</span>
                                                <span className="profit-margin positive">+68%</span>
                                            </div>
                                            <div className="profit-item">
                                                <span>Masaje Deportivo</span>
                                                <span className="profit-margin positive">+52%</span>
                                            </div>
                                            <div className="profit-item">
                                                <span>Masaje Terapéutico</span>
                                                <span className="profit-margin positive">+45%</span>
                                            </div>
                                            <div className="profit-item">
                                                <span>Masaje Relajante</span>
                                                <span className="profit-margin positive">+38%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reportes de Marketing */}
                            <div className="report-section">
                                <h3>📱 Reportes de Marketing</h3>
                                <div className="reports-grid">
                                    <div className="report-card">
                                        <h4>Fuentes de Clientes Detalladas</h4>
                                        <div className="detailed-sources">
                                            <div className="source-category">
                                                <h5>👥 Clientes Referidos (45%)</h5>
                                                <div className="referral-details">
                                                    <div className="referrer-item">
                                                        <span>🏆 María González</span>
                                                        <span className="referrer-count">12 referidos</span>
                                                    </div>
                                                    <div className="referrer-item">
                                                        <span>🥈 Ana López</span>
                                                        <span className="referrer-count">8 referidos</span>
                                                    </div>
                                                    <div className="referrer-item">
                                                        <span>🥉 Carmen Silva</span>
                                                        <span className="referrer-count">6 referidos</span>
                                                    </div>
                                                    <div className="referrer-item">
                                                        <span>Laura Martín</span>
                                                        <span className="referrer-count">4 referidos</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="source-category">
                                                <h5>📱 Redes Sociales (50%)</h5>
                                                <div className="social-breakdown">
                                                    <div className="social-item">
                                                        <span>📸 Instagram</span>
                                                        <span>18% (45 clientes)</span>
                                                    </div>
                                                    <div className="social-item">
                                                        <span>📘 Facebook</span>
                                                        <span>15% (38 clientes)</span>
                                                    </div>
                                                    <div className="social-item">
                                                        <span>🎬 TikTok</span>
                                                        <span>10% (25 clientes)</span>
                                                    </div>
                                                    <div className="social-item">
                                                        <span>🔍 Google</span>
                                                        <span>7% (17 clientes)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="source-category">
                                                <h5>🚶 Walk-in & Otros (10%)</h5>
                                                <div className="other-breakdown">
                                                    <div className="other-item">
                                                        <span>Pasaron por el local</span>
                                                        <span>6% (15 clientes)</span>
                                                    </div>
                                                    <div className="other-item">
                                                        <span>Volantes/Flyers</span>
                                                        <span>3% (8 clientes)</span>
                                                    </div>
                                                    <div className="other-item">
                                                        <span>Radio local</span>
                                                        <span>1% (2 clientes)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="report-card">
                                        <h4>Promociones Activas</h4>
                                        <div className="promotions">
                                            <div className="promo-item">
                                                <span>Descuento 1era Visita</span>
                                                <span className="promo-effectiveness">23 usos</span>
                                            </div>
                                            <div className="promo-item">
                                                <span>Paquete 4 Sesiones</span>
                                                <span className="promo-effectiveness">15 usos</span>
                                            </div>
                                            <div className="promo-item">
                                                <span>Masaje en Pareja</span>
                                                <span className="promo-effectiveness">8 usos</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="report-card">
                                        <h4>ROI Campañas</h4>
                                        <div className="roi-stats">
                                            <div className="roi-item">
                                                <span>Facebook Ads:</span>
                                                <span className="roi-value positive">+250%</span>
                                            </div>
                                            <div className="roi-item">
                                                <span>Google Ads:</span>
                                                <span className="roi-value positive">+180%</span>
                                            </div>
                                            <div className="roi-item">
                                                <span>Instagram:</span>
                                                <span className="roi-value positive">+320%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de Exportación */}
                            <div className="export-section">
                                <h3>📊 Exportar Reportes</h3>
                                <div className="export-buttons">
                                    <button className="export-btn">📊 Exportar Excel</button>
                                    <button className="export-btn">📄 Exportar PDF</button>
                                    <button className="export-btn">📈 Generar Gráficos</button>
                                    <button className="export-btn">📧 Enviar por Email</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'config' && (
                        <div className="config">
                            <h2>⚙️ Configuración del Sistema</h2>
                            
                            {/* Información del Negocio */}
                            <div className="config-section">
                                <h3>🏢 Información del Negocio</h3>
                                <div className="config-grid">
                                    <div className="config-card">
                                        <h4>Datos Básicos</h4>
                                        <div className="config-form">
                                            <div className="form-group">
                                                <label>Nombre del Spa:</label>
                                                <input type="text" defaultValue="Relax Total" />
                                            </div>
                                            <div className="form-group">
                                                <label>Dirección:</label>
                                                <input type="text" defaultValue="Av. Principal 123, Ciudad" />
                                            </div>
                                            <div className="form-group">
                                                <label>Teléfono:</label>
                                                <input type="tel" defaultValue="+1 (555) 123-4567" />
                                            </div>
                                            <div className="form-group">
                                                <label>Email:</label>
                                                <input type="email" defaultValue="info@relaxtotal.com" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="config-card">
                                        <h4>Horarios de Atención</h4>
                                        <div className="schedule-config">
                                            <div className="schedule-item">
                                                <span>Lunes - Viernes:</span>
                                                <div className="time-inputs">
                                                    <input type="time" defaultValue="09:00" />
                                                    <span>-</span>
                                                    <input type="time" defaultValue="20:00" />
                                                </div>
                                            </div>
                                            <div className="schedule-item">
                                                <span>Sábados:</span>
                                                <div className="time-inputs">
                                                    <input type="time" defaultValue="10:00" />
                                                    <span>-</span>
                                                    <input type="time" defaultValue="18:00" />
                                                </div>
                                            </div>
                                            <div className="schedule-item">
                                                <span>Domingos:</span>
                                                <select defaultValue="cerrado">
                                                    <option value="cerrado">Cerrado</option>
                                                    <option value="abierto">Abierto</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Gestión de Personal */}
                            <div className="config-section">
                                <h3>👥 Gestión de Personal</h3>
                                <div className="config-grid">
                                    <div className="config-card">
                                        <h4>Masajistas</h4>
                                        <div className="staff-list">
                                            <div className="staff-item">
                                                <span className="staff-name">👩‍⚕️ Ana García</span>
                                                <span className="staff-role">Masajista Senior</span>
                                                <div className="staff-actions">
                                                    <button className="edit-btn">✏️ Editar</button>
                                                    <button className="delete-btn">🗑️</button>
                                                </div>
                                            </div>
                                            <div className="staff-item">
                                                <span className="staff-name">👨‍⚕️ Carlos López</span>
                                                <span className="staff-role">Masajista Deportivo</span>
                                                <div className="staff-actions">
                                                    <button className="edit-btn">✏️ Editar</button>
                                                    <button className="delete-btn">🗑️</button>
                                                </div>
                                            </div>
                                            <div className="staff-item">
                                                <span className="staff-name">👩‍⚕️ María Silva</span>
                                                <span className="staff-role">Terapeuta</span>
                                                <div className="staff-actions">
                                                    <button className="edit-btn">✏️ Editar</button>
                                                    <button className="delete-btn">🗑️</button>
                                                </div>
                                            </div>
                                            <button className="add-staff-btn">➕ Agregar Masajista</button>
                                        </div>
                                    </div>
                                    
                                    <div className="config-card">
                                        <h4>Usuarios del Sistema</h4>
                                        <div className="users-list">
                                            <div className="user-item">
                                                <span className="user-name">👑 Admin Principal</span>
                                                <span className="user-permissions">Todos los permisos</span>
                                                <button className="user-edit-btn">⚙️ Configurar</button>
                                            </div>
                                            <div className="user-item">
                                                <span className="user-name">👩‍💼 Recepcionista</span>
                                                <span className="user-permissions">Reservas y clientes</span>
                                                <button className="user-edit-btn">⚙️ Configurar</button>
                                            </div>
                                            <button className="add-user-btn">➕ Agregar Usuario</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Servicios y Precios */}
                            <div className="config-section">
                                <h3>💆‍♀️ Servicios y Precios</h3>
                                <div className="services-config">
                                    <div className="service-config-item">
                                        <span className="service-name">Masaje Relajante</span>
                                        <input type="number" defaultValue="300" className="price-input" />
                                        <span className="currency">S/</span>
                                        <input type="number" defaultValue="60" className="duration-input" />
                                        <span className="time-unit">min</span>
                                        <button className="service-edit-btn">✏️ Editar</button>
                                    </div>
                                    <div className="service-config-item">
                                        <span className="service-name">Masaje Deportivo</span>
                                        <input type="number" defaultValue="370" className="price-input" />
                                        <span className="currency">S/</span>
                                        <input type="number" defaultValue="75" className="duration-input" />
                                        <span className="time-unit">min</span>
                                        <button className="service-edit-btn">✏️ Editar</button>
                                    </div>
                                    <div className="service-config-item">
                                        <span className="service-name">Masaje con Piedras</span>
                                        <input type="number" defaultValue="450" className="price-input" />
                                        <span className="currency">S/</span>
                                        <input type="number" defaultValue="90" className="duration-input" />
                                        <span className="time-unit">min</span>
                                        <button className="service-edit-btn">✏️ Editar</button>
                                    </div>
                                    <button className="add-service-btn">➕ Agregar Nuevo Servicio</button>
                                </div>
                            </div>

                            {/* Configuración de Citas */}
                            <div className="config-section">
                                <h3>📅 Configuración de Citas</h3>
                                <div className="config-grid">
                                    <div className="config-card">
                                        <h4>Intervalos de Tiempo</h4>
                                        <div className="booking-config">
                                            <div className="config-item">
                                                <label>Tiempo entre citas:</label>
                                                <select defaultValue="15">
                                                    <option value="10">10 minutos</option>
                                                    <option value="15">15 minutos</option>
                                                    <option value="30">30 minutos</option>
                                                </select>
                                            </div>
                                            <div className="config-item">
                                                <label>Reservas anticipadas máximo:</label>
                                                <select defaultValue="30">
                                                    <option value="7">1 semana</option>
                                                    <option value="15">15 días</option>
                                                    <option value="30">1 mes</option>
                                                    <option value="60">2 meses</option>
                                                </select>
                                            </div>
                                            <div className="config-item">
                                                <label>Cancelaciones hasta:</label>
                                                <select defaultValue="24">
                                                    <option value="2">2 horas antes</option>
                                                    <option value="24">24 horas antes</option>
                                                    <option value="48">48 horas antes</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="config-card">
                                        <h4>Notificaciones</h4>
                                        <div className="notifications-config">
                                            <div className="notification-item">
                                                <label>
                                                    <input type="checkbox" defaultChecked />
                                                    📧 Email de confirmación
                                                </label>
                                            </div>
                                            <div className="notification-item">
                                                <label>
                                                    <input type="checkbox" defaultChecked />
                                                    📱 Recordatorio WhatsApp (24h antes)
                                                </label>
                                            </div>
                                            <div className="notification-item">
                                                <label>
                                                    <input type="checkbox" defaultChecked />
                                                    🔔 Notificación de nuevas reservas
                                                </label>
                                            </div>
                                            <div className="notification-item">
                                                <label>
                                                    <input type="checkbox" />
                                                    📊 Reporte semanal automático
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Métodos de Pago */}
                            <div className="config-section">
                                <h3>💳 Métodos de Pago</h3>
                                <div className="config-grid">
                                    <div className="config-card">
                                        <h4>Formas de Pago Activas</h4>
                                        <div className="payment-methods">
                                            <div className="payment-item">
                                                <label>
                                                    <input type="checkbox" defaultChecked />
                                                    💵 Efectivo
                                                </label>
                                            </div>
                                            <div className="payment-item">
                                                <label>
                                                    <input type="checkbox" defaultChecked />
                                                    💳 Tarjeta de Crédito
                                                </label>
                                            </div>
                                            <div className="payment-item">
                                                <label>
                                                    <input type="checkbox" defaultChecked />
                                                    🏦 Transferencia Bancaria
                                                </label>
                                            </div>
                                            <div className="payment-item">
                                                <label>
                                                    <input type="checkbox" />
                                                    📱 Pago Online (PayPal)
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="config-card">
                                        <h4>Promociones Activas</h4>
                                        <div className="promotions-config">
                                            <div className="promo-config-item">
                                                <span>PRIMERA10</span>
                                                <span>10% desc. primera visita</span>
                                                <label className="switch">
                                                    <input type="checkbox" defaultChecked />
                                                    <span className="slider"></span>
                                                </label>
                                            </div>
                                            <div className="promo-config-item">
                                                <span>AMIGO15</span>
                                                <span>15% desc. por referido</span>
                                                <label className="switch">
                                                    <input type="checkbox" defaultChecked />
                                                    <span className="slider"></span>
                                                </label>
                                            </div>
                                            <div className="promo-config-item">
                                                <span>RELAX20</span>
                                                <span>20% desc. 4+ sesiones</span>
                                                <label className="switch">
                                                    <input type="checkbox" />
                                                    <span className="slider"></span>
                                                </label>
                                            </div>
                                            <button className="add-promo-btn">➕ Nueva Promoción</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="config-actions">
                                <button className="save-config-btn">💾 Guardar Configuración</button>
                                <button className="backup-btn">📂 Crear Respaldo</button>
                                <button className="reset-btn">🔄 Restaurar Valores por Defecto</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Nuevo Cliente */}
            {showNewClientModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>➕ Agregar Nuevo Cliente</h3>
                            <button className="modal-close" onClick={handleCloseModal}>✖️</button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="client-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>👤 Nombre Completo *</label>
                                        <input 
                                            type="text" 
                                            value={newClientData.nombre}
                                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                                            placeholder="Ej: María García López"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>📞 Teléfono *</label>
                                        <input 
                                            type="tel" 
                                            value={newClientData.telefono}
                                            onChange={(e) => handleInputChange('telefono', e.target.value)}
                                            placeholder="Ej: +1 (555) 123-4567"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>📧 Email</label>
                                        <input 
                                            type="email" 
                                            value={newClientData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="Ej: maria@email.com"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>🎂 Fecha de Nacimiento</label>
                                        <input 
                                            type="date" 
                                            value={newClientData.fechaNacimiento}
                                            onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>🏠 Dirección</label>
                                    <input 
                                        type="text" 
                                        value={newClientData.direccion}
                                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                                        placeholder="Ej: Av. Principal 123, Ciudad"
                                    />
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>💆‍♀️ Preferencias de Masaje</label>
                                        <select 
                                            value={newClientData.preferencias}
                                            onChange={(e) => handleInputChange('preferencias', e.target.value)}
                                        >
                                            <option value="">Seleccionar preferencia</option>
                                            <option value="relajante">Masaje Relajante</option>
                                            <option value="deportivo">Masaje Deportivo</option>
                                            <option value="terapeutico">Masaje Terapéutico</option>
                                            <option value="piedras">Masaje con Piedras Calientes</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>📱 ¿Cómo nos conoció?</label>
                                        <select 
                                            value={newClientData.fuente}
                                            onChange={(e) => handleInputChange('fuente', e.target.value)}
                                        >
                                            <option value="">Seleccionar fuente</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="facebook">Facebook</option>
                                            <option value="tiktok">TikTok</option>
                                            <option value="google">Google</option>
                                            <option value="referido">Referido por cliente</option>
                                            <option value="walk-in">Pasó por el local</option>
                                            <option value="otros">Otros</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>📝 Notas Especiales</label>
                                    <textarea 
                                        value={newClientData.notas}
                                        onChange={(e) => handleInputChange('notas', e.target.value)}
                                        placeholder="Ej: Alérgico a ciertos aceites, prefiere presión suave, etc."
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={handleCloseModal}>
                                ❌ Cancelar
                            </button>
                            <button className="btn-primary" onClick={handleSaveClient}>
                                💾 Guardar Cliente
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Nuevo Servicio */}
            {showNewServiceModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>➕ Agregar Nuevo Servicio</h3>
                            <button className="modal-close" onClick={handleCloseServiceModal}>✖️</button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="service-form">
                                <div className="form-group">
                                    <label>💆‍♀️ Nombre del Servicio *</label>
                                    <input 
                                        type="text" 
                                        value={newServiceData.nombre}
                                        onChange={(e) => handleServiceInputChange('nombre', e.target.value)}
                                        placeholder="Ej: Masaje Sueco, Reflexología, Aromaterapia"
                                        required
                                    />
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>⏱️ Duración (minutos) *</label>
                                        <input 
                                            type="number" 
                                            value={newServiceData.duracion}
                                            onChange={(e) => handleServiceInputChange('duracion', e.target.value)}
                                            placeholder="Ej: 60, 90, 120"
                                            min="15"
                                            max="300"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>💰 Precio (Soles) *</label>
                                        <input 
                                            type="number" 
                                            value={newServiceData.precio}
                                            onChange={(e) => handleServiceInputChange('precio', e.target.value)}
                                            placeholder="Ej: 300, 450, 650"
                                            min="50"
                                            step="10"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>📝 Descripción del Servicio</label>
                                    <textarea 
                                        value={newServiceData.descripcion}
                                        onChange={(e) => handleServiceInputChange('descripcion', e.target.value)}
                                        placeholder="Describe los beneficios del servicio, técnicas utilizadas, recomendaciones..."
                                        rows="4"
                                    />
                                </div>

                                <div className="service-preview">
                                    <h4>👀 Vista Previa</h4>
                                    <div className="preview-card">
                                        <h5>{newServiceData.nombre || 'Nombre del Servicio'}</h5>
                                        <p>⏱️ {newServiceData.duracion || '0'} minutos</p>
                                        <p>💰 S/ {newServiceData.precio || '0'}</p>
                                        <p>{newServiceData.descripcion || 'Sin descripción'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={handleCloseServiceModal}>
                                ❌ Cancelar
                            </button>
                            <button className="btn-primary" onClick={handleSaveService}>
                                💾 Crear Servicio
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
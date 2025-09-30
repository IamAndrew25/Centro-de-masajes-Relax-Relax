import React from 'react';
import { StatCard } from './ui/Card';

const Dashboard = ({ stats, setActiveTab }) => {
    const statsData = [
        { icon: "📅", value: stats.reservasHoy, label: "Reservas Hoy" },
        { icon: "📊", value: stats.reservasSemana, label: "Reservas Semana" },
        { icon: "💰", value: `S/ ${stats.ingresosMes.toLocaleString()}`, label: "Ingresos Mes" },
        { icon: "👥", value: stats.clientesNuevos, label: "Clientes Nuevos" }
    ];

    const quickActions = [
        { label: "Nueva Reserva", tab: "reservas" },
        { label: "Agregar Cliente", tab: "clientes" },
        { label: "Ver Reportes", tab: "reportes" }
    ];

    return (
        <div className="dashboard">
            <h2>Dashboard Principal</h2>
            
            <div className="stats-grid">
                {statsData.map((stat, index) => (
                    <StatCard 
                        key={index} 
                        icon={stat.icon} 
                        value={stat.value} 
                        label={stat.label} 
                    />
                ))}
            </div>

            <div className="quick-actions">
                <h3>Acciones Rápidas</h3>
                <div className="action-buttons">
                    {quickActions.map((action, index) => (
                        <button 
                            key={index} 
                            className="action-btn" 
                            onClick={() => setActiveTab(action.tab)}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
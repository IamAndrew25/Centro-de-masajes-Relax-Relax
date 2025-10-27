import React from 'react';
import { StatCard } from './ui/Card';

const Dashboard = ({ stats, setActiveTab }) => {
    const statsData = [
        { icon: "📅", value: stats.reservasHoy, label: "Reservas Hoy" },
        { icon: "📊", value: stats.reservasSemana, label: "Reservas Semana" },
        { icon: "💰", value: `S/ ${stats.ingresosMes.toLocaleString()}`, label: "Ingresos Mes" },
        { icon: "👥", value: stats.clientesNuevos, label: "Clientes Nuevos" }
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
        </div>
    );
};

export default Dashboard;
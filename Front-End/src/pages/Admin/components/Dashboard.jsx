import React, { useState, useEffect } from 'react';
import { StatCard } from './ui/Card';
import { getPopularServices } from './JS/dashboardService';

const Dashboard = ({ stats = {}, setActiveTab }) => {
    const [popularServices, setPopularServices] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Valores por defecto para stats
    const defaultStats = {
        reservasHoy: 0,
        reservasSemana: 0,
        ingresosMes: 0,
        clientesNuevos: 0,
        ...stats
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                const services = await getPopularServices(5);
                setPopularServices(services);
            } catch (error) {
                console.error('Error al cargar datos del dashboard:', error);
                // Datos de ejemplo si falla
                setPopularServices([
                    { nombre: 'Masaje Relajante', cantidad: 45 },
                    { nombre: 'Masaje Deportivo', cantidad: 38 },
                    { nombre: 'Reflexología', cantidad: 32 },
                    { nombre: 'Aromaterapia', cantidad: 28 },
                    { nombre: 'Masaje de Piedras', cantidad: 25 }
                ]);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [stats]);

    const statsData = [
        { icon: "📅", value: defaultStats.reservasHoy || 0, label: "Reservas Hoy" },
        { icon: "📊", value: defaultStats.reservasSemana || 0, label: "Reservas Semana" },
        { icon: "💰", value: `S/ ${(defaultStats.ingresosMes || 0).toLocaleString()}`, label: "Ingresos Mes" },
        { icon: "👥", value: defaultStats.clientesNuevos || 0, label: "Clientes Nuevos" }
    ];

    const getMaxValue = (data, key) => Math.max(...data.map(item => item[key]));

    return (
        <div className="dashboard">
            <h2>Dashboard Principal</h2>
            
            {/* Estadísticas principales */}
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

            {loading ? (
                <div className="dashboard-loading">
                    <div className="spinner"></div>
                    <p>Cargando datos...</p>
                </div>
            ) : (
                <>
                    {/* Segunda fila de información */}
                    <div className="dashboard-info">
                        {/* Servicios más populares */}
                        <div className="info-card info-card-full">
                            <h3>🏆 Servicios Más Populares (Este Mes)</h3>
                            <div className="popular-services">
                                {popularServices.map((service, index) => (
                                    <div key={index} className="service-item">
                                        <div className="service-info">
                                            <span className="service-rank">#{index + 1}</span>
                                            <span className="service-name">{service.nombre}</span>
                                        </div>
                                        <div className="service-bar-container">
                                            <div 
                                                className="service-bar" 
                                                style={{ 
                                                    width: `${(service.cantidad / getMaxValue(popularServices, 'cantidad')) * 100}%` 
                                                }}
                                            ></div>
                                            <span className="service-count">{service.cantidad}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
                .dashboard {
                    padding: 20px;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .dashboard-loading {
                    text-align: center;
                    padding: 60px 20px;
                }

                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .dashboard-charts {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 25px;
                    margin-bottom: 30px;
                }

                .chart-card {
                    background: white;
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .chart-card h3 {
                    margin: 0 0 20px 0;
                    color: #333;
                    font-size: 1.2em;
                }

                .bar-chart {
                    display: flex;
                    justify-content: space-around;
                    align-items: flex-end;
                    height: 200px;
                    gap: 10px;
                }

                .bar-item {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }

                .bar {
                    width: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 8px 8px 0 0;
                    min-height: 30px;
                    position: relative;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding-top: 5px;
                }

                .bar:hover {
                    opacity: 0.8;
                    transform: translateY(-5px);
                }

                .bar-revenue {
                    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                }

                .bar-value {
                    color: white;
                    font-weight: bold;
                    font-size: 0.9em;
                }

                .bar-label {
                    font-size: 0.85em;
                    color: #666;
                    text-align: center;
                }

                .dashboard-info {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 25px;
                    margin-top: 120px;
                }

                .info-card {
                    background: white;
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .info-card-full {
                    grid-column: 1 / -1;
                }

                .info-card h3 {
                    margin: 0 0 20px 0;
                    color: #333;
                    font-size: 1.2em;
                }

                .popular-services {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .service-item {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .service-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .service-rank {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 0.9em;
                }

                .service-name {
                    font-weight: 500;
                    color: #333;
                }

                .service-bar-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .service-bar {
                    height: 8px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 10px;
                    transition: width 0.3s ease;
                }

                .service-count {
                    font-weight: bold;
                    color: #667eea;
                    min-width: 30px;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
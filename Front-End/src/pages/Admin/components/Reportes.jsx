import React from 'react';
import { Card, ListItem, ProgressBar } from './ui/Card';
import { REPORTES_DATA } from '../data/adminData';
import { formatCurrency } from '../utils/helpers';

// Componentes internos optimizados
const ReportesFinancieros = () => (
    <div className="report-section">
        <h3>📊 Reportes Financieros</h3>
        <div className="reports-grid">
            <Card>
                <h4>Ingresos del Mes</h4>
                <div className="report-value">{formatCurrency(58500)}</div>
                <div className="report-change positive">+12% vs mes anterior</div>
            </Card>
            <Card>
                <h4>Ingresos por Servicio</h4>
                <div className="service-income">
                    {REPORTES_DATA.ingresosPorServicio.map((item, index) => (
                        <ListItem 
                            key={index}
                            className="income-item"
                            label={item.nombre}
                            value={`${formatCurrency(item.monto)} (${item.porcentaje}%)`}
                        />
                    ))}
                </div>
            </Card>
            <Card>
                <h4>Métodos de Pago</h4>
                <div className="payment-methods">
                    {REPORTES_DATA.metodosPago.map((item, index) => (
                        <ListItem 
                            key={index}
                            className="payment-item"
                            label={item.metodo}
                            value={`${item.porcentaje}%`}
                        />
                    ))}
                </div>
            </Card>
        </div>
    </div>
);

const ReportesReservas = () => (
    <div className="report-section">
        <h3>📅 Reportes de Reservas</h3>
        <div className="reports-grid">
            <Card>
                <h4>Ocupación por Horarios</h4>
                <div className="schedule-chart">
                    {REPORTES_DATA.ocupacionHorarios.map((item, index) => (
                        <ProgressBar 
                            key={index} 
                            label={item.horario} 
                            percentage={item.porcentaje} 
                        />
                    ))}
                </div>
            </Card>
            <Card>
                <h4>Días Más Populares</h4>
                <div className="days-popularity">
                    {REPORTES_DATA.diasPopulares.map((item, index) => (
                        <ListItem 
                            key={index}
                            className="day-item"
                            label={item.dia}
                            value={<span className="day-percentage">{item.porcentaje}%</span>}
                        />
                    ))}
                </div>
            </Card>
            <Card>
                <h4>Estadísticas de Reservas</h4>
                <div className="booking-stats">
                    <ListItem className="stat-row" label="Tasa de Cancelación:" value={<span className="negative">8.5%</span>} />
                    <ListItem className="stat-row" label="Reservas Completadas:" value={<span className="positive">91.5%</span>} />
                    <ListItem className="stat-row" label="Tiempo Promedio:" value="75 min" />
                </div>
            </Card>
        </div>
    </div>
);

const ReportesClientes = () => (
    <div className="report-section">
        <h3>👥 Reportes de Clientes</h3>
        <div className="reports-grid">
            <Card>
                <h4>Clientes Frecuentes</h4>
                <div className="client-list">
                    {REPORTES_DATA.clientesFrecuentes.map((client, index) => (
                        <ListItem 
                            key={index}
                            className="client-item"
                            label={client.nombre}
                            value={`${client.visitas} visitas`}
                        />
                    ))}
                </div>
            </Card>
            <Card>
                <h4>Nuevos Clientes</h4>
                <div className="new-clients-chart">
                    <ListItem className="month-stat" label="Este mes:" value={<span className="highlight">23 nuevos</span>} />
                    <ListItem className="month-stat" label="Mes anterior:" value="18 nuevos" />
                    <div className="growth-indicator positive">+27.8% de crecimiento</div>
                </div>
            </Card>
            <Card>
                <h4>Demografía</h4>
                <div className="demographics">
                    <ListItem className="demo-item" label="👩 Mujeres:" value="72%" />
                    <ListItem className="demo-item" label="👨 Hombres:" value="28%" />
                    <ListItem className="demo-item" label="📊 Edad promedio:" value="35 años" />
                </div>
            </Card>
        </div>
    </div>
);

const ExportSection = () => {
    const exportButtons = [
        { icon: "📊", text: "Exportar Excel" },
        { icon: "📄", text: "Exportar PDF" },
        { icon: "📈", text: "Generar Gráficos" },
        { icon: "�", text: "Enviar por Email" }
    ];

    return (
        <div className="export-section">
            <h3>� Exportar Reportes</h3>
            <div className="export-buttons">
                {exportButtons.map((btn, index) => (
                    <button key={index} className="export-btn">
                        {btn.icon} {btn.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

const Reportes = () => {
    return (
        <div className="reportes">
            <h2>Reportes y Analytics</h2>
            <ReportesFinancieros />
            <ReportesReservas />
            <ReportesClientes />
            <ExportSection />
        </div>
    );
};

export default Reportes;
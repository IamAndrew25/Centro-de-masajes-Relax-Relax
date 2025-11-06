import React from 'react';

// Componentes internos para cada sección de configuración
const InformacionNegocio = () => (
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
);


export default InformacionNegocio;
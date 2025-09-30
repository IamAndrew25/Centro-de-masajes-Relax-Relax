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

const GestionPersonal = () => (
    <div className="config-section">
        <h3>👥 Gestión de Personal</h3>
        <div className="config-grid">
            <div className="config-card">
                <h4>Masajistas</h4>
                <div className="staff-list">
                    {[
                        { name: "👩‍⚕️ Ana García", role: "Masajista Senior" },
                        { name: "👨‍⚕️ Carlos López", role: "Masajista Deportivo" },
                        { name: "👩‍⚕️ María Silva", role: "Terapeuta" }
                    ].map((staff, index) => (
                        <div key={index} className="staff-item">
                            <span className="staff-name">{staff.name}</span>
                            <span className="staff-role">{staff.role}</span>
                            <div className="staff-actions">
                                <button className="edit-btn">✏️ Editar</button>
                                <button className="delete-btn">🗑️</button>
                            </div>
                        </div>
                    ))}
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
);

const ConfiguracionCitas = () => (
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
                    {[
                        { label: "📧 Email de confirmación", checked: true },
                        { label: "📱 Recordatorio WhatsApp (24h antes)", checked: true },
                        { label: "🔔 Notificación de nuevas reservas", checked: true },
                        { label: "📊 Reporte semanal automático", checked: false }
                    ].map((notification, index) => (
                        <div key={index} className="notification-item">
                            <label>
                                <input type="checkbox" defaultChecked={notification.checked} />
                                {notification.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const ConfiguracionAcciones = () => (
    <div className="config-actions">
        <button className="save-config-btn">💾 Guardar Configuración</button>
        <button className="backup-btn">📂 Crear Respaldo</button>
        <button className="reset-btn">🔄 Restaurar Valores por Defecto</button>
    </div>
);

const Configuracion = () => {
    return (
        <div className="config">
            <h2>⚙️ Configuración del Sistema</h2>
            <InformacionNegocio />
            {/* <GestionPersonal /> */}
            <ConfiguracionCitas />
            <ConfiguracionAcciones />
        </div>
    );
};

export default Configuracion;
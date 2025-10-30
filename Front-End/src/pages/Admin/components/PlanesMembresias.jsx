import React, { useState } from 'react';
import Modal from './ui/Modal';

const PlanesMembresias = () => {
    const [planes, setPlanes] = useState([
        {
            id: 1,
            nombre: 'Premium Mensual',
            descripcion: 'Acceso completo a todos los servicios',
            imagen: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Premium',
            colorPlan: '#3498db',
            precioBase: 899,
            duracion: 'Mensual',
            precioRenovacion: 899,
            descuentoVsNormal: 15,
            periodoGratis: 0,
            sesionesIncluidas: 4,
            serviciosIncluidos: ['Masaje Relajante', 'Masaje Deportivo', 'Reflexología'],
            descuentoAdicional: 10,
            prioridadReservas: true,
            invitacionesAmigos: 2,
            accesoEventos: true,
            serviciosExcluidos: [],
            blackoutDates: [],
            caducidadSesiones: 30,
            politicaCancelacion: 'Cancelación con 48hrs de anticipación',
            renovacionAutomatica: true,
            notificarDiasAntes: 7,
            penalizacionCancelacion: 100,
            limiteMiembros: 0,
            permitirPausar: true,
            miembrosActivos: 23
        },
        {
            id: 2,
            nombre: 'Gold Anual',
            descripcion: 'El mejor valor para clientes frecuentes',
            imagen: 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Gold',
            colorPlan: '#f39c12',
            precioBase: 9999,
            duracion: 'Anual',
            precioRenovacion: 9499,
            descuentoVsNormal: 25,
            periodoGratis: 7,
            sesionesIncluidas: 48,
            serviciosIncluidos: ['Todos los servicios'],
            descuentoAdicional: 20,
            prioridadReservas: true,
            invitacionesAmigos: 5,
            accesoEventos: true,
            serviciosExcluidos: [],
            blackoutDates: ['2025-12-24', '2025-12-25'],
            caducidadSesiones: 60,
            politicaCancelacion: 'Reembolso parcial según días restantes',
            renovacionAutomatica: true,
            notificarDiasAntes: 30,
            penalizacionCancelacion: 500,
            limiteMiembros: 100,
            permitirPausar: true,
            miembrosActivos: 67
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        imagen: '',
        colorPlan: '#3498db',
        precioBase: 0,
        duracion: 'Mensual',
        precioRenovacion: 0,
        descuentoVsNormal: 0,
        periodoGratis: 0,
        sesionesIncluidas: 0,
        serviciosIncluidos: [],
        descuentoAdicional: 0,
        prioridadReservas: false,
        invitacionesAmigos: 0,
        accesoEventos: false,
        serviciosExcluidos: [],
        blackoutDates: [],
        caducidadSesiones: 30,
        politicaCancelacion: '',
        renovacionAutomatica: true,
        notificarDiasAntes: 7,
        penalizacionCancelacion: 0,
        limiteMiembros: 0,
        permitirPausar: false
    });

    const [imagePreview, setImagePreview] = useState('');

    const serviciosDisponibles = [
        'Masaje Relajante',
        'Masaje Deportivo',
        'Masaje Terapéutico',
        'Reflexología',
        'Aromaterapia',
        'Piedras Calientes',
        'Masaje Facial',
        'Experiencia Spa'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : 
                    type === 'number' ? parseFloat(value) || 0 : 
                    value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({ ...prev, imagen: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview('');
        setFormData(prev => ({ ...prev, imagen: '' }));
        // Limpiar el input file
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
    };

    const handleServiciosChange = (servicio) => {
        setFormData(prev => {
            const servicios = prev.serviciosIncluidos.includes(servicio)
                ? prev.serviciosIncluidos.filter(s => s !== servicio)
                : [...prev.serviciosIncluidos, servicio];
            return { ...prev, serviciosIncluidos: servicios };
        });
    };

    const handleNuevoPlan = () => {
        setEditingPlan(null);
        setFormData({
            nombre: '',
            descripcion: '',
            imagen: '',
            colorPlan: '#3498db',
            precioBase: 0,
            duracion: 'Mensual',
            precioRenovacion: 0,
            descuentoVsNormal: 0,
            periodoGratis: 0,
            sesionesIncluidas: 0,
            serviciosIncluidos: [],
            descuentoAdicional: 0,
            prioridadReservas: false,
            invitacionesAmigos: 0,
            accesoEventos: false,
            serviciosExcluidos: [],
            blackoutDates: [],
            caducidadSesiones: 30,
            politicaCancelacion: '',
            renovacionAutomatica: true,
            notificarDiasAntes: 7,
            penalizacionCancelacion: 0,
            limiteMiembros: 0,
            permitirPausar: false
        });
        setImagePreview('');
        setShowModal(true);
    };

    const handleEditPlan = (plan) => {
        setEditingPlan(plan);
        setFormData({
            nombre: plan.nombre || '',
            descripcion: plan.descripcion || '',
            imagen: plan.imagen || '',
            colorPlan: plan.colorPlan || '#3498db',
            precioBase: plan.precioBase || 0,
            duracion: plan.duracion || 'Mensual',
            precioRenovacion: plan.precioRenovacion || 0,
            descuentoVsNormal: plan.descuentoVsNormal || 0,
            periodoGratis: plan.periodoGratis || 0,
            sesionesIncluidas: plan.sesionesIncluidas || 0,
            serviciosIncluidos: plan.serviciosIncluidos || [],
            descuentoAdicional: plan.descuentoAdicional || 0,
            prioridadReservas: plan.prioridadReservas || false,
            invitacionesAmigos: plan.invitacionesAmigos || 0,
            accesoEventos: plan.accesoEventos || false,
            serviciosExcluidos: plan.serviciosExcluidos || [],
            blackoutDates: plan.blackoutDates || [],
            caducidadSesiones: plan.caducidadSesiones || 30,
            politicaCancelacion: plan.politicaCancelacion || '',
            renovacionAutomatica: plan.renovacionAutomatica !== undefined ? plan.renovacionAutomatica : true,
            notificarDiasAntes: plan.notificarDiasAntes || 7,
            penalizacionCancelacion: plan.penalizacionCancelacion || 0,
            limiteMiembros: plan.limiteMiembros || 0,
            permitirPausar: plan.permitirPausar !== undefined ? plan.permitirPausar : false
        });
        setImagePreview(plan.imagen || '');
        setShowModal(true);
    };

    const handleSavePlan = () => {
        if (editingPlan) {
            setPlanes(planes.map(p => 
                p.id === editingPlan.id ? { ...formData, id: p.id, miembrosActivos: p.miembrosActivos } : p
            ));
        } else {
            const newPlan = {
                ...formData,
                id: Date.now(),
                miembrosActivos: 0
            };
            setPlanes([...planes, newPlan]);
        }
        setShowModal(false);
    };

    const handleDeletePlan = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este plan? Los miembros activos no serán afectados.')) {
            setPlanes(planes.filter(p => p.id !== id));
        }
    };

    return (
        <div className="planes-membresias">
            <div className="section-header">
                <h2>💳 Planes y Membresías</h2>
                <button className="btn-primary" onClick={handleNuevoPlan}>
                    + Nuevo Plan
                </button>
            </div>

            <div className="planes-grid">
                {planes.map(plan => (
                    <div key={plan.id} className="plan-card" style={{ borderColor: plan.colorPlan }}>
                        <div className="plan-header" style={{ background: `linear-gradient(135deg, ${plan.colorPlan}, ${plan.colorPlan}dd)` }}>
                            <h3>{plan.nombre}</h3>
                            <div className="plan-price">
                                <span className="currency">S/</span>
                                <span className="amount">{plan.precioBase}</span>
                                <span className="period">/{plan.duracion.toLowerCase()}</span>
                            </div>
                            {plan.descuentoVsNormal > 0 && (
                                <div className="plan-savings">
                                    Ahorras {plan.descuentoVsNormal}% vs precio normal
                                </div>
                            )}
                        </div>

                        <div className="plan-content">
                            <p className="plan-description">{plan.descripcion}</p>
                            
                            <div className="plan-benefits">
                                <h4>✨ Beneficios Incluidos:</h4>
                                <ul>
                                    <li>✅ {plan.sesionesIncluidas} sesiones incluidas</li>
                                    {plan.descuentoAdicional > 0 && (
                                        <li>✅ {plan.descuentoAdicional}% descuento adicional</li>
                                    )}
                                    {plan.prioridadReservas && (
                                        <li>✅ Prioridad en reservas</li>
                                    )}
                                    {plan.invitacionesAmigos > 0 && (
                                        <li>✅ {plan.invitacionesAmigos} invitaciones para amigos</li>
                                    )}
                                    {plan.accesoEventos && (
                                        <li>✅ Acceso a eventos exclusivos</li>
                                    )}
                                    {plan.periodoGratis > 0 && (
                                        <li>🎁 {plan.periodoGratis} días gratis de prueba</li>
                                    )}
                                </ul>

                                <div className="plan-services">
                                    <h4>💆‍♀️ Servicios:</h4>
                                    <div className="services-tags">
                                        {plan.serviciosIncluidos.slice(0, 3).map(servicio => (
                                            <span key={servicio} className="service-tag">{servicio}</span>
                                        ))}
                                        {plan.serviciosIncluidos.length > 3 && (
                                            <span className="service-tag more">+{plan.serviciosIncluidos.length - 3} más</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="plan-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Miembros Activos</span>
                                    <span className="stat-value">{plan.miembrosActivos}</span>
                                </div>
                                {plan.limiteMiembros > 0 && (
                                    <div className="stat-item">
                                        <span className="stat-label">Límite</span>
                                        <span className="stat-value">{plan.limiteMiembros}</span>
                                    </div>
                                )}
                            </div>

                            <div className="plan-actions">
                                <button className="btn-edit" onClick={() => handleEditPlan(plan)}>
                                    ✏️ Editar
                                </button>
                                <button className="btn-view" onClick={() => alert('Ver miembros (próximamente)')}>
                                    👥 Ver Miembros
                                </button>
                                <button className="btn-delete" onClick={() => handleDeletePlan(plan.id)}>
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <Modal 
                    onClose={() => setShowModal(false)}
                    title={editingPlan ? '✏️ Editar Plan' : '💳 Nuevo Plan de Membresía'}
                >
                    <div className="modal-form">
                        {/* Información Básica */}
                        <div className="form-section">
                            <h3>📋 Información Básica</h3>
                            
                            <div className="form-group">
                                <label>Nombre del Plan *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Premium Mensual"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    placeholder="Describe el plan..."
                                    rows="3"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Imagen / Icono</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    {imagePreview && (
                                        <div className="image-preview small">
                                            <img src={imagePreview} alt="Preview" />
                                            <button 
                                                type="button" 
                                                className="btn-remove-image"
                                                onClick={handleRemoveImage}
                                                title="Eliminar imagen"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Color Distintivo</label>
                                    <input
                                        type="color"
                                        name="colorPlan"
                                        value={formData.colorPlan}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Precio y Duración */}
                        <div className="form-section">
                            <h3>💰 Precio y Duración</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Precio Base (S/) *</label>
                                    <input
                                        type="number"
                                        name="precioBase"
                                        value={formData.precioBase}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Duración</label>
                                    <select name="duracion" value={formData.duracion} onChange={handleInputChange}>
                                        <option value="Mensual">Mensual</option>
                                        <option value="Trimestral">Trimestral</option>
                                        <option value="Semestral">Semestral</option>
                                        <option value="Anual">Anual</option>
                                        <option value="Personalizado">Personalizado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Precio Renovación (S/)</label>
                                    <input
                                        type="number"
                                        name="precioRenovacion"
                                        value={formData.precioRenovacion}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Descuento vs Normal (%)</label>
                                    <input
                                        type="number"
                                        name="descuentoVsNormal"
                                        value={formData.descuentoVsNormal}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Período de Prueba Gratis (días)</label>
                                <input
                                    type="number"
                                    name="periodoGratis"
                                    value={formData.periodoGratis}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Beneficios Incluidos */}
                        <div className="form-section">
                            <h3>✨ Beneficios Incluidos</h3>
                            
                            <div className="form-group">
                                <label>Número de Sesiones Incluidas</label>
                                <input
                                    type="number"
                                    name="sesionesIncluidas"
                                    value={formData.sesionesIncluidas}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label>Servicios Incluidos</label>
                                <div className="checkbox-group">
                                    {serviciosDisponibles.map(servicio => (
                                        <label key={servicio} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.serviciosIncluidos.includes(servicio)}
                                                onChange={() => handleServiciosChange(servicio)}
                                            />
                                            {servicio}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Descuento Adicional (%)</label>
                                    <input
                                        type="number"
                                        name="descuentoAdicional"
                                        value={formData.descuentoAdicional}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="100"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Invitaciones Amigos</label>
                                    <input
                                        type="number"
                                        name="invitacionesAmigos"
                                        value={formData.invitacionesAmigos}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="form-group checkbox-single">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="prioridadReservas"
                                        checked={formData.prioridadReservas}
                                        onChange={handleInputChange}
                                    />
                                    Prioridad en reservas
                                </label>
                            </div>

                            <div className="form-group checkbox-single">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="accesoEventos"
                                        checked={formData.accesoEventos}
                                        onChange={handleInputChange}
                                    />
                                    Acceso a eventos exclusivos
                                </label>
                            </div>
                        </div>

                        {/* Restricciones */}
                        <div className="form-section">
                            <h3>🔒 Restricciones</h3>
                            
                            <div className="form-group">
                                <label>Caducidad Sesiones No Usadas (días)</label>
                                <input
                                    type="number"
                                    name="caducidadSesiones"
                                    value={formData.caducidadSesiones}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label>Política de Cancelación</label>
                                <textarea
                                    name="politicaCancelacion"
                                    value={formData.politicaCancelacion}
                                    onChange={handleInputChange}
                                    placeholder="Describe la política..."
                                    rows="2"
                                />
                            </div>
                        </div>

                        {/* Renovación */}
                        <div className="form-section">
                            <h3>🔄 Renovación</h3>
                            
                            <div className="form-group checkbox-single">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="renovacionAutomatica"
                                        checked={formData.renovacionAutomatica}
                                        onChange={handleInputChange}
                                    />
                                    Renovación automática
                                </label>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Notificar Días Antes</label>
                                    <input
                                        type="number"
                                        name="notificarDiasAntes"
                                        value={formData.notificarDiasAntes}
                                        onChange={handleInputChange}
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Penalización Cancelación (S/)</label>
                                    <input
                                        type="number"
                                        name="penalizacionCancelacion"
                                        value={formData.penalizacionCancelacion}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Configuración Avanzada */}
                        <div className="form-section">
                            <h3>⚙️ Configuración Avanzada</h3>
                            
                            <div className="form-group">
                                <label>Límite de Membresías Activas</label>
                                <input
                                    type="number"
                                    name="limiteMiembros"
                                    value={formData.limiteMiembros}
                                    onChange={handleInputChange}
                                    min="0"
                                    placeholder="0 = ilimitado"
                                />
                            </div>

                            <div className="form-group checkbox-single">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="permitirPausar"
                                        checked={formData.permitirPausar}
                                        onChange={handleInputChange}
                                    />
                                    Permitir pausar membresía
                                </label>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                            <button className="btn-save" onClick={handleSavePlan}>
                                {editingPlan ? 'Actualizar' : 'Crear'} Plan
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PlanesMembresias;

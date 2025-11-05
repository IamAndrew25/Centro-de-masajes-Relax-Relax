import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { getPlanes, createPlan, updatePlan, deletePlan } from './JS/planesMembresiasService';

const PlanesMembresias = () => {
    const [planes, setPlanes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        tipo: 'plan',
        precio: '',
        precio_anterior: '',
        duracion: '',
        duracion_unidad: 'meses',
        servicios_incluidos: [],
        beneficios: [],
        estado: 'activo',
        destacado: false,
        color: '#667eea',
        icono: '💎',
        imagen: ''
    });

    const [servicioInput, setServicioInput] = useState('');
    const [beneficioInput, setBeneficioInput] = useState('');

    useEffect(() => {
        loadPlanes();
    }, []);

    const loadPlanes = async () => {
        setLoading(true);
        try {
            const data = await getPlanes();
            setPlanes(data);
        } catch (error) {
            console.error('Error al cargar planes:', error);
            alert('Error al cargar los planes');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddServicio = () => {
        if (servicioInput.trim()) {
            setFormData(prev => ({
                ...prev,
                servicios_incluidos: [...prev.servicios_incluidos, servicioInput.trim()]
            }));
            setServicioInput('');
            console.log('✓ Servicio agregado:', servicioInput.trim());
        }
    };

    const handleRemoveServicio = (index) => {
        setFormData(prev => ({
            ...prev,
            servicios_incluidos: prev.servicios_incluidos.filter((_, i) => i !== index)
        }));
        console.log('✗ Servicio removido');
    };

    const handleAddBeneficio = () => {
        if (beneficioInput.trim()) {
            setFormData(prev => ({
                ...prev,
                beneficios: [...prev.beneficios, beneficioInput.trim()]
            }));
            setBeneficioInput('');
            console.log('✓ Beneficio agregado:', beneficioInput.trim());
        }
    };

    const handleRemoveBeneficio = (index) => {
        setFormData(prev => ({
            ...prev,
            beneficios: prev.beneficios.filter((_, i) => i !== index)
        }));
        console.log('✗ Beneficio removido');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                alert('⚠️ Por favor, selecciona un archivo de imagen válido');
                return;
            }
            
            // Validar tamaño (máx 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('⚠️ La imagen es muy grande. Tamaño máximo: 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    imagen: reader.result
                }));
                console.log('✓ Imagen cargada:', file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            imagen: ''
        }));
        console.log('🗑️ Imagen removida');
    };

    const handleNew = () => {
        console.log('🆕 Abriendo modal para nuevo plan');
        setEditMode(false);
        setCurrentPlan(null);
        setFormData({
            nombre: '',
            descripcion: '',
            tipo: 'plan',
            precio: '',
            precio_anterior: '',
            duracion: '',
            duracion_unidad: 'meses',
            servicios_incluidos: [],
            beneficios: [],
            estado: 'activo',
            destacado: false,
            color: '#667eea',
            icono: '💎',
            imagen: ''
        });
        setShowModal(true);
        console.log('✓ Modal abierto');
    };

    const handleEdit = (plan) => {
        console.log('✏️ Editando plan:', plan);
        setEditMode(true);
        setCurrentPlan(plan);
        setFormData(plan);
        setShowModal(true);
        console.log('✓ Modal de edición abierto');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        console.log('💾 Guardando plan...', formData);
        setLoading(true);
        try {
            if (editMode) {
                console.log('✏️ Actualizando plan existente');
                await updatePlan(currentPlan.id, formData);
                alert('✓ Plan actualizado exitosamente');
            } else {
                console.log('➕ Creando nuevo plan');
                await createPlan(formData);
                alert('✓ Plan creado exitosamente');
            }
            setShowModal(false);
            loadPlanes();
        } catch (error) {
            console.error('❌ Error al guardar plan:', error);
            alert('Error al guardar el plan. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        console.log('🗑️ Intentando eliminar plan:', id);
        if (window.confirm('¿Estás seguro de eliminar este plan/membresía?')) {
            setLoading(true);
            try {
                await deletePlan(id);
                alert('✓ Plan eliminado exitosamente');
                loadPlanes();
                console.log('✓ Plan eliminado');
            } catch (error) {
                console.error('❌ Error al eliminar plan:', error);
                alert('Error al eliminar el plan. Por favor, intenta de nuevo.');
            } finally {
                setLoading(false);
            }
        }
    };

    const toggleDestacado = async (plan) => {
        console.log('⭐ Cambiando estado destacado:', plan.id);
        setLoading(true);
        try {
            await updatePlan(plan.id, { ...plan, destacado: !plan.destacado });
            loadPlanes();
            console.log('✓ Estado destacado actualizado');
        } catch (error) {
            console.error('❌ Error al cambiar destacado:', error);
            alert('Error al cambiar el estado. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>💎 Planes y Membresías</h2>
                <button className="btn-primary" onClick={handleNew}>
                    ➕ Nuevo Plan
                </button>
            </div>

            <div className="planes-grid">
                {planes.map(plan => (
                    <Card 
                        key={plan.id} 
                        className={`plan-card ${plan.destacado ? 'destacado' : ''}`}
                        style={{ borderColor: plan.color }}
                    >
                        {plan.destacado && (
                            <div className="plan-badge-destacado">⭐ Más Popular</div>
                        )}

                        <div className="plan-header" style={{ background: plan.color }}>
                            <span className="plan-icono">{plan.icono}</span>
                            <h3>{plan.nombre}</h3>
                            <span className={`badge ${plan.tipo === 'membresia' ? 'badge-premium' : 'badge-plan'}`}>
                                {plan.tipo === 'membresia' ? '👑 Membresía' : '📦 Plan'}
                            </span>
                        </div>

                        {plan.imagen && (
                            <div className="plan-image">
                                <img src={plan.imagen} alt={plan.nombre} />
                            </div>
                        )}

                        <div className="plan-content">
                            <p className="plan-descripcion">{plan.descripcion}</p>

                            <div className="plan-precio">
                                {plan.precio_anterior && (
                                    <span className="precio-anterior">S/ {plan.precio_anterior}</span>
                                )}
                                <div className="precio-actual">
                                    <span className="precio-valor">S/ {plan.precio}</span>
                                    <span className="precio-periodo">
                                        /{plan.duracion} {plan.duracion_unidad}
                                    </span>
                                </div>
                            </div>

                            <div className="plan-servicios">
                                <h4>✓ Servicios Incluidos:</h4>
                                <ul>
                                    {plan.servicios_incluidos.map((servicio, index) => (
                                        <li key={index}>✓ {servicio}</li>
                                    ))}
                                </ul>
                            </div>

                            {plan.beneficios && plan.beneficios.length > 0 && (
                                <div className="plan-beneficios">
                                    <h4>🎁 Beneficios:</h4>
                                    <ul>
                                        {plan.beneficios.map((beneficio, index) => (
                                            <li key={index}>• {beneficio}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="plan-actions">
                                <button 
                                    className={`btn-destacar ${plan.destacado ? 'active' : ''}`}
                                    onClick={() => toggleDestacado(plan)}
                                    title={plan.destacado ? 'Quitar destacado' : 'Destacar'}
                                >
                                    {plan.destacado ? '⭐ Destacado' : '☆ Destacar'}
                                </button>
                                
                                <div className="action-buttons">
                                    <button 
                                        className="btn-icon btn-edit" 
                                        onClick={() => handleEdit(plan)}
                                        title="Editar"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        className="btn-icon btn-delete" 
                                        onClick={() => handleDelete(plan.id)}
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={`plan-estado ${plan.estado}`}>
                            {plan.estado === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal para crear/editar plan */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editMode ? '✏️ Editar' : '➕ Nuevo'} Plan/Membresía</h3>
                            <button 
                                type="button" 
                                className="modal-close" 
                                onClick={() => setShowModal(false)}
                            >
                                ✖️
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSave} className="plan-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre del Plan *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ej: Plan Premium"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Tipo *</label>
                                <select
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="plan">📦 Plan</option>
                                    <option value="membresia">👑 Membresía</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Describe el plan o membresía"
                                className="form-textarea"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Precio *</label>
                                <div className="input-with-prefix">
                                    <span className="input-prefix">S/</span>
                                    <input
                                        type="number"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="99.99"
                                        className="form-input with-prefix"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Precio Anterior (opcional)</label>
                                <div className="input-with-prefix">
                                    <span className="input-prefix">S/</span>
                                    <input
                                        type="number"
                                        name="precio_anterior"
                                        value={formData.precio_anterior}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="149.99"
                                        className="form-input with-prefix"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Duración *</label>
                                <input
                                    type="number"
                                    name="duracion"
                                    value={formData.duracion}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    placeholder="1"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Unidad de Tiempo *</label>
                                <select
                                    name="duracion_unidad"
                                    value={formData.duracion_unidad}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="dias">Días</option>
                                    <option value="semanas">Semanas</option>
                                    <option value="meses">Meses</option>
                                    <option value="años">Años</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Color del Plan</label>
                                <input
                                    type="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    className="form-color"
                                    style={{ width: '100px', height: '40px', cursor: 'pointer' }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Icono del Plan</label>
                                <div className="icon-selector">
                                    {['💎', '👑', '⭐', '🎯', '🔥', '💪', '🌟', '✨', '🎁', '🏆', '💰', '🎉', '🌈', '💫', '🚀'].map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            className={`icon-option ${formData.icono === emoji ? 'selected' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, icono: emoji }))}
                                            title={`Seleccionar ${emoji}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Imagen del Plan */}
                        <div className="form-group">
                            <label>📷 Imagen del Plan/Membresía</label>
                            <div className="image-upload-container">
                                {!formData.imagen ? (
                                    <div className="upload-area">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            id="plan-image-upload"
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="plan-image-upload" className="upload-label">
                                            <div className="upload-icon">📁</div>
                                            <p>Haz clic para seleccionar una imagen</p>
                                            <small>JPG, PNG o GIF (máx. 5MB)</small>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="image-preview-card">
                                        <div className="preview-header">
                                            <div className="preview-info">
                                                <span className="preview-icon">✅</span>
                                                <div>
                                                    <p className="preview-title">Imagen cargada</p>
                                                    <small className="preview-subtitle">Listo para guardar</small>
                                                </div>
                                            </div>
                                            <button 
                                                type="button" 
                                                className="change-image-btn"
                                                onClick={removeImage}
                                                title="Cambiar imagen"
                                            >
                                                🔄 Cambiar
                                            </button>
                                        </div>
                                        <div className="preview-image-container">
                                            <img src={formData.imagen} alt="Preview del plan" />
                                            <div className="image-overlay">
                                                <button 
                                                    type="button" 
                                                    className="remove-image-btn-overlay"
                                                    onClick={removeImage}
                                                    title="Eliminar imagen"
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Servicios Incluidos */}
                        <div className="form-group">
                            <label>✓ Servicios Incluidos</label>
                            <div className="input-list">
                                <input
                                    type="text"
                                    value={servicioInput}
                                    onChange={(e) => setServicioInput(e.target.value)}
                                    placeholder="Ej: Masaje relajante 60 min"
                                    className="form-input"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddServicio())}
                                />
                                <button type="button" className="btn-add" onClick={handleAddServicio}>
                                    ➕ Agregar
                                </button>
                            </div>
                            <div className="items-list">
                                {formData.servicios_incluidos.map((servicio, index) => (
                                    <div key={index} className="item-tag">
                                        <span>✓ {servicio}</span>
                                        <button type="button" onClick={() => handleRemoveServicio(index)}>
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Beneficios */}
                        <div className="form-group">
                            <label>🎁 Beneficios Adicionales</label>
                            <div className="input-list">
                                <input
                                    type="text"
                                    value={beneficioInput}
                                    onChange={(e) => setBeneficioInput(e.target.value)}
                                    placeholder="Ej: 10% descuento en productos"
                                    className="form-input"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBeneficio())}
                                />
                                <button type="button" className="btn-add" onClick={handleAddBeneficio}>
                                    ➕ Agregar
                                </button>
                            </div>
                            <div className="items-list">
                                {formData.beneficios.map((beneficio, index) => (
                                    <div key={index} className="item-tag benefit-tag">
                                        <span>• {beneficio}</span>
                                        <button type="button" onClick={() => handleRemoveBeneficio(index)}>
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Estado *</label>
                                <select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="activo">🟢 Activo</option>
                                    <option value="inactivo">🔴 Inactivo</option>
                                </select>
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="destacado"
                                        checked={formData.destacado}
                                        onChange={handleInputChange}
                                    />
                                    <span>⭐ Destacar este plan (Más Popular)</span>
                                </label>
                            </div>
                        </div>

                        <div className="modal-form-actions">
                            <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                <span>✕</span> Cancelar
                            </button>
                            <button type="submit" className="btn-save">
                                <span>{editMode ? '💾' : '✓'}</span> {editMode ? 'Guardar Cambios' : 'Crear Plan'}
                            </button>
                        </div>
                        </form>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                /* === GRID DE PLANES === */
                .planes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 25px;
                    margin-top: 20px;
                }

                /* === ESTILOS DEL FORMULARIO === */
                .plan-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    max-height: 70vh;
                    overflow-y: auto;
                    padding-right: 10px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-group label {
                    font-weight: 600;
                    color: #2c3e50;
                    font-size: 0.95em;
                }

                .form-input,
                .form-select,
                .form-textarea,
                .form-color {
                    padding: 12px 15px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 0.95em;
                    transition: all 0.3s ease;
                    font-family: inherit;
                }

                .form-input:focus,
                .form-select:focus,
                .form-textarea:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 80px;
                }

                .form-color {
                    height: 50px;
                    cursor: pointer;
                }

                /* === SELECTOR DE ICONOS === */
                .icon-selector {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
                    gap: 8px;
                    margin-top: 10px;
                }

                .icon-option {
                    width: 50px;
                    height: 50px;
                    font-size: 1.8em;
                    border: 2px solid #ddd;
                    border-radius: 10px;
                    background: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .icon-option:hover {
                    border-color: #667eea;
                    background: #f0f4ff;
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
                }

                .icon-option.selected {
                    border-color: #667eea;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    transform: scale(1.15);
                    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
                    animation: pulseIcon 0.4s ease-out;
                }

                .icon-option.selected::after {
                    content: '✓';
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    background: #28a745;
                    color: white;
                    font-size: 0.5em;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid white;
                    font-weight: bold;
                }

                @keyframes pulseIcon {
                    0%, 100% {
                        transform: scale(1.15);
                    }
                    50% {
                        transform: scale(1.25);
                    }
                }

                .input-with-prefix {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .input-prefix {
                    position: absolute;
                    left: 15px;
                    color: #666;
                    font-weight: 600;
                    z-index: 1;
                }

                .form-input.with-prefix {
                    padding-left: 45px;
                }

                .input-list {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .input-list input {
                    flex: 1;
                }

                .btn-add {
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    white-space: nowrap;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .btn-add:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                }

                .items-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 10px;
                }

                .item-tag {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 15px;
                    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                    border: 2px solid #90caf9;
                    border-radius: 20px;
                    font-size: 0.9em;
                    transition: all 0.3s ease;
                }

                .benefit-tag {
                    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
                    border-color: #ffb74d;
                }

                .item-tag:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                }

                .item-tag button {
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    font-weight: bold;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }

                .item-tag button:hover {
                    background: rgba(255,0,0,0.1);
                    color: #f44336;
                }

                .checkbox-group {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    padding: 10px;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }

                .checkbox-label:hover {
                    background: #f5f5f5;
                }

                .checkbox-label input[type="checkbox"] {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }

                .modal-form-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 10px;
                    padding-top: 20px;
                    border-top: 2px solid #f0f0f0;
                }

                .btn-cancel,
                .btn-save {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.95em;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                }

                .btn-cancel {
                    background: #f5f5f5;
                    color: #666;
                }

                .btn-cancel:hover {
                    background: #e0e0e0;
                    transform: translateY(-2px);
                }

                .btn-save {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .btn-save:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                }

                .btn-cancel span,
                .btn-save span {
                    font-size: 1.1em;
                }

                .plan-card {
                    position: relative;
                    border: 3px solid;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    overflow: visible;
                }

                .plan-card.destacado {
                    transform: scale(1.05);
                    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
                }

                .plan-badge-destacado {
                    position: absolute;
                    top: -10px;
                    right: 20px;
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white;
                    padding: 8px 20px;
                    border-radius: 20px;
                    font-weight: bold;
                    font-size: 0.85em;
                    z-index: 1;
                    box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
                }

                .plan-header {
                    padding: 30px 20px;
                    text-align: center;
                    color: white;
                    position: relative;
                }

                .plan-icono {
                    font-size: 3em;
                    display: block;
                    margin-bottom: 10px;
                }

                .plan-header h3 {
                    margin: 10px 0;
                    font-size: 1.8em;
                    color: white;
                }

                .badge-premium {
                    background: rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 0.85em;
                    display: inline-block;
                    margin-top: 10px;
                }

                .badge-plan {
                    background: rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 0.85em;
                    display: inline-block;
                    margin-top: 10px;
                }

                .plan-image {
                    width: 100%;
                    height: 200px;
                    overflow: hidden;
                    position: relative;
                }

                .plan-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                .plan-content {
                    padding: 20px;
                }

                .plan-descripcion {
                    color: #666;
                    line-height: 1.6;
                    margin-bottom: 20px;
                    text-align: center;
                }

                .plan-precio {
                    text-align: center;
                    margin: 20px 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    border-radius: 12px;
                }

                .precio-anterior {
                    display: block;
                    color: #999;
                    text-decoration: line-through;
                    font-size: 1em;
                    margin-bottom: 5px;
                }

                .precio-actual {
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                    gap: 5px;
                }

                .precio-valor {
                    font-size: 2.5em;
                    font-weight: bold;
                    color: #2c3e50;
                }

                .precio-periodo {
                    color: #666;
                    font-size: 1em;
                }

                .plan-servicios, .plan-beneficios {
                    margin: 20px 0;
                }

                .plan-servicios h4, .plan-beneficios h4 {
                    color: #2c3e50;
                    margin-bottom: 10px;
                    font-size: 1em;
                }

                .plan-servicios ul, .plan-beneficios ul {
                    list-style: none;
                    padding: 0;
                }

                .plan-servicios li, .plan-beneficios li {
                    padding: 8px 0;
                    color: #555;
                    border-bottom: 1px solid #f0f0f0;
                }

                .plan-servicios li:last-child, .plan-beneficios li:last-child {
                    border-bottom: none;
                }

                .plan-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 2px solid #f0f0f0;
                }

                .btn-destacar {
                    padding: 10px 20px;
                    border: 2px solid #ffc107;
                    background: white;
                    color: #ffc107;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-destacar.active {
                    background: #ffc107;
                    color: white;
                }

                .action-buttons {
                    display: flex;
                    gap: 10px;
                }

                .plan-estado {
                    text-align: center;
                    padding: 10px;
                    font-weight: bold;
                    border-top: 1px solid #f0f0f0;
                }

                .plan-estado.activo {
                    color: #28a745;
                }

                .plan-estado.inactivo {
                    color: #dc3545;
                }

                .input-list {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .input-list input {
                    flex: 1;
                }

                .btn-add {
                    padding: 8px 15px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    white-space: nowrap;
                }

                .items-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 10px;
                }

                .item-tag {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 12px;
                    background: #e3f2fd;
                    border: 1px solid #90caf9;
                    border-radius: 20px;
                    font-size: 0.9em;
                }

                .item-tag button {
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    font-weight: bold;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                }

                .checkbox-group {
                    display: flex;
                    align-items: center;
                }

                .checkbox-group label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                }

                .checkbox-group input[type="checkbox"] {
                    width: auto;
                    margin: 0;
                }

                /* === CUSTOM MODAL STYLES === */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    backdrop-filter: blur(5px);
                    animation: fadeIn 0.2s ease-in;
                }

                .modal-content {
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                    max-width: 900px;
                    width: 90%;
                    max-height: 90vh;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    animation: slideUp 0.3s ease-out;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 25px;
                    border-bottom: 2px solid #f0f0f0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .modal-header h3 {
                    margin: 0;
                    font-size: 1.5em;
                    font-weight: 600;
                }

                .modal-close {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    font-size: 1.5em;
                    cursor: pointer;
                    padding: 5px 12px;
                    border-radius: 8px;
                    color: white;
                    transition: all 0.3s ease;
                }

                .modal-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }

                .modal-body {
                    padding: 25px;
                    overflow-y: auto;
                    flex: 1;
                }

                /* === LOADING OVERLAY === */
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    backdrop-filter: blur(3px);
                }

                .loading-spinner {
                    width: 60px;
                    height: 60px;
                    border: 5px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* === ESTILOS DE IMAGEN UPLOAD === */
                .image-upload-container {
                    margin-top: 10px;
                }

                .upload-area {
                    border: 2px dashed #ddd;
                    border-radius: 10px;
                    padding: 30px;
                    text-align: center;
                    background: #f9f9f9;
                    transition: all 0.3s ease;
                }

                .upload-area:hover {
                    border-color: #667eea;
                    background: #f0f4ff;
                }

                .upload-label {
                    cursor: pointer;
                    display: block;
                }

                .upload-icon {
                    font-size: 3em;
                    margin-bottom: 10px;
                }

                .upload-area p {
                    margin: 10px 0 5px;
                    font-weight: 500;
                    color: #333;
                }

                .upload-area small {
                    color: #666;
                    font-size: 0.9em;
                }

                /* === PREVIEW CARD PROFESIONAL === */
                .image-preview-card {
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    overflow: hidden;
                    background: white;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    animation: slideIn 0.4s ease-out;
                }

                .image-preview-card:hover {
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                }

                .preview-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    border-bottom: 1px solid #e0e0e0;
                }

                .preview-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .preview-icon {
                    font-size: 1.5em;
                    animation: bounceIn 0.5s ease-out;
                }

                .preview-title {
                    margin: 0;
                    font-weight: 600;
                    color: #333;
                    font-size: 0.95em;
                }

                .preview-subtitle {
                    color: #666;
                    font-size: 0.85em;
                }

                .change-image-btn {
                    background: white;
                    border: 2px solid #667eea;
                    color: #667eea;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.9em;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .change-image-btn:hover {
                    background: #667eea;
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }

                .preview-image-container {
                    position: relative;
                    overflow: hidden;
                    background: #f8f9fa;
                }

                .preview-image-container img {
                    width: 100%;
                    height: 280px;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.3s ease;
                }

                .preview-image-container:hover img {
                    transform: scale(1.05);
                }

                .image-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .preview-image-container:hover .image-overlay {
                    opacity: 1;
                }

                .remove-image-btn-overlay {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1em;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                    transform: translateY(10px);
                }

                .preview-image-container:hover .remove-image-btn-overlay {
                    transform: translateY(0);
                }

                .remove-image-btn-overlay:hover {
                    background: #c82333;
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes bounceIn {
                    0% {
                        transform: scale(0);
                    }
                    50% {
                        transform: scale(1.2);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                /* Estilos antiguos - mantener para compatibilidad */
                .image-preview {
                    position: relative;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }

                .image-preview img {
                    width: 100%;
                    height: 250px;
                    object-fit: cover;
                    display: block;
                }

                .remove-image-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(220, 53, 69, 0.9);
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    transition: all 0.3s ease;
                    animation: fadeInDown 0.3s ease-out;
                }

                .remove-image-btn:hover {
                    background: rgba(220, 53, 69, 1);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
                }

                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            {/* Loading overlay */}
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}
        </div>
    );
};

export default PlanesMembresias;

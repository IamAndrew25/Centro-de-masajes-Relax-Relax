import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { getPromociones, createPromocion, updatePromocion, deletePromocion } from './JS/promocionesService';

const Promociones = () => {
    const [promociones, setPromociones] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentPromocion, setCurrentPromocion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        descuento: '',
        tipo_descuento: 'porcentaje',
        codigo: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'activa',
        imagen_url: '',
        imagen_file: null,
        condiciones: ''
    });

    useEffect(() => {
        loadPromociones();
    }, []);

    const loadPromociones = async () => {
        setLoading(true);
        try {
            const data = await getPromociones();
            setPromociones(data);
        } catch (error) {
            console.error('Error al cargar promociones:', error);
            alert('Error al cargar las promociones');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar que sea una imagen
            if (!file.type.startsWith('image/')) {
                alert('⚠️ Por favor selecciona un archivo de imagen válido');
                return;
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('⚠️ La imagen es muy grande. Por favor selecciona una imagen menor a 5MB');
                return;
            }

            // Convertir a base64 para preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    imagen_url: reader.result,
                    imagen_file: file
                }));
            };
            reader.readAsDataURL(file);
            console.log('📷 Imagen seleccionada:', file.name);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            imagen_url: '',
            imagen_file: null
        }));
        // Limpiar el input file
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        console.log('🗑️ Imagen removida');
    };

    const handleNew = () => {
        console.log('🆕 Abriendo modal para nueva promoción');
        setEditMode(false);
        setCurrentPromocion(null);
        setFormData({
            nombre: '',
            descripcion: '',
            descuento: '',
            tipo_descuento: 'porcentaje',
            codigo: '',
            fecha_inicio: '',
            fecha_fin: '',
            estado: 'activa',
            imagen_url: '',
            imagen_file: null,
            condiciones: ''
        });
        setShowModal(true);
        console.log('✓ Modal abierto:', true);
    };

    const handleEdit = (promocion) => {
        console.log('✏️ Editando promoción:', promocion);
        setEditMode(true);
        setCurrentPromocion(promocion);
        setFormData({
            ...promocion,
            fecha_inicio: promocion.fecha_inicio,
            fecha_fin: promocion.fecha_fin,
            imagen_file: null // No hay archivo al editar, solo URL existente
        });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editMode) {
                await updatePromocion(currentPromocion.id, formData);
                alert('✓ Promoción actualizada exitosamente');
            } else {
                await createPromocion(formData);
                alert('✓ Promoción creada exitosamente');
            }
            setShowModal(false);
            loadPromociones();
        } catch (error) {
            console.error('Error al guardar promoción:', error);
            alert('✗ Error al guardar la promoción');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        console.log('🗑️ Intentando eliminar promoción ID:', id);
        if (window.confirm('⚠️ ¿Estás seguro de eliminar esta promoción?\n\nEsta acción no se puede deshacer.')) {
            setLoading(true);
            try {
                await deletePromocion(id);
                console.log('✓ Promoción eliminada');
                alert('✓ Promoción eliminada exitosamente');
                loadPromociones();
            } catch (error) {
                console.error('✗ Error al eliminar promoción:', error);
                alert('✗ Error al eliminar la promoción');
            } finally {
                setLoading(false);
            }
        } else {
            console.log('❌ Eliminación cancelada');
        }
    };

    const toggleEstado = async (promocion) => {
        const nuevoEstado = promocion.estado === 'activa' ? 'inactiva' : 'activa';
        const mensaje = nuevoEstado === 'activa' 
            ? '¿Deseas activar esta promoción?' 
            : '¿Deseas desactivar esta promoción?';
        
        if (window.confirm(mensaje)) {
            setLoading(true);
            try {
                await updatePromocion(promocion.id, { ...promocion, estado: nuevoEstado });
                alert(`✓ Promoción ${nuevoEstado === 'activa' ? 'activada' : 'desactivada'} exitosamente`);
                loadPromociones();
            } catch (error) {
                console.error('Error al cambiar estado:', error);
                alert('✗ Error al cambiar el estado de la promoción');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="admin-section">
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">Cargando...</div>
                </div>
            )}
            <div className="section-header">
                <h2>🎉 Gestión de Promociones</h2>
                <button className="btn-primary" onClick={handleNew} disabled={loading}>
                    ➕ Nueva Promoción
                </button>
            </div>

            <div className="promociones-grid">
                {promociones.map(promocion => (
                    <Card key={promocion.id} className="promocion-card">
                        <div className="promocion-header">
                            <span className={`badge ${promocion.estado === 'activa' ? 'badge-success' : 'badge-inactive'}`}>
                                {promocion.estado === 'activa' ? '✓ Activa' : '✕ Inactiva'}
                            </span>
                            <div className="card-actions">
                                <button 
                                    className="btn-icon btn-edit" 
                                    onClick={() => handleEdit(promocion)}
                                    title="Editar"
                                >
                                    ✏️
                                </button>
                                <button 
                                    className="btn-icon btn-delete" 
                                    onClick={() => handleDelete(promocion.id)}
                                    title="Eliminar"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>

                        {promocion.imagen_url && (
                            <div className="promocion-image">
                                <img src={promocion.imagen_url} alt={promocion.nombre} />
                            </div>
                        )}

                        <div className="promocion-content">
                            <h3>{promocion.nombre}</h3>
                            <p className="promocion-descripcion">{promocion.descripcion}</p>
                            
                            <div className="promocion-descuento">
                                <span className="descuento-badge">
                                    {promocion.tipo_descuento === 'porcentaje' 
                                        ? `${promocion.descuento}% OFF`
                                        : `S/ ${promocion.descuento} OFF`
                                    }
                                </span>
                            </div>

                            <div className="promocion-codigo">
                                <strong>Código:</strong> 
                                <span className="codigo-badge">{promocion.codigo}</span>
                            </div>

                            <div className="promocion-fechas">
                                <div>
                                    <small>Inicio:</small>
                                    <span>{new Date(promocion.fecha_inicio).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <small>Fin:</small>
                                    <span>{new Date(promocion.fecha_fin).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {promocion.condiciones && (
                                <div className="promocion-condiciones">
                                    <small><strong>Condiciones:</strong> {promocion.condiciones}</small>
                                </div>
                            )}

                            <button 
                                className={`btn-toggle ${promocion.estado === 'activa' ? 'active' : ''}`}
                                onClick={() => toggleEstado(promocion)}
                            >
                                {promocion.estado === 'activa' ? '🔴 Desactivar' : '🟢 Activar'}
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal para crear/editar promoción */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editMode ? '✏️ Editar Promoción' : '➕ Nueva Promoción'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✖️</button>
                        </div>
                        
                        <div className="modal-body">
                            <form onSubmit={handleSave} className="promocion-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre de la Promoción *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ej: Descuento Verano 2024"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Código Promocional *</label>
                                <input
                                    type="text"
                                    name="codigo"
                                    value={formData.codigo}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ej: VERANO2024"
                                    className="form-input"
                                    style={{ textTransform: 'uppercase' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Describe los beneficios de esta promoción"
                                className="form-textarea"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Tipo de Descuento *</label>
                                <select
                                    name="tipo_descuento"
                                    value={formData.tipo_descuento}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="porcentaje">Porcentaje (%)</option>
                                    <option value="monto">Monto Fijo (S/)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Descuento *</label>
                                <div className="input-with-prefix">
                                    {formData.tipo_descuento === 'monto' && <span className="input-prefix">S/</span>}
                                    <input
                                        type="number"
                                        name="descuento"
                                        value={formData.descuento}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder={formData.tipo_descuento === 'porcentaje' ? '20' : '50.00'}
                                        className={`form-input ${formData.tipo_descuento === 'monto' ? 'with-prefix' : ''}`}
                                    />
                                    {formData.tipo_descuento === 'porcentaje' && <span className="input-suffix">%</span>}
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Fecha de Inicio *</label>
                                <input
                                    type="date"
                                    name="fecha_inicio"
                                    value={formData.fecha_inicio}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Fecha de Fin *</label>
                                <input
                                    type="date"
                                    name="fecha_fin"
                                    value={formData.fecha_fin}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>📷 Imagen de la Promoción (opcional)</label>
                            <div className="image-upload-container">
                                <input
                                    type="file"
                                    id="imagen-upload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file-input"
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="imagen-upload" className="file-input-label">
                                    📁 Seleccionar Imagen
                                </label>
                                <span className="file-info">Formatos: JPG, PNG, GIF (máx. 5MB)</span>
                            </div>
                            
                            {formData.imagen_url && (
                                <div className="image-preview">
                                    <img src={formData.imagen_url} alt="Preview" />
                                    <button 
                                        type="button" 
                                        className="remove-image-btn"
                                        onClick={removeImage}
                                        title="Eliminar imagen"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Condiciones</label>
                            <textarea
                                name="condiciones"
                                value={formData.condiciones}
                                onChange={handleInputChange}
                                rows="2"
                                placeholder="Ej: Válido solo para reservas superiores a S/ 100"
                                className="form-textarea"
                            />
                        </div>

                        <div className="form-group">
                            <label>Estado *</label>
                            <select
                                name="estado"
                                value={formData.estado}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="activa">✓ Activa</option>
                                <option value="inactiva">✕ Inactiva</option>
                            </select>
                        </div>

                        <div className="modal-form-actions">
                            <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                <span>✕</span> Cancelar
                            </button>
                            <button type="submit" className="btn-save">
                                <span>{editMode ? '💾' : '✓'}</span> {editMode ? 'Guardar Cambios' : 'Crear Promoción'}
                            </button>
                        </div>
                    </form>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                /* === MODAL === */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .modal-content {
                    background: white;
                    border-radius: 16px;
                    max-width: 800px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    animation: slideIn 0.3s ease;
                }

                @keyframes slideIn {
                    from { 
                        transform: translateY(-50px);
                        opacity: 0;
                    }
                    to { 
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 30px;
                    border-bottom: 2px solid #f0f0f0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 16px 16px 0 0;
                }

                .modal-header h3 {
                    margin: 0;
                    font-size: 1.5em;
                }

                .modal-close {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    font-size: 1.5em;
                    cursor: pointer;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .modal-close:hover {
                    background: rgba(255,255,255,0.3);
                    transform: rotate(90deg);
                }

                .modal-body {
                    padding: 30px;
                }

                /* === GRID DE PROMOCIONES === */
                .promociones-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .promocion-card {
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .promocion-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                }

                /* === ESTILOS DEL FORMULARIO === */
                .promocion-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
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
                .form-textarea {
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

                .input-suffix {
                    position: absolute;
                    right: 15px;
                    color: #666;
                    font-weight: 600;
                }

                .form-input.with-prefix {
                    padding-left: 45px;
                }

                /* === UPLOAD DE IMAGEN === */
                .image-upload-container {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .file-input-label {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    width: fit-content;
                }

                .file-input-label:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                }

                .file-info {
                    color: #666;
                    font-size: 0.85em;
                    font-style: italic;
                }

                .image-preview {
                    position: relative;
                    margin-top: 15px;
                    border-radius: 12px;
                    overflow: hidden;
                    max-height: 300px;
                    border: 3px solid #e0e0e0;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }

                .image-preview img {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                .remove-image-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    background: rgba(255, 0, 0, 0.8);
                    color: white;
                    border: none;
                    font-size: 1.2em;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    font-weight: bold;
                }

                .remove-image-btn:hover {
                    background: rgba(255, 0, 0, 1);
                    transform: scale(1.1) rotate(90deg);
                    box-shadow: 0 4px 15px rgba(255, 0, 0, 0.5);
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

                /* === LOADING OVERLAY === */
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }

                .loading-spinner {
                    background: white;
                    padding: 30px 50px;
                    border-radius: 12px;
                    font-weight: bold;
                    font-size: 1.2em;
                    color: #667eea;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    animation: pulse 1.5s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                /* === CARDS === */

                .promocion-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .promocion-image {
                    width: 100%;
                    height: 150px;
                    overflow: hidden;
                    border-radius: 8px;
                    margin-bottom: 15px;
                }

                .promocion-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .promocion-content h3 {
                    margin: 0 0 10px 0;
                    color: #2c3e50;
                    font-size: 1.2em;
                }

                .promocion-descripcion {
                    color: #666;
                    font-size: 0.9em;
                    margin-bottom: 15px;
                    line-height: 1.5;
                }

                .promocion-descuento {
                    text-align: center;
                    margin: 15px 0;
                }

                .descuento-badge {
                    display: inline-block;
                    padding: 10px 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    font-size: 1.5em;
                    font-weight: bold;
                    border-radius: 12px;
                }

                .promocion-codigo {
                    text-align: center;
                    margin: 15px 0;
                }

                .codigo-badge {
                    display: inline-block;
                    padding: 8px 15px;
                    background: #f8f9fa;
                    border: 2px dashed #667eea;
                    border-radius: 6px;
                    font-weight: bold;
                    color: #667eea;
                    margin-left: 10px;
                    letter-spacing: 1px;
                }

                .promocion-fechas {
                    display: flex;
                    justify-content: space-between;
                    margin: 15px 0;
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 6px;
                }

                .promocion-fechas > div {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .promocion-fechas small {
                    color: #666;
                    font-size: 0.8em;
                }

                .promocion-fechas span {
                    font-weight: bold;
                    color: #2c3e50;
                }

                .promocion-condiciones {
                    margin: 15px 0;
                    padding: 10px;
                    background: #fff3cd;
                    border-left: 3px solid #ffc107;
                    border-radius: 4px;
                }

                .promocion-condiciones small {
                    color: #856404;
                }

                .btn-toggle {
                    width: 100%;
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 15px;
                }

                .btn-toggle.active {
                    background: #28a745;
                    color: white;
                }

                .btn-toggle:not(.active) {
                    background: #6c757d;
                    color: white;
                }

                .badge {
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 0.85em;
                    font-weight: bold;
                }

                .badge-success {
                    background: #d4edda;
                    color: #155724;
                }

                .badge-inactive {
                    background: #f8d7da;
                    color: #721c24;
                }

                .card-actions {
                    display: flex;
                    gap: 8px;
                }

                .btn-icon {
                    padding: 5px 10px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    font-size: 1.2em;
                    transition: transform 0.2s ease;
                }

                .btn-icon:hover {
                    transform: scale(1.2);
                }
            `}</style>
        </div>
    );
};

export default Promociones;

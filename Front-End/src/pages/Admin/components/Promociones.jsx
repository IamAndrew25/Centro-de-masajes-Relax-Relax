import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { getPromociones, createPromocion, updatePromocion, deletePromocion,uploadPromotionImage } from './JS/promocionesService';
import './Promociones.css'; 

// max campos 
const FIELD_MAX_LENGTHS = {
  nombre: 80,
  descripcion: 255,
  descuento: 4,      // ej: "99.9"
  fecha_inicio: 10,  // YYYY-MM-DD
  fecha_fin: 10      // YYYY-MM-DD
};

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
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'activa',
        imagen_url: '',
        imagen_file: null
    });

    useEffect(() => {
        loadPromociones();
    }, []);

    const loadPromociones = async () => {
        setLoading(true);
        try {
            const data = await getPromociones();

            const mapped = data.map(p => {
                const esPorcentaje = p.discountPercent > 0;
                const esMonto = p.discountAmount > 0;

                return {
                    id: p.id,
                    nombre: p.name,
                    descripcion: p.description,
                    descuento: esPorcentaje ? p.discountPercent : p.discountAmount,
                    tipo_descuento: esPorcentaje ? 'porcentaje' : 'monto',
                    fecha_inicio: p.startDate,
                    fecha_fin: p.endDate,
                    estado: p.active ? 'activa' : 'inactiva',
                    imagen_url: p.imageUrl
                };
            });


            setPromociones(mapped);
        } catch (error) {
            console.error('Error al cargar promociones:', error);
            alert('Error al cargar las promociones');
        } finally {
            setLoading(false);
        }
    };

// max lenght
    const handleInputChange = (e) => {
    const { name, value } = e.target;

    const max = FIELD_MAX_LENGTHS[name];
    let finalValue = value;

    // Para descuento permitimos solo números y punto
    if (name === 'descuento') {
      finalValue = value.replace(/[^0-9.]/g, '');
    }

    if (max && typeof finalValue === 'string') {
      finalValue = finalValue.slice(0, max);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };


    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert("Archivo inválido");
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert("La imagen debe ser menor a 10MB");
        return;
    }

    setFormData(prev => ({
        ...prev,
        imagen_file: file,
        // URL temporal solo para preview
        imagen_url: URL.createObjectURL(file)
    }));
};


    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            imagen_url: '',
            imagen_file: null
        }));
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
    };

    const handleNew = () => {
        setEditMode(false);
        setCurrentPromocion(null);
        setFormData({
            nombre: '',
            descripcion: '',
            descuento: '',
            tipo_descuento: 'porcentaje',
            fecha_inicio: '',
            fecha_fin: '',
            estado: 'activa',
            imagen_url: '',
            imagen_file: null
        });
        setShowModal(true);
    };

    const handleEdit = (promocion) => {

        setEditMode(true);
        setCurrentPromocion(promocion);

        setFormData({
            nombre: promocion.nombre,
            descripcion: promocion.descripcion,
            descuento: promocion.descuento,
            tipo_descuento: promocion.tipo_descuento,
            fecha_inicio: promocion.fecha_inicio,
            fecha_fin: promocion.fecha_fin,
            estado: promocion.estado,
            imagen_url: promocion.imagen_url,
            imagen_file: null
        });

        setShowModal(true);
    };

    const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        let imageUrl = formData.imagen_url;

        // 1. Si hay archivo nuevo → subirlo
        if (formData.imagen_file) {
            const uploadedUrl = await uploadPromotionImage(formData.imagen_file);
            imageUrl = uploadedUrl; // <-- actualizamos la URL real
        }

        // 2. Guardar datos en backend
        const body = {
            ...formData,
            imagen_url: imageUrl
        };

        if (editMode) {
            await updatePromocion(currentPromocion.id, body);
            alert('✓ Promoción actualizada');
        } else {
            await createPromocion(body);
            alert('✓ Promoción creada');
        }

        setShowModal(false);
        loadPromociones();
    } catch (error) {
        console.error("Error al guardar promoción:", error);
        alert("✗ Error al guardar la promoción");
    } finally {
        setLoading(false);
    }
};


    const handleDelete = async (id) => {
        if (window.confirm('⚠️ ¿Eliminar esta promoción?')) {
            setLoading(true);
            try {
                await deletePromocion(id);
                alert('✓ Promoción eliminada');
                loadPromociones();
            } catch (error) {
                console.error('✗ Error al eliminar promoción:', error);
                alert('✗ Error al eliminar la promoción');
            } finally {
                setLoading(false);
            }
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
                alert(`✓ Estado actualizado`);
                loadPromociones();
            } catch (error) {
                console.error('Error al cambiar estado:', error);
                alert('✗ Error al cambiar el estado');
            } finally {
                setLoading(false);
            }
        }
    };
    
    const getImageSrc = (url) => {
    if (!url) return '';
    // Si es URL absoluta o viene de los assets del frontend
    if (url.startsWith('http') || url.startsWith('/assets/')) return url;
    // Si es imagen subida al backend
    return `http://localhost:8080${url}`;
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
                                <img src={`http://localhost:8080${promocion.imagen_url}`} alt={promocion.nombre} />
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
                                    
                                    {/* Imagen en el modal */}
                                        {formData.imagen_url && (
                                            <div className="promocion-image">
                                                <img src={formData.imagen_file ? formData.imagen_url : getImageSrc(formData.imagen_url)} alt={formData.nombre} />
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
        </div>
    );
};

export default Promociones;
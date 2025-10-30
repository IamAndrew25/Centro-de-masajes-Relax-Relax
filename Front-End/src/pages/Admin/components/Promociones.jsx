import React, { useState } from 'react';
import Modal from './ui/Modal';

const Promociones = () => {
    const [promociones, setPromociones] = useState([
        {
            id: 1,
            nombre: 'Verano Relajante',
            descripcion: '20% de descuento en todos los masajes relajantes',
            imagen: 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Verano+Relajante',
            estado: 'Activa',
            tipoDescuento: 'Porcentaje',
            valorDescuento: 20,
            fechaInicio: '2025-06-01',
            fechaFin: '2025-08-31',
            usosActuales: 45,
            usosMaximos: 100,
            usosPorCliente: 1
        },
        {
            id: 2,
            nombre: 'Black Friday Spa',
            descripcion: '2x1 en experiencias spa completas',
            imagen: 'https://via.placeholder.com/300x200/e67e22/ffffff?text=Black+Friday',
            estado: 'Programada',
            tipoDescuento: '2x1',
            valorDescuento: 0,
            fechaInicio: '2025-11-24',
            fechaFin: '2025-11-26',
            usosActuales: 0,
            usosMaximos: 50,
            usosPorCliente: 1
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        imagen: '',
        estado: 'Activa',
        tipoDescuento: 'Porcentaje',
        valorDescuento: 0,
        serviciosAplicables: [],
        excluirServicios: [],
        fechaInicio: '',
        fechaFin: '',
        diasSemana: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        horarioInicio: '09:00',
        horarioFin: '20:00',
        usosMaximos: 100,
        usosPorCliente: 1,
        minimoCompra: 0,
        stockDisponible: 0,
        codigoCupon: '',
        mostrarHome: false,
        colorEtiqueta: '#f39c12',
        prioridad: 1
    });

    const [imagePreview, setImagePreview] = useState('');

    const serviciosDisponibles = [
        'Masaje Relajante',
        'Masaje Deportivo',
        'Masaje Terapéutico',
        'Reflexología',
        'Aromaterapia',
        'Piedras Calientes'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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

    const handleServiciosChange = (servicio) => {
        setFormData(prev => {
            const servicios = prev.serviciosAplicables.includes(servicio)
                ? prev.serviciosAplicables.filter(s => s !== servicio)
                : [...prev.serviciosAplicables, servicio];
            return { ...prev, serviciosAplicables: servicios };
        });
    };

    const handleNuevaPromocion = () => {
        setEditingPromo(null);
        setFormData({
            nombre: '',
            descripcion: '',
            imagen: '',
            estado: 'Activa',
            tipoDescuento: 'Porcentaje',
            valorDescuento: 0,
            serviciosAplicables: [],
            excluirServicios: [],
            fechaInicio: '',
            fechaFin: '',
            diasSemana: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            horarioInicio: '09:00',
            horarioFin: '20:00',
            usosMaximos: 100,
            usosPorCliente: 1,
            minimoCompra: 0,
            stockDisponible: 0,
            codigoCupon: '',
            mostrarHome: false,
            colorEtiqueta: '#f39c12',
            prioridad: 1
        });
        setImagePreview('');
        setShowModal(true);
    };

    const handleEditPromocion = (promo) => {
        setEditingPromo(promo);
        setFormData({
            nombre: promo.nombre || '',
            descripcion: promo.descripcion || '',
            imagen: promo.imagen || '',
            estado: promo.estado || 'Activa',
            tipoDescuento: promo.tipoDescuento || 'Porcentaje',
            valorDescuento: promo.valorDescuento || 0,
            serviciosAplicables: promo.serviciosAplicables || [],
            excluirServicios: promo.excluirServicios || [],
            fechaInicio: promo.fechaInicio || '',
            fechaFin: promo.fechaFin || '',
            diasSemana: promo.diasSemana || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            horarioInicio: promo.horarioInicio || '09:00',
            horarioFin: promo.horarioFin || '20:00',
            usosMaximos: promo.usosMaximos || 100,
            usosPorCliente: promo.usosPorCliente || 1,
            minimoCompra: promo.minimoCompra || 0,
            stockDisponible: promo.stockDisponible || 0,
            codigoCupon: promo.codigoCupon || '',
            mostrarHome: promo.mostrarHome || false,
            colorEtiqueta: promo.colorEtiqueta || '#f39c12',
            prioridad: promo.prioridad || 1
        });
        setImagePreview(promo.imagen || '');
        setShowModal(true);
    };

    const handleSavePromocion = () => {
        if (editingPromo) {
            setPromociones(promociones.map(p => 
                p.id === editingPromo.id ? { ...formData, id: p.id, usosActuales: p.usosActuales } : p
            ));
        } else {
            const newPromo = {
                ...formData,
                id: Date.now(),
                usosActuales: 0
            };
            setPromociones([...promociones, newPromo]);
        }
        setShowModal(false);
    };

    const handleDeletePromocion = (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta promoción?')) {
            setPromociones(promociones.filter(p => p.id !== id));
        }
    };

    const handleDuplicatePromocion = (promo) => {
        const duplicated = {
            ...promo,
            id: Date.now(),
            nombre: `${promo.nombre} (Copia)`,
            usosActuales: 0
        };
        setPromociones([...promociones, duplicated]);
    };

    return (
        <div className="promociones">
            <div className="section-header">
                <h2>🎉 Promociones</h2>
                <button className="btn-primary" onClick={handleNuevaPromocion}>
                    + Nueva Promoción
                </button>
            </div>

            <div className="promo-grid">
                {promociones.map(promo => (
                    <div key={promo.id} className="promo-card">
                        <div className="promo-image" style={{ backgroundImage: `url(${promo.imagen})` }}>
                            <span className={`promo-status status-${promo.estado.toLowerCase()}`}>
                                {promo.estado}
                            </span>
                        </div>
                        <div className="promo-content">
                            <h3>{promo.nombre}</h3>
                            <p>{promo.descripcion}</p>
                            
                            <div className="promo-details">
                                <div className="detail-item">
                                    <strong>Descuento:</strong> 
                                    {promo.tipoDescuento === 'Porcentaje' ? `${promo.valorDescuento}%` :
                                     promo.tipoDescuento === 'Monto fijo' ? `S/ ${promo.valorDescuento}` :
                                     promo.tipoDescuento}
                                </div>
                                <div className="detail-item">
                                    <strong>Vigencia:</strong> {promo.fechaInicio} a {promo.fechaFin}
                                </div>
                                <div className="detail-item">
                                    <strong>Usos:</strong> {promo.usosActuales} / {promo.usosMaximos}
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${(promo.usosActuales / promo.usosMaximos) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="promo-actions">
                                <button className="btn-edit" onClick={() => handleEditPromocion(promo)}>
                                    ✏️ Editar
                                </button>
                                <button className="btn-duplicate" onClick={() => handleDuplicatePromocion(promo)}>
                                    📋 Duplicar
                                </button>
                                <button className="btn-delete" onClick={() => handleDeletePromocion(promo.id)}>
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
                    title={editingPromo ? '✏️ Editar Promoción' : '🎉 Nueva Promoción'}
                >
                    <div className="modal-form">
                        {/* Información Básica */}
                        <div className="form-section">
                            <h3>📋 Información Básica</h3>
                            
                            <div className="form-group">
                                <label>Nombre de la Promoción *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Verano Relajante"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Descripción *</label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    placeholder="Describe la promoción..."
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Imagen / Banner</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                {imagePreview && (
                                    <div className="image-preview">
                                        <img src={imagePreview} alt="Preview" />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Estado</label>
                                <select name="estado" value={formData.estado} onChange={handleInputChange}>
                                    <option value="Activa">Activa</option>
                                    <option value="Inactiva">Inactiva</option>
                                    <option value="Programada">Programada</option>
                                </select>
                            </div>
                        </div>

                        {/* Detalles del Descuento */}
                        <div className="form-section">
                            <h3>💰 Detalles del Descuento</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tipo de Descuento</label>
                                    <select name="tipoDescuento" value={formData.tipoDescuento} onChange={handleInputChange}>
                                        <option value="Porcentaje">Porcentaje</option>
                                        <option value="Monto fijo">Monto Fijo</option>
                                        <option value="2x1">2x1</option>
                                        <option value="Combo">Combo</option>
                                    </select>
                                </div>

                                {(formData.tipoDescuento === 'Porcentaje' || formData.tipoDescuento === 'Monto fijo') && (
                                    <div className="form-group">
                                        <label>Valor del Descuento</label>
                                        <input
                                            type="number"
                                            name="valorDescuento"
                                            value={formData.valorDescuento}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Servicios Aplicables</label>
                                <div className="checkbox-group">
                                    {serviciosDisponibles.map(servicio => (
                                        <label key={servicio} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.serviciosAplicables.includes(servicio)}
                                                onChange={() => handleServiciosChange(servicio)}
                                            />
                                            {servicio}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Vigencia */}
                        <div className="form-section">
                            <h3>📅 Vigencia</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Fecha Inicio</label>
                                    <input
                                        type="date"
                                        name="fechaInicio"
                                        value={formData.fechaInicio}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fecha Fin</label>
                                    <input
                                        type="date"
                                        name="fechaFin"
                                        value={formData.fechaFin}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Horario Inicio</label>
                                    <input
                                        type="time"
                                        name="horarioInicio"
                                        value={formData.horarioInicio}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Horario Fin</label>
                                    <input
                                        type="time"
                                        name="horarioFin"
                                        value={formData.horarioFin}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Límites */}
                        <div className="form-section">
                            <h3>🔒 Límites</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Usos Máximos Totales</label>
                                    <input
                                        type="number"
                                        name="usosMaximos"
                                        value={formData.usosMaximos}
                                        onChange={handleInputChange}
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Usos por Cliente</label>
                                    <input
                                        type="number"
                                        name="usosPorCliente"
                                        value={formData.usosPorCliente}
                                        onChange={handleInputChange}
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Mínimo de Compra (S/)</label>
                                    <input
                                        type="number"
                                        name="minimoCompra"
                                        value={formData.minimoCompra}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Stock Disponible</label>
                                    <input
                                        type="number"
                                        name="stockDisponible"
                                        value={formData.stockDisponible}
                                        onChange={handleInputChange}
                                        min="0"
                                        placeholder="0 = ilimitado"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Código de Cupón (opcional)</label>
                                <input
                                    type="text"
                                    name="codigoCupon"
                                    value={formData.codigoCupon}
                                    onChange={handleInputChange}
                                    placeholder="Ej: VERANO2025"
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                            <button className="btn-save" onClick={handleSavePromocion}>
                                {editingPromo ? 'Actualizar' : 'Crear'} Promoción
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Promociones;

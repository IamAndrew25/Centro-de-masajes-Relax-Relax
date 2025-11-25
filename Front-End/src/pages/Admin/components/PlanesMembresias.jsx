import React, { useState, useEffect } from 'react';
import './PlanesMembresias.css';
import { getPlanes, createPlan, updatePlan, deletePlan } from './JS/planesMembresiasService';
import { toast } from 'react-toastify';

// Límites de caracteres max
const FIELD_MAX_LENGTHS = {
  nombre: 60,
  descripcion: 255,
  precio: 5,               // ej: 999.9
  icono: 10,                // emoji o texto corto
  servicios_incluidos: 1000,
  beneficios: 1000,
  duracion: 3               // hasta 999
};



const PlanesMembresias = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    tipo: 'plan',
    icono: '💠',
    servicios_incluidos: '',
    beneficios: '',
    destacado: false,
    duracion: 1,
    duracion_unidad: 'meses',
    estado: 'activo'
  });

  useEffect(() => {
    loadPlanes();
  }, []);

  const loadPlanes = async () => {
    setLoading(true);
    try {
      const data = await getPlanes();
      setPlanes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando planes:', err);
      toast.error('Error al cargar la lista de planes');
      setPlanes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este plan?')) return;
    setLoading(true);
    try {
      await deletePlan(id);
      await loadPlanes();
      toast.success('Plan eliminado exitosamente');
    } catch (err) {
      console.error('Error eliminando plan:', err);
      toast.error('No se pudo eliminar el plan.');
    } finally {
      setLoading(false);
    }
  };

  const buildFormFromPlan = (plan, overrides = {}) => {
    return {
        nombre: plan.nombre ?? plan.name ?? '',
        descripcion: plan.descripcion ?? plan.description ?? '',
        precio: plan.precio ?? plan.price ?? '',
        tipo: plan.tipo ?? 'plan',
        icono: plan.icono ?? '💠',

        servicios_incluidos:
          typeof plan.servicios_incluidos === 'string'
            ? JSON.parse(plan.servicios_incluidos)
            : plan.servicios_incluidos ?? [],

        beneficios:
          typeof plan.beneficios === 'string'
            ? JSON.parse(plan.beneficios)
            : plan.beneficios ?? [],

        destacado: typeof plan.destacado === 'boolean' ? plan.destacado : !!plan.destacado,
        duracion: plan.duracion ?? (plan.durationDays ? Math.round(plan.durationDays / 30) : 1),
        duracion_unidad: plan.duracion_unidad ?? 'meses',
        estado: plan.estado ?? 'activo',

        ...overrides
    };
};


  const toggleDestacado = async (plan) => {
    setLoading(true);
    try {
      const form = buildFormFromPlan(plan, { destacado: !plan.destacado });
      await updatePlan(plan.id, form);
      await loadPlanes();
    } catch (err) {
      console.error('Error actualizando destacado:', err);
      toast.error('No se pudo actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setEditingPlan(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      tipo: 'plan',
      icono: '💠',
      servicios_incluidos: '',
      beneficios: '',
      destacado: false,
      duracion: 1,
      duracion_unidad: 'meses',
      estado: 'activo'
    });
    setShowModal(true);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData(buildFormFromPlan(plan));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
  };

  
  // Input genérico con límite de caracteres y limpieza de números
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    // Limpiar campos numéricos
    if (name === 'precio') {
      // solo números y punto
      newValue = String(newValue).replace(/[^0-9.]/g, '');
    }
    if (name === 'duracion') {
      // solo números enteros
      newValue = String(newValue).replace(/[^0-9]/g, '');
    }

    const max = FIELD_MAX_LENGTHS[name];
    if (max && typeof newValue === 'string') {
      newValue = newValue.slice(0, max);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validación estricta para evitar error 400
    if (!formData.nombre || formData.nombre.trim().length === 0) {
      toast.warn("El nombre del plan es obligatorio");
      return;
    }
    if (formData.precio === '' || isNaN(Number(formData.precio))) {
      toast.warn("El precio es obligatorio y debe ser numérico");
      return;
    }

    // Convertir servicios y beneficios de texto → array válido
    const serviciosArray = Array.isArray(formData.servicios_incluidos)
      ? formData.servicios_incluidos
      : (formData.servicios_incluidos || "")
          .split("\n")
          .map(s => s.trim())
          .filter(Boolean);

    const beneficiosArray = Array.isArray(formData.beneficios)
      ? formData.beneficios
      : (formData.beneficios || "")
          .split("\n")
          .map(s => s.trim())
          .filter(Boolean);

    setLoading(true);
    try {
      let icono = formData.icono || '💠';

      // Iconos automáticos según nombre
      const lower = formData.nombre.toLowerCase();
      if (lower.includes('3 meses')) icono = '📅';
      if (lower.includes('6 meses')) icono = '💎';
      if (lower.includes('año')) icono = '👑';

      const planData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion || formData.nombre,

        tipo: formData.tipo,
        precio: Number(formData.precio),
        icono: icono,

        servicios_incluidos: serviciosArray,
        beneficios: beneficiosArray,

        destacado: Boolean(formData.destacado),
        estado: formData.estado || 'activo',

        duracion: Number(formData.duracion) || 1,
        duracion_unidad: formData.duracion_unidad
      };

      if (editingPlan) {
        await updatePlan(editingPlan.id, planData);
        toast.success(' Plan actualizado exitosamente');
      } else {
        await createPlan(planData);
        toast.success(' Plan creado exitosamente');
      }

      handleCloseModal();
      await loadPlanes();

    } catch (err) {
      console.error('Error guardando plan:', err);

      let errorMsg = "Error desconocido";
      if (err.response && err.response.data) {
        console.log("ERROR DEL BACKEND:", err.response.data);
        errorMsg = JSON.stringify(err.response.data);
      }
      toast.error(`❌ No se pudo guardar: ${errorMsg}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#111827' }}>💎 Planes y Membresías</h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6b7280' }}>Gestiona los planes y membresías disponibles para tus clientes</p>
        </div>
        <button 
          className="btn-agregar-plan"
          onClick={handleOpenModal}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Agregar Nuevo Plan
        </button>
      </div>

      {planes.length === 0 && !loading ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '12px',
          border: '2px dashed #e5e7eb'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>No hay planes disponibles</h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Comienza agregando tu primer plan o membresía</p>
          <button 
            onClick={handleOpenModal}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Crear Primer Plan
          </button>
        </div>
      ) : (
        <div className="planes-grid-vertical">
          {planes.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card-vertical ${plan.destacado ? 'destacado' : ''} ${plan.tipo === 'vip' ? 'vip' : ''}`}
            >
              {plan.destacado && (
                <span className="plan-badge-destacado">⭐ Destacado</span>
              )}
              
              <div className="plan-icon-wrapper">
                <span className="plan-icon">{plan.icono || '💠'}</span>
                <h3 className="plan-title">{plan.nombre}</h3>
              </div>
              
              <div className="plan-price">
                <span className="price-amount">
                  S/ {plan.precio} 
                  {plan.duracion && plan.duracion_unidad ? (
                    ` / ${plan.duracion} ${
                      plan.duracion === 1 
                        ? plan.duracion_unidad.replace("es","")   // mes / día
                        : plan.duracion_unidad                    // meses / días
                    }`
                  ) : ""}
                </span>
              </div>
              <div className="plan-benefits">
                <h4 className="benefits-title">Servicios Incluidos:</h4>
                <ul className="benefits-list">
                  {(plan.servicios_incluidos || []).map((servicio, i) => (
                    <li key={i}>
                      <span className="checkmark">✓</span>
                      {servicio}
                    </li>
                  ))}
                </ul>
                
                {plan.beneficios && plan.beneficios.length > 0 && (
                  <>
                    <h4 className="benefits-title">Beneficios:</h4>
                    <ul className="benefits-list">
                      {plan.beneficios.map((beneficio, i) => (
                        <li key={i}>
                          <span className="checkmark">✓</span>
                          {beneficio}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="plan-actions">
                <button 
                  className="btn-action btn-edit" 
                  title="Editar plan" 
                  onClick={() => handleEdit(plan)}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn-action btn-delete" 
                  title="Eliminar plan" 
                  onClick={() => handleDelete(plan.id)}
                >
                  🗑️ Eliminar
                </button>
                <button 
                  className="btn-action btn-destacar" 
                  title={plan.destacado ? "Quitar destacado" : "Destacar plan"} 
                  onClick={() => toggleDestacado(plan)}
                >
                  {plan.destacado ? '★ Destacado' : '☆ Destacar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Modal para agregar/editar plan */}
      {showModal && (
        <div className="modal-overlay-plan" onClick={handleCloseModal}>
          <div className="modal-content-plan" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-plan">
              <h2>{editingPlan ? '✏️ Editar Plan' : '✨ Crear Nuevo Plan'}</h2>
              <button className="btn-close-modal" onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form-plan">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre del Plan *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Plan Premium"
                    required
                    maxLength={FIELD_MAX_LENGTHS.nombre}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="precio">Precio (S/) *</label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    placeholder="99"
                    min="0"
                    step="0.01"
                    required
                    maxLength={FIELD_MAX_LENGTHS.precio}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción (opcional)</label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Breve descripción"
                  maxLength={FIELD_MAX_LENGTHS.descripcion}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tipo">Tipo de Plan</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                >
                  <option value="plan">Plan</option>
                  <option value="membresia">Membresía</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="icono">Icono</label>
                  <input
                    type="text"
                    id="icono"
                    name="icono"
                    value={formData.icono}
                    onChange={handleInputChange}
                    placeholder="Ej: 💎"
                    maxLength={FIELD_MAX_LENGTHS.icono}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="estado">Estado</label>
                  <select id="estado" name="estado" value={formData.estado} onChange={handleInputChange}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="servicios_incluidos">Servicios Incluidos (uno por línea)</label>
                <textarea
                  id="servicios_incluidos"
                  name="servicios_incluidos"
                  value={formData.servicios_incluidos}
                  onChange={handleInputChange}
                  placeholder="Masaje relajante 60min&#10;Aromaterapia&#10;Música ambiente"
                  rows="4"
                  maxLength={FIELD_MAX_LENGTHS.servicios_incluidos}
                />
              </div>

              <div className="form-group">
                <label htmlFor="beneficios">Beneficios (uno por línea)</label>
                <textarea
                  id="beneficios"
                  name="beneficios"
                  value={formData.beneficios}
                  onChange={handleInputChange}
                  placeholder="5% descuento&#10;Toalla gratis&#10;Bebidas incluidas"
                  rows="4"
                  maxLength={FIELD_MAX_LENGTHS.beneficios}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="duracion">Duración (cantidad)</label>
                  <input
                    type="number"
                    id="duracion"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleInputChange}
                    min="1"
                    maxLength={FIELD_MAX_LENGTHS.duracion}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duracion_unidad">Unidad</label>
                  <select
                    id="duracion_unidad"
                    name="duracion_unidad"
                    value={formData.duracion_unidad}
                    onChange={handleInputChange}
                  >
                    <option value="meses">Meses</option>
                    <option value="dias">Días</option>
                  </select>
                </div>
              </div>

              <div className="form-group-checkbox">
                <input
                  type="checkbox"
                  id="destacado"
                  name="destacado"
                  checked={formData.destacado}
                  onChange={handleInputChange}
                />
                <label htmlFor="destacado">Marcar como plan destacado</label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {editingPlan ? 'Actualizar Plan' : 'Crear Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanesMembresias;
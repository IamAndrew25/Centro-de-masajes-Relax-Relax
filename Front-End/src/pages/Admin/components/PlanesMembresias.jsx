import React, { useState, useEffect } from 'react';
import './PlanesMembresias.css';
import { getPlanes, createPlan, updatePlan, deletePlan } from './JS/planesMembresiasService';

const PlanesMembresias = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    tipo: 'plan',
    icono: '💠',
    servicios_incluidos: '',
    beneficios: '',
    destacado: false
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
      alert('Plan eliminado exitosamente');
    } catch (err) {
      console.error('Error eliminando plan:', err);
      alert('No se pudo eliminar el plan.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDestacado = async (plan) => {
    setLoading(true);
    try {
      await updatePlan(plan.id, { ...plan, destacado: !plan.destacado });
      await loadPlanes();
    } catch (err) {
      console.error('Error actualizando destacado:', err);
      alert('No se pudo actualizar.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setEditingPlan(null);
    setFormData({
      nombre: '',
      precio: '',
      tipo: 'plan',
      icono: '💠',
      servicios_incluidos: '',
      beneficios: '',
      destacado: false
    });
    setShowModal(true);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      nombre: plan.nombre || '',
      precio: plan.precio || '',
      tipo: plan.tipo || 'plan',
      icono: plan.icono || '💠',
      servicios_incluidos: Array.isArray(plan.servicios_incluidos) 
        ? plan.servicios_incluidos.join('\n') 
        : '',
      beneficios: Array.isArray(plan.beneficios) 
        ? plan.beneficios.join('\n') 
        : '',
      destacado: plan.destacado || false
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.precio) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const planData = {
        nombre: formData.nombre,
        descripcion: formData.nombre, // Usar el nombre como descripción por defecto
        tipo: formData.tipo,
        precio: parseFloat(formData.precio),
        icono: formData.icono,
        servicios_incluidos: formData.servicios_incluidos.split('\n').filter(s => s.trim()),
        beneficios: formData.beneficios.split('\n').filter(b => b.trim()),
        destacado: formData.destacado,
        estado: 'activo',
        duracion: 1,
        duracion_unidad: 'meses'
      };
      
      if (editingPlan) {
        // Actualizar plan existente
        await updatePlan(editingPlan.id, planData);
        alert('✅ Plan actualizado exitosamente');
      } else {
        // Crear nuevo plan
        await createPlan(planData);
        alert('✅ Plan creado exitosamente');
      }
      
      handleCloseModal();
      await loadPlanes();
    } catch (err) {
      console.error('Error guardando plan:', err);
      alert('❌ Error al guardar el plan: ' + err.message);
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
        <div className="planes-grid-horizontal">
          {planes.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card-horizontal ${plan.destacado ? 'destacado' : ''}`}
          >
            <div
              className="plan-header-horizontal"
              style={{ background: plan.color || undefined }}
            >
              <div className="plan-header-top">
                <span className="plan-icono-horizontal">{plan.icono || '💠'}</span>
                <span className="plan-title-horizontal">{plan.nombre}</span>
                {plan.destacado && (
                  <span className="plan-badge-horizontal">MÁS POPULAR</span>
                )}
              </div>
              <button className="plan-type-btn">{plan.tipo === 'membresia' ? 'MEMBRESÍA' : 'PLAN'}</button>
            </div>

            <div className="plan-precio-horizontal">
              <span className="precio-valor-horizontal">
                S/ {plan.precio}
              </span>
              <span className="precio-periodo-horizontal">/mes</span>
            </div>

            <div className="plan-features-horizontal">
              <div className="plan-servicios-horizontal">
                <div className="features-title">SERVICIOS</div>
                <ul>
                  {(plan.servicios_incluidos || []).slice(0, 5).map((s, i) => (
                    <li key={i} title={s}>
                      <span className="check">✓</span>
                      <span className="feature-text">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="plan-beneficios-horizontal">
                <div className="features-title">BENEFICIOS</div>
                <ul>
                  {(plan.beneficios || []).slice(0, 4).map((b, i) => (
                    <li key={i} title={b}>
                      <span className="star">⭐</span>
                      <span className="feature-text">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="plan-actions-horizontal">
              <div className="admin-actions-horizontal">
                <button 
                  className="btn-icon-horizontal btn-edit-horizontal" 
                  title="Editar plan" 
                  onClick={() => handleEdit(plan)}
                >
                  ✏️
                </button>
                <button 
                  className="btn-icon-horizontal btn-delete-horizontal" 
                  title="Eliminar plan" 
                  onClick={() => handleDelete(plan.id)}
                >
                  🗑️
                </button>
                <button 
                  className="btn-icon-horizontal" 
                  title={plan.destacado ? "Quitar destacado" : "Destacar plan"} 
                  onClick={() => toggleDestacado(plan)}
                >
                  {plan.destacado ? '★' : '☆'}
                </button>
              </div>
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
                  />
                </div>
              </div>

              <div className="form-row">
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
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="icono">Ícono</label>
                  <select
                    id="icono"
                    name="icono"
                    value={formData.icono}
                    onChange={handleInputChange}
                  >
                    <option value="💠">💠 Diamante</option>
                    <option value="⭐">⭐ Estrella</option>
                    <option value="👑">👑 Corona</option>
                    <option value="💎">💎 Gema</option>
                    <option value="🌟">🌟 Estrella Brillante</option>
                    <option value="✨">✨ Destellos</option>
                    <option value="🎯">🎯 Objetivo</option>
                    <option value="🏆">🏆 Trofeo</option>
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
                ></textarea>
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
                ></textarea>
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

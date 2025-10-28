import React, { useState, useEffect } from 'react';
import { SectionHeader } from './ui/Card';
import { Modal } from './ui/Modal';
import { FormInput, FormTextarea, FormRow } from './ui/Form';
import { getAllServices, createService, updateService,
   deleteService,enviarExcelServicios,descargarExcelServicios } from './JS/serviceService';

const Servicios = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: '',
    durationMin: '',
    baseprice: '',
    description: ''
  });

  // ✅ Cargar servicios al inicio
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error('Error cargando servicios:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNewService = () => {
    setForm({ id: null, name: '', durationMin: '', baseprice: '', description: '' });
    setShowModal(true);
  };

  const handleSaveService = async () => {
    try {
      if (!form.name || !form.durationMin || !form.baseprice) {
        alert('Nombre, duración y precio son obligatorios.');
        return;
      }

      if (form.id) {
        await updateService(form.id, form);
      } else {
        await createService(form);
      }

      setShowModal(false);
      fetchServices();
    } catch (error) {
      console.error('Error guardando servicio:', error);
      alert('Error al guardar el servicio. Revisa la consola.');
    }
  };

  const handleEditService = (service) => {
    setForm(service);
    setShowModal(true);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este servicio?')) return;
    try {
      await deleteService(id);
      fetchServices();
    } catch (error) {
      console.error('Error eliminando servicio:', error);
      alert('No se pudo eliminar el servicio. Revisa la consola.');
    }
  };

  return (
    <>
      <div className="servicios">
        <SectionHeader
          title="💆‍♀️ Gestión de Servicios"
          buttonText="➕ Nuevo Servicio"
          onButtonClick={handleNewService}
        />
        <button 
                        style={{ height: '40px', marginLeft: '10px' }} 
                        onClick={descargarExcelServicios} 
                        >
                        ⬇️ Descargar Excel
                        </button>
                    <button 
                        style={{ height: '40px', marginLeft: '10px' }} 
                        onClick={enviarExcelServicios} 
                        >
                        📊 Reporte Excel
                        </button> 

        <div className="services-grid">
          {services.length === 0 ? (
            <p>No hay servicios registrados.</p>
            ) : (
            services.map(servicio => (
                <div key={servicio.id} className="service-card">
                <h3>{servicio.name}</h3>
                <p className="duration">⏱️ {servicio.durationMin} min</p>
                <p className="price">💰 S/ {servicio.baseprice}</p>
                <p className="description">{servicio.description}</p>
                <div className="service-actions">
                    <button
                    className="btn-edit"
                    onClick={() => handleEditService(servicio)}
                    >
                    ✏️ Editar
                    </button>
                    <button
                    className="btn-delete"
                    onClick={() => handleDeleteService(servicio.id)}
                    >
                    🗑️ Eliminar
                    </button>
                </div>
                </div>
            ))
            )}

        </div>
      </div>

      {/* ✅ Modal de Crear/Editar Servicio */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={form.id ? "✏️ Editar Servicio" : "➕ Nuevo Servicio"}
        onSave={handleSaveService}
        saveButtonText="💾 Guardar Servicio"
      >
        <div className="service-form">
          <FormInput
            label="💆‍♀️ Nombre del Servicio"
            value={form.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Ej: Masaje Sueco"
            required
          />
          <FormRow>
            <FormInput
              type="number"
              label="⏱️ Duración (minutos)"
              value={form.durationMin}
              onChange={(e) => handleInputChange('durationMin', e.target.value)}
              min="15"
              max="300"
              required
            />
            <FormInput
              type="number"
              label="💰 Precio (Soles)"
              value={form.baseprice}
              onChange={(e) => handleInputChange('baseprice', e.target.value)}
              step="10"
              required
            />
          </FormRow>
          <FormTextarea
            label="📝 Descripción"
            value={form.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
          />
        </div>
      </Modal>
    </>
  );
};

export default Servicios;

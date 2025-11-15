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
      if (!form.name || !form.durationMin || !form.baseprice || !form.description) {
        alert('Nombre, duración, precio y descripción son obligatorios.');
        return;
      }

      const servicePayload = {
        ...form,
        durationMin: parseInt(form.durationMin, 10),
        baseprice: parseFloat(form.baseprice)
      };

      if (form.id) {
        await updateService(form.id, servicePayload);
      } else {
        await createService(servicePayload);
      }

      setShowModal(false);
      fetchServices();
    } catch (error) {
      console.error('Error guardando servicio:', error);
      let errorMsg = 'Error al guardar el servicio. Revisa la consola.';
      if (error.response && error.response.data) {
        console.log("Detalles del error del backend:", error.response.data);
      }
      alert(errorMsg);
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
            onChange={(e) => {
              // Solo letras y espacios
              const soloLetras = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
              handleInputChange('name', soloLetras);
            }}
            placeholder="Ej: Masaje Sueco"
            required
          />
          <FormRow>
            <FormInput
              type="number"
              label="⏱️ Duración (minutos)"
              value={form.durationMin}
              onChange={(e) => {
                //no jala no se porque xd
                const soloNumeros = e.target.value.replace(/[^0-9.]/g, '');
                handleInputChange('durationMin', soloNumeros);
              }}
              min="15"
              max="300"
              required
            />
            <FormInput
              type="text"
              label="💰 Precio (Soles)"
              value={form.baseprice}
              onChange={(e) => {
                //numeros como 5.5 50
                const soloNumerosYPunto = e.target.value.replace(/[^0-9.]/g, '');
                handleInputChange('baseprice', soloNumerosYPunto);
              }}
              placeholder="Ej: 50 o 50.5"
              required
            />
          </FormRow>
          <FormTextarea
            label="📝 Descripción"
            value={form.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            required
          />
        </div>
      </Modal>
    </>
  );
};

export default Servicios;
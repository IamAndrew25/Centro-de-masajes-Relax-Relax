import React, { useState, useEffect } from 'react';
import { SectionHeader } from './ui/Card';
import { Modal } from './ui/Modal';
import { FormInput, FormSelect, FormRow } from './ui/Form';
import {
  getAllAppointments,
  getAllServices,
  getAllClients,
  getAllWorkers,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  enviarExcelReservas,
  descargarExcelReservas
} from './JS/reservaService';

const Reservas = () => {
  const tableHeaders = ["Cliente", "Servicio", "Fecha", "Hora", "Estado", "Acciones"];

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    clienteId: null,
    workerId: null,
    servicioId: null,
    fecha: '',
    hora: '',
    estado: 'PENDING'
  });
  const [reservas, setReservas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointments, services, clients, workers] = await Promise.all([
        getAllAppointments(),
        getAllServices(),
        getAllClients(),
        getAllWorkers()
      ]);

      console.log(" getAllAppointments devolvió:", appointments);

      setReservas(Array.isArray(appointments) ? appointments : []);
      setServicios(Array.isArray(services) ? services : []);
      setClientes(Array.isArray(clients) ? clients : []);
      setTrabajadores(Array.isArray(workers) ? workers : []);
    } catch (error) {
      console.error(" Error cargando datos:", error);
      setReservas([]);
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (!form.clienteId || !form.servicioId || !form.fecha || !form.hora || !form.workerId) {
        alert("Completa todos los campos obligatorios.");
        return;
      }

      const start = new Date(`${form.fecha}T${form.hora}`);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      if (isNaN(start.getTime())) {
        alert("Fecha u hora inválida.");
        return;
      }

      const appointmentData = {
        userId: form.clienteId,
        workerId: form.workerId,
        serviceId: form.servicioId,
        appointmentStart: start.toISOString(),
        appointmentEnd: end.toISOString(),
        status: form.estado,
        notes: form.notas || ""
      };

      console.log(' Datos enviados a la API:', appointmentData);

      if (form.id) {
        await updateAppointment(form.id, appointmentData);
      } else {
        await createAppointment(appointmentData);
      }

      await fetchData();

      setShowModal(false);
      setForm({
        id: null,
        clienteId: null,
        workerId: null,
        servicioId: null,
        fecha: '',
        hora: '',
        estado: 'PENDING'
      });

    } catch (error) {
      console.error(' Error guardando la reserva:', error.response?.data || error);
      alert('Error guardando la reserva. Revisa la consola.');
    }
  };

  const handleEdit = (reserva) => {
    const fecha = reserva.appointmentStart ? new Date(reserva.appointmentStart) : null;
    setForm({
      id: reserva.id,
      clienteId: reserva.user?.id || null,
      workerId: reserva.worker?.id || null,
      servicioId: reserva.service?.id || null,
      fecha: fecha ? fecha.toISOString().slice(0, 10) : '',
      hora: fecha ? fecha.toTimeString().slice(0, 5) : '',
      estado: reserva.status || 'PENDING'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta reserva?")) return;
    try {
      await deleteAppointment(id);
      await fetchData();
    } catch (error) {
      console.error(' Error eliminando la reserva:', error);
      alert('No se pudo eliminar la reserva. Revisa la consola.');
    }
  };

  return (
    <div className="reservas">
      <SectionHeader title="Gestión de Reservas" buttonText="Nueva Reserva" onButtonClick={() => setShowModal(true)} />
      
      <button style={{ height: '40px', marginLeft: '10px' }} onClick={descargarExcelReservas}>
        ⬇️ Descargar Excel
      </button>
      <button style={{ height: '40px', marginLeft: '10px' }} onClick={enviarExcelReservas}>
        📊 Reporte Excel
      </button>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              {tableHeaders.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservas.map(reserva => {
              const fecha = reserva.appointmentStart ? new Date(reserva.appointmentStart) : null;
              return (
                <tr key={reserva.id}>
                  <td>{reserva.user?.username || "Sin cliente"}</td>
                  <td>{reserva.service?.name || "Sin servicio"}</td>
                  <td>{fecha ? fecha.toLocaleDateString() : "Sin fecha"}</td>
                  <td>{fecha ? fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}</td>
                  <td>
                    <span className={`status ${reserva.status?.toLowerCase() || "desconocido"}`}>
                      {reserva.status || "Sin estado"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-small">
                      <button className="btn-edit" onClick={() => handleEdit(reserva)}>✏️</button>
                      <button className="btn-delete" onClick={() => handleDelete(reserva.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={form.id ? "✏️ Editar Reserva" : "➕ Nueva Reserva"}
        onSave={handleSave}
        saveButtonText="💾 Guardar Reserva"
      >
        <div className="reserva-form">
          <FormRow>
            <FormSelect
              label="Cliente"
              value={form.clienteId || ''}
              onChange={e => handleInputChange('clienteId', parseInt(e.target.value))}
              options={clientes.map(c => ({ value: c.id, label: c.username }))}
              defaultOption="Seleccionar cliente"
              required
            />
            <FormSelect
              label="Servicio"
              value={form.servicioId || ''}
              onChange={e => handleInputChange('servicioId', parseInt(e.target.value))}
              options={servicios.map(s => ({ value: s.id, label: s.name }))}
              defaultOption="Seleccionar servicio"
              required
            />
            <FormSelect
              label="Trabajador"
              value={form.workerId || ''}
              onChange={e => handleInputChange('workerId', parseInt(e.target.value))}
              options={trabajadores.map(t => ({ value: t.id, label: t.username }))}
              defaultOption="Seleccionar trabajador"
              required
            />
          </FormRow>
          <FormRow>
            <FormInput
              type="date"
              label="Fecha"
              value={form.fecha}
              onChange={e => handleInputChange('fecha', e.target.value)}
              required
            />
            <FormInput
              type="time"
              label="Hora"
              value={form.hora}
              onChange={e => handleInputChange('hora', e.target.value)}
              required
            />
          </FormRow>
          <FormSelect
            label="Estado"
            value={form.estado}
            onChange={e => handleInputChange('estado', e.target.value)}
            options={[
              { value: 'PENDING', label: 'Pendiente' },
              { value: 'CONFIRMED', label: 'Confirmada' }
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Reservas;

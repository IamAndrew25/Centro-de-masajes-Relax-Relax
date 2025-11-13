import React, { useState, useEffect } from 'react';
import { SectionHeader } from './ui/Card';
import { Modal } from './ui/Modal';
import { FormInput, FormSelect, FormRow, FormTextarea } from './ui/Form';
import { 
  getAllWorkers, 
  createWorker, 
  updateWorker, 
  deleteWorker, 
  saveWorkerAvailability,
  enviarExcelTrabajadores,
  descargarExcelTrabajadores
} from './JS/workerService';

const TRABAJADORES_ESTADOS = [
  { value: "ACTIVO", label: "Activo" },
  { value: "VACACIONES", label: "Vacaciones" },
  { value: "LICENCIA", label: "Licencia" },
  { value: "INACTIVO", label: "Inactivo" }
];

const DIAS_SEMANA = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

const Trabajadores = () => {
  const [workers, setWorkers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    username: '',
    email: '',
    phone: '',
    dni: '',
    estado: 'ACTIVO',
    notas: '',
    password: '',
    especialidad: '',
    experiencia: '',
    availability: DIAS_SEMANA.map(day => ({
      day,
      activo: false,
      inicio: '',
      fin: ''
    }))
  });

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const data = await getAllWorkers();
      setWorkers(data);
    } catch (error) {
      console.error('Error cargando trabajadores:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    setForm(prev => {
      const newAvailability = [...prev.availability];
      newAvailability[index] = { ...newAvailability[index], [field]: value };
      return { ...prev, availability: newAvailability };
    });
  };

  const handleSave = async () => {
    try {
      if (!form.username || !form.email || !form.phone || !form.dni) {
        alert("Nombre, Email, Teléfono y DNI son obligatorios.");
        return;
      }

      const now = new Date().toISOString();
      const payload = {
        username: form.username,
        email: form.email,
        phone: form.phone,
        dni: form.dni,
        estado: form.estado || 'ACTIVO',
        notas: form.notas || '',
        password: form.password || '123456789',
        enabled: true,
        role: { id: 3 }, // Worker
        especialidad: form.especialidad || '',
        experiencia: form.experiencia || '',
        created_at: now,
        updated_at: now
      };

      let savedWorker;
      if (form.id) {
        savedWorker = await updateWorker(form.id, payload);
      } else {
        if (!form.password) {
          alert('Contraseña es obligatoria para nuevo trabajador.');
          return;
        }
        savedWorker = await createWorker(payload);
      }

      // Filtramos los días activos antes de guardar
      const activeAvailability = form.availability
        .filter(a => a.activo && a.inicio && a.fin)
        .map(a => ({
          day: a.day,
          inicio: a.inicio,
          fin: a.fin
        }));

      if (activeAvailability.length > 0) {
        await saveWorkerAvailability(savedWorker.id || form.id, activeAvailability);
      }

      alert("Trabajador y disponibilidad guardados correctamente xdd");
      setShowModal(false);
      setForm({
        id: null,
        username: '',
        email: '',
        phone: '',
        dni: '',
        estado: 'ACTIVO',
        notas: '',
        password: '',
        especialidad: '',
        experiencia: '',
        availability: DIAS_SEMANA.map(day => ({
          day,
          activo: false,
          inicio: '',
          fin: ''
        }))
      });
      fetchWorkers();
    } catch (error) {
      console.error('Error guardando trabajador:', error.response?.data || error);
      alert('Error guardando trabajador. Revisa la consola.');
    }
  };

  const handleEdit = (worker) => {
    setForm({
      id: worker.id || null,
      username: worker.username || '',
      email: worker.email || '',
      phone: worker.phone || '',
      dni: worker.dni || '',
      estado: worker.estado || 'ACTIVO',
      notas: worker.notas || '',
      password: '',
      especialidad: worker.especialidad || '',
      experiencia: worker.experiencia || '',
      availability: DIAS_SEMANA.map(day => ({
        day,
        activo: worker.availability?.some(a => a.day === day) || false,
        inicio: worker.availability?.find(a => a.day === day)?.inicio || '',
        fin: worker.availability?.find(a => a.day === day)?.fin || ''
      }))
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este trabajador?")) return;
    try {
      await deleteWorker(id);
      fetchWorkers();
    } catch (error) {
      console.error('Error eliminando trabajador:', error);
      alert('No se pudo eliminar. Revisa la consola.');
    }
  };

  const WorkerAvailability = ({ availability }) => {
    if (!Array.isArray(availability)) return <p>🕒 Sin horarios registrados</p>;
    if (!availability.length) return <p>🕒 Sin horarios registrados</p>;

    return (
      <div className="availability-list">
        <h5>🗓️ Disponibilidad:</h5>
        <ul>
          {availability.map((slot, index) => (
            <li key={index}>
              {slot.day}: {slot.inicio} - {slot.fin}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="trabajadores">
        
      <SectionHeader 
        title="Gestión de Trabajadores"      
        buttonText="Nuevo Trabajador" 
        onButtonClick={() => setShowModal(true)} 
      />
<button 
    style={{ height: '40px', marginLeft: '10px' }} 
    onClick={enviarExcelTrabajadores} 
  >
    📊 Reporte Excel
  </button>
  <button 
    style={{ height: '40px', marginLeft: '10px' }} 
    onClick={descargarExcelTrabajadores} 
  >
    ⬇️ Descargar Excel
  </button>
      <div className="workers-grid">
        {workers.map(worker => (
          <div key={worker.id} className="worker-card">
            <div className="worker-info">
              <h4>{worker.username || '—'}</h4>
              <p>📞 {worker.phone || '—'}</p>
              <p>📧 {worker.email || '—'}</p>
              <p>DNI: {worker.dni || '—'}</p>
              <p>💼 Especialidad: {worker.especialidad || '—'}</p>
              <p>📅 Experiencia: {worker.experiencia ? `${worker.experiencia} años` : '—'}</p>
              <p className={`status ${worker.estado?.toLowerCase() || 'pendiente'}`}>
                📊 Estado: {worker.estado || 'Pendiente'}
              </p>
              <WorkerAvailability availability={worker.availability} />
            </div>
            <div className="worker-actions">
              <button onClick={() => handleEdit(worker)}>✏️ Editar</button>
              <button onClick={() => handleDelete(worker.id)}>🗑️ Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={form.id ? "Editar Trabajador" : "Nuevo Trabajador"}
        onSave={handleSave}
        saveButtonText="💾 Guardar"
      >
        <div className="worker-form">
          <FormRow>
            <FormInput label="Nombre"
             value={form.username} 
             onChange={(e) => {
             const soloLetras = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');   
             handleInputChange('username', soloLetras)
             }} 
             required />
            <FormInput label="Teléfono" 
            value={form.phone} 
            onChange={(e) =>{
                const soloNumeros = e.target.value.replace(/[^0-9.]/g, '');    
                handleInputChange('phone', soloNumeros)
            }} 
            required />
          </FormRow>

          <FormRow>
            <FormInput label="DNI" 
            value={form.dni} 
            onChange={(e) =>{ 
            const soloNumeros = e.target.value.replace(/[^0-9]/g, '');          
            handleInputChange('dni', soloNumeros)
        }} 
            required />
            <FormInput label="Email" type="email" value={form.email} onChange={e => handleInputChange('email', e.target.value)} required />
          </FormRow>

          <FormRow>
            <FormSelect label="Estado" value={form.estado} onChange={e => handleInputChange('estado', e.target.value)} options={TRABAJADORES_ESTADOS} />
          </FormRow>

          {!form.id && (
            <FormRow>
              <FormInput label="Contraseña" type="password" value={form.password} onChange={e => handleInputChange('password', e.target.value)} required />
            </FormRow>
          )}

          <FormRow>
            <FormInput label="Especialidad" 
            value={form.especialidad} 
            onChange={(e) => {
            const soloLetras = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
            handleInputChange('especialidad', soloLetras)
            }} 
            required/>
            <FormInput label="Experiencia (años)" 
            value={form.experiencia} 
            onChange={(e) => {
            const soloNumeros = e.target.value.replace(/[^0-9.]/g, '');    
            handleInputChange('experiencia', soloNumeros)
            }} 
            required/>
          </FormRow>

          <FormTextarea label="Notas" value={form.notas} onChange={e => handleInputChange('notas', e.target.value)} />

          <h4 style={{ color: 'black' }}>🗓️ Disponibilidad Semanal</h4>
          <div className="availability-section">
            {form.availability.map((a, i) => (
              <div key={i} className="availability-row">
                <label style={{ width: '100px' , color: 'black' }}>{a.day}</label>
                <input
                  type="checkbox"
                  checked={a.activo}
                  onChange={(e) => handleAvailabilityChange(i, 'activo', e.target.checked)}
                  
                />
                <input
                  type="time"
                  value={a.inicio}
                  onChange={(e) => handleAvailabilityChange(i, 'inicio', e.target.value)}
                  disabled={!a.activo}
                />
                <input
                  type="time"
                  value={a.fin}
                  onChange={(e) => handleAvailabilityChange(i, 'fin', e.target.value)}
                  disabled={!a.activo}
                />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Trabajadores;
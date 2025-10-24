import React from 'react';
import { SectionHeader } from './ui/Card';
import { Modal } from './ui/Modal';
import { FormInput, FormSelect, FormTextarea, FormRow } from './ui/Form';

// Datos de ejemplo para trabajadores
const TRABAJADORES_DATA = [
    { 
        id: 1, 
        nombre: "🧑‍⚕️ Dr. Ana Martínez", 
        telefono: "+1 (555) 111-2222", 
        email: "ana.martinez@relaxtotal.com", 
        especialidad: "Masaje Terapéutico", 
        experiencia: "5 años",
        estado: "Activo"
    },
    { 
        id: 2, 
        nombre: "🧑‍⚕️ Carlos Rivera", 
        telefono: "+1 (555) 333-4444", 
        email: "carlos.rivera@relaxtotal.com", 
        especialidad: "Masaje Deportivo", 
        experiencia: "3 años",
        estado: "Activo"
    },
    { 
        id: 3, 
        nombre: "🧑‍⚕️ Sofía López", 
        telefono: "+1 (555) 555-6666", 
        email: "sofia.lopez@relaxtotal.com", 
        especialidad: "Masaje Relajante", 
        experiencia: "7 años",
        estado: "Vacaciones"
    },
    { 
        id: 4, 
        nombre: "🧑‍⚕️ Miguel Torres", 
        telefono: "+1 (555) 777-8888", 
        email: "miguel.torres@relaxtotal.com", 
        especialidad: "Masaje con Piedras", 
        experiencia: "4 años",
        estado: "Activo"
    }
];

// Opciones para formularios de trabajadores
const TRABAJADORES_FORM_OPTIONS = {
    especialidades: [
        { value: "relajante", label: "Masaje Relajante" },
        { value: "deportivo", label: "Masaje Deportivo" },
        { value: "terapeutico", label: "Masaje Terapéutico" },
        { value: "piedras", label: "Masaje con Piedras Calientes" },
        { value: "reflexologia", label: "Reflexología" },
        { value: "aromaterapia", label: "Aromaterapia" }
    ],
    horarios: [
        { value: "tiempo-completo", label: "Tiempo Completo" },
        { value: "medio-tiempo", label: "Medio Tiempo" },
        { value: "por-horas", label: "Por Horas" },
        { value: "fines-semana", label: "Solo Fines de Semana" }
    ],
    estados: [
        { value: "activo", label: "Activo" },
        { value: "vacaciones", label: "En Vacaciones" },
        { value: "licencia", label: "En Licencia" },
        { value: "inactivo", label: "Inactivo" }
    ]
};

const Trabajadores = ({ 
    handleNewWorker, 
    showNewWorkerModal, 
    setShowNewWorkerModal, 
    newWorkerData, 
    handleWorkerInputChange, 
    handleSaveWorker,
    showEditWorkerModal,
    setShowEditWorkerModal,
    showScheduleModal,
    setShowScheduleModal,
    selectedWorker,
    editWorkerData,
    scheduleData,
    handleEditWorker,
    handleScheduleWorker,
    handleEditWorkerInputChange,
    handleScheduleChange,
    handleSaveEditWorker,
    handleSaveSchedule
}) => {
    
    return (
        <>
            <div className="trabajadores">
                <SectionHeader 
                    title="👨‍💼 Gestión de Trabajadores" 
                    buttonText="➕ Nuevo Trabajador" 
                    onButtonClick={handleNewWorker} 
                />
                
                <div className="workers-grid">
                    {TRABAJADORES_DATA.map(trabajador => (
                        <div key={trabajador.id} className="worker-card">
                            <div className="worker-info">
                                <h4>{trabajador.nombre}</h4>
                                <p>📞 {trabajador.telefono}</p>
                                <p>📧 {trabajador.email}</p>
                                <p>💆‍♀️ Especialidad: {trabajador.especialidad}</p>
                                <p>⏱️ Experiencia: {trabajador.experiencia}</p>
                                <p className={`worker-status ${trabajador.estado.toLowerCase().replace(' ', '-')}`}>
                                    📊 Estado: {trabajador.estado}
                                </p>
                            </div>
                            <div className="worker-actions">
                                <button 
                                    className="edit-btn"
                                    onClick={() => handleEditWorker(trabajador)}
                                >
                                    ✏️ Editar
                                </button>
                                <button 
                                    className="schedule-btn"
                                    onClick={() => handleScheduleWorker(trabajador)}
                                >
                                    � Horarios
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={showNewWorkerModal}
                onClose={() => setShowNewWorkerModal(false)}
                title="➕ Agregar Nuevo Trabajador"
                onSave={handleSaveWorker}
                saveButtonText="💾 Guardar Trabajador"
            >
                <div className="worker-form">
                    <FormRow>
                        <FormInput
                            label="👤 Nombre Completo"
                            value={newWorkerData.nombre}
                            onChange={(e) => handleWorkerInputChange('nombre', e.target.value)}
                            placeholder="Ej: Dr. Ana Martínez"
                            required
                        />
                        <FormInput
                            type="tel"
                            label="📞 Teléfono"
                            value={newWorkerData.telefono}
                            onChange={(e) => handleWorkerInputChange('telefono', e.target.value)}
                            placeholder="Ej: +1 (555) 123-4567"
                            required
                        />
                    </FormRow>
                    
                    <FormRow>
                        <FormInput
                            type="email"
                            label="📧 Email"
                            value={newWorkerData.email}
                            onChange={(e) => handleWorkerInputChange('email', e.target.value)}
                            placeholder="Ej: ana.martinez@relaxtotal.com"
                            required
                        />
                        <FormInput
                            type="date"
                            label="🎂 Fecha de Nacimiento"
                            value={newWorkerData.fechaNacimiento}
                            onChange={(e) => handleWorkerInputChange('fechaNacimiento', e.target.value)}
                        />
                    </FormRow>
                    
                    <FormInput
                        label="🏠 Dirección"
                        value={newWorkerData.direccion}
                        onChange={(e) => handleWorkerInputChange('direccion', e.target.value)}
                        placeholder="Ej: Av. Principal 123, Ciudad"
                    />
                    
                    <FormRow>
                        <FormSelect
                            label="💆‍♀️ Especialidad Principal"
                            value={newWorkerData.especialidad}
                            onChange={(e) => handleWorkerInputChange('especialidad', e.target.value)}
                            options={TRABAJADORES_FORM_OPTIONS.especialidades}
                            defaultOption="Seleccionar especialidad"
                            required
                        />
                        <FormSelect
                            label="⏰ Tipo de Horario"
                            value={newWorkerData.tipoHorario}
                            onChange={(e) => handleWorkerInputChange('tipoHorario', e.target.value)}
                            options={TRABAJADORES_FORM_OPTIONS.horarios}
                            defaultOption="Seleccionar horario"
                        />
                    </FormRow>

                    <FormRow>
                        <FormInput
                            label="🎓 Años de Experiencia"
                            type="number"
                            value={newWorkerData.experiencia}
                            onChange={(e) => handleWorkerInputChange('experiencia', e.target.value)}
                            placeholder="Ej: 5"
                            min="0"
                        />
                        <FormInput
                            label="💰 Salario/Hora (S/)"
                            type="number"
                            value={newWorkerData.salario}
                            onChange={(e) => handleWorkerInputChange('salario', e.target.value)}
                            placeholder="Ej: 50"
                            min="0"
                        />
                    </FormRow>

                    <FormRow>
                        <FormInput
                            label="📜 Número de Licencia"
                            value={newWorkerData.licencia}
                            onChange={(e) => handleWorkerInputChange('licencia', e.target.value)}
                            placeholder="Ej: LIC-2023-001"
                        />
                        <FormSelect
                            label="📊 Estado"
                            value={newWorkerData.estado}
                            onChange={(e) => handleWorkerInputChange('estado', e.target.value)}
                            options={TRABAJADORES_FORM_OPTIONS.estados}
                            defaultOption="Seleccionar estado"
                        />
                    </FormRow>
                    
                    <FormTextarea
                        label="📝 Certificaciones y Notas"
                        value={newWorkerData.notas}
                        onChange={(e) => handleWorkerInputChange('notas', e.target.value)}
                        placeholder="Ej: Certificado en masaje terapéutico, especialista en lesiones deportivas, etc."
                    />
                </div>
            </Modal>

            {/* Modal Editar Trabajador */}
            <Modal
                isOpen={showEditWorkerModal}
                onClose={() => setShowEditWorkerModal(false)}
                title={`✏️ Editar ${selectedWorker ? selectedWorker.nombre.replace('🧑‍⚕️ ', '') : 'Trabajador'}`}
                onSave={handleSaveEditWorker}
                saveButtonText="💾 Actualizar Trabajador"
            >
                <div className="worker-form">
                    <FormRow>
                        <FormInput
                            label="👤 Nombre Completo"
                            value={editWorkerData.nombre}
                            onChange={(e) => handleEditWorkerInputChange('nombre', e.target.value)}
                            placeholder="Ej: Dr. Ana Martínez"
                            required
                        />
                        <FormInput
                            type="tel"
                            label="📞 Teléfono"
                            value={editWorkerData.telefono}
                            onChange={(e) => handleEditWorkerInputChange('telefono', e.target.value)}
                            placeholder="Ej: +1 (555) 123-4567"
                            required
                        />
                    </FormRow>
                    
                    <FormRow>
                        <FormInput
                            type="email"
                            label="📧 Email"
                            value={editWorkerData.email}
                            onChange={(e) => handleEditWorkerInputChange('email', e.target.value)}
                            placeholder="Ej: ana.martinez@relaxtotal.com"
                            required
                        />
                        <FormInput
                            type="date"
                            label="🎂 Fecha de Nacimiento"
                            value={editWorkerData.fechaNacimiento}
                            onChange={(e) => handleEditWorkerInputChange('fechaNacimiento', e.target.value)}
                        />
                    </FormRow>
                    
                    <FormInput
                        label="🏠 Dirección"
                        value={editWorkerData.direccion}
                        onChange={(e) => handleEditWorkerInputChange('direccion', e.target.value)}
                        placeholder="Ej: Av. Principal 123, Ciudad"
                    />
                    
                    <FormRow>
                        <FormSelect
                            label="💆‍♀️ Especialidad Principal"
                            value={editWorkerData.especialidad}
                            onChange={(e) => handleEditWorkerInputChange('especialidad', e.target.value)}
                            options={TRABAJADORES_FORM_OPTIONS.especialidades}
                            defaultOption="Seleccionar especialidad"
                            required
                        />
                        <FormSelect
                            label="⏰ Tipo de Horario"
                            value={editWorkerData.tipoHorario}
                            onChange={(e) => handleEditWorkerInputChange('tipoHorario', e.target.value)}
                            options={TRABAJADORES_FORM_OPTIONS.horarios}
                            defaultOption="Seleccionar horario"
                        />
                    </FormRow>

                    <FormRow>
                        <FormInput
                            label="🎓 Años de Experiencia"
                            type="number"
                            value={editWorkerData.experiencia}
                            onChange={(e) => handleEditWorkerInputChange('experiencia', e.target.value)}
                            placeholder="Ej: 5"
                            min="0"
                        />
                        <FormInput
                            label="💰 Salario/Hora (S/)"
                            type="number"
                            value={editWorkerData.salario}
                            onChange={(e) => handleEditWorkerInputChange('salario', e.target.value)}
                            placeholder="Ej: 50"
                            min="0"
                        />
                    </FormRow>

                    <FormRow>
                        <FormInput
                            label="📜 Número de Licencia"
                            value={editWorkerData.licencia}
                            onChange={(e) => handleEditWorkerInputChange('licencia', e.target.value)}
                            placeholder="Ej: LIC-2023-001"
                        />
                        <FormSelect
                            label="📊 Estado"
                            value={editWorkerData.estado}
                            onChange={(e) => handleEditWorkerInputChange('estado', e.target.value)}
                            options={TRABAJADORES_FORM_OPTIONS.estados}
                            defaultOption="Seleccionar estado"
                        />
                    </FormRow>
                    
                    <FormTextarea
                        label="📝 Certificaciones y Notas"
                        value={editWorkerData.notas}
                        onChange={(e) => handleEditWorkerInputChange('notas', e.target.value)}
                        placeholder="Ej: Certificado en masaje terapéutico, especialista en lesiones deportivas, etc."
                    />
                </div>
            </Modal>

            {/* Modal Gestión de Horarios */}
            <Modal
                isOpen={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                title={`📅 Gestión de Horarios - ${selectedWorker ? selectedWorker.nombre.replace('🧑‍⚕️ ', '') : 'Trabajador'}`}
                onSave={handleSaveSchedule}
                saveButtonText="💾 Guardar Horarios"
            >
                <div className="schedule-form">
                    <div className="schedule-header">
                        <h4>📋 Configurar horarios de trabajo semanales</h4>
                        <p>Define los horarios de trabajo para cada día de la semana</p>
                    </div>
                    
                    {Object.entries(scheduleData).map(([day, schedule]) => {
                        const dayNames = {
                            lunes: 'Lunes',
                            martes: 'Martes',
                            miercoles: 'Miércoles',
                            jueves: 'Jueves',
                            viernes: 'Viernes',
                            sabado: 'Sábado',
                            domingo: 'Domingo'
                        };
                        
                        return (
                            <div key={day} className="schedule-day">
                                <div className="day-header">
                                    <label className="day-toggle">
                                        <input
                                            type="checkbox"
                                            checked={schedule.activo}
                                            onChange={(e) => handleScheduleChange(day, 'activo', e.target.checked)}
                                        />
                                        <span className="day-name">{dayNames[day]}</span>
                                    </label>
                                </div>
                                
                                {schedule.activo && (
                                    <div className="time-inputs">
                                        <FormInput
                                            type="time"
                                            label="⏰ Hora de Inicio"
                                            value={schedule.inicio}
                                            onChange={(e) => handleScheduleChange(day, 'inicio', e.target.value)}
                                        />
                                        <FormInput
                                            type="time"
                                            label="🕐 Hora de Fin"
                                            value={schedule.fin}
                                            onChange={(e) => handleScheduleChange(day, 'fin', e.target.value)}
                                        />
                                    </div>
                                )}
                                
                                {!schedule.activo && (
                                    <div className="day-off">
                                        <span>🚫 Día libre</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    
                    <div className="schedule-summary">
                        <h5>📊 Resumen Semanal</h5>
                        <p>Días activos: {Object.values(scheduleData).filter(day => day.activo).length} de 7</p>
                        <p>Total horas aproximadas: {
                            Object.values(scheduleData)
                                .filter(day => day.activo)
                                .reduce((total, day) => {
                                    const inicio = new Date(`2000-01-01T${day.inicio}`);
                                    const fin = new Date(`2000-01-01T${day.fin}`);
                                    return total + (fin - inicio) / (1000 * 60 * 60);
                                }, 0)
                                .toFixed(1)
                        } horas</p>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Trabajadores;
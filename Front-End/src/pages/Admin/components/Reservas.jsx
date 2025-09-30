import React, { useState } from 'react';
import { SectionHeader } from './ui/Card';
import { Modal } from './ui/Modal';
import { FormInput, FormSelect, FormRow } from './ui/Form';
import { RESERVAS_DATA, SERVICIOS_DATA } from '../data/adminData';

const Reservas = () => {
    const tableHeaders = ["Cliente", "Servicio", "Fecha", "Hora", "Estado", "Acciones"];
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        cliente: '',
        servicio: '',
        fecha: '',
        hora: '',
        estado: 'pendiente'
    });

    const handleInputChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        alert('Reserva creada exitosamente!');
        setShowModal(false);
        setForm({ cliente: '', servicio: '', fecha: '', hora: '', estado: 'pendiente' });
    };

    return (
        <div className="reservas">
            <SectionHeader title="Gestión de Reservas" buttonText="Nueva Reserva" onButtonClick={() => setShowModal(true)} />

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
                        {RESERVAS_DATA.map(reserva => (
                            <tr key={reserva.id}>
                                <td>{reserva.cliente}</td>
                                <td>{reserva.servicio}</td>
                                <td>{reserva.fecha}</td>
                                <td>{reserva.hora}</td>
                                <td>
                                    <span className={`status ${reserva.estado}`}>
                                        {reserva.estado}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons-small">
                                        <button className="btn-edit">✏️</button>
                                        <button className="btn-delete">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="➕ Nueva Reserva"
                onSave={handleSave}
                saveButtonText="💾 Guardar Reserva"
            >
                <div className="reserva-form">
                    <FormRow>
                        <FormInput
                            label="Cliente"
                            value={form.cliente}
                            onChange={e => handleInputChange('cliente', e.target.value)}
                            placeholder="Nombre del cliente"
                            required
                        />
                        <FormSelect
                            label="Servicio"
                            value={form.servicio}
                            onChange={e => handleInputChange('servicio', e.target.value)}
                            options={SERVICIOS_DATA.map(s => ({ value: s.nombre, label: s.nombre }))}
                            defaultOption="Seleccionar servicio"
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
                        options={[{ value: 'pendiente', label: 'Pendiente' }, { value: 'confirmada', label: 'Confirmada' }]}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Reservas;
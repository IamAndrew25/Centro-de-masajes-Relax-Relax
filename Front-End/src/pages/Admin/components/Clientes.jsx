
import React, { useState } from 'react';
import { SectionHeader } from './ui/Card';
import { Modal } from './ui/Modal';
import { FormInput, FormRow } from './ui/Form';
import { CLIENTES_DATA, FORM_OPTIONS } from '../data/adminData';

const Clientes = ({ handleNewClient, showNewClientModal, setShowNewClientModal, newClientData, handleInputChange, handleSaveClient }) => {
    const [searchName, setSearchName] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Filtrar por nombre
    const filteredByName = CLIENTES_DATA.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchName.toLowerCase())
    );

    // Filtrar por fecha
    const filteredByDate = filteredByName.filter(cliente => {
        if (!dateFrom && !dateTo) return true;
        // Si la fecha ya está en formato yyyy-mm-dd, úsala directamente
        let fecha = cliente.ultimaVisita;
        if (fecha.includes('/')) {
            fecha = fecha.split('/').reverse().join('-'); // dd/mm/yyyy -> yyyy-mm-dd
        }
        if (dateFrom && fecha < dateFrom) return false;
        if (dateTo && fecha > dateTo) return false;
        return true;
    });

    return (
        <>
            <div className="clientes">
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.5rem', color: '#2c3e50' }}>👥 Gestión de Clientes</h2>
                </div>

                <div className="clientes-filtros" style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
                    <div>
                        <label>Buscar por nombre:</label>
                        <input
                            type="text"
                            placeholder="Nombre del cliente"
                            value={searchName}
                            onChange={e => setSearchName(e.target.value)}
                            style={{ marginLeft: '8px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div>
                        <label>Filtrar por fecha de visita:</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                            style={{ marginLeft: '8px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc' }}
                        />
                        <span style={{ margin: '0 8px' }}>a</span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc' }}
                        />
                    </div>
                </div>

                <div className="clientes-tabla-wrapper">
                    <table className="clientes-tabla" style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.07)' }}>
                        <thead>
                            <tr style={{ background: '#f5f7fa' }}>
                                <th style={{ padding: '12px', borderBottom: '2px solid #f39c12' }}>Nombre Completo</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #f39c12' }}>Teléfono</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #f39c12' }}>Email</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #f39c12' }}>Última Visita</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #f39c12' }}>Servicios</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #f39c12' }}>Tipo de Masaje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredByDate.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No se encontraron clientes.</td>
                                </tr>
                            ) : (
                                filteredByDate.map(cliente => (
                                    <tr key={cliente.id}>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{cliente.nombre.replace('👩 ', '').replace('👨 ', '')}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{cliente.telefono}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{cliente.email}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{cliente.ultimaVisita.includes('/') ? cliente.ultimaVisita.split('/').reverse().join('-') : cliente.ultimaVisita}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{cliente.servicios}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{cliente.tipoMasaje || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={showNewClientModal}
                onClose={() => setShowNewClientModal(false)}
                title="➕ Agregar Nuevo Cliente"
                onSave={handleSaveClient}
                saveButtonText="💾 Guardar Cliente"
            >
                <div className="client-form">
                    <FormRow>
                        <FormInput
                            label="👤 Nombre Completo"
                            value={newClientData.nombre}
                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                            placeholder="Ej: María García López"
                            required
                        />
                        <FormInput
                            type="tel"
                            label="📞 Teléfono"
                            value={newClientData.telefono}
                            onChange={(e) => handleInputChange('telefono', e.target.value)}
                            placeholder="Ej: +1 (555) 123-4567"
                            required
                        />
                    </FormRow>
                    <FormRow>
                        <FormInput
                            type="email"
                            label="📧 Email"
                            value={newClientData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Ej: maria@email.com"
                        />
                        <FormInput
                            label="🗓️ Última Visita"
                            type="date"
                            value={newClientData.ultimaVisita}
                            onChange={(e) => handleInputChange('ultimaVisita', e.target.value)}
                        />
                    </FormRow>
                    <FormInput
                        label="💆‍♀️ Servicios"
                        type="number"
                        value={newClientData.servicios}
                        onChange={(e) => handleInputChange('servicios', e.target.value)}
                        placeholder="Ej: 5"
                        min="0"
                    />
                    <FormRow>
                        <FormInput
                            label="Tipo de Masaje"
                            value={newClientData.tipoMasaje || ''}
                            onChange={(e) => handleInputChange('tipoMasaje', e.target.value)}
                            placeholder="Ej: Relajante, Deportivo, etc."
                        />
                    </FormRow>
                </div>
            </Modal>
        </>
    );
};

export default Clientes;
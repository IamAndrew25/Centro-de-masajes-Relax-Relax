import React from 'react';
import { SectionHeader } from './ui/Card';
import { Modal } from './ui/Modal';
import { FormInput, FormSelect, FormTextarea, FormRow } from './ui/Form';
import { CLIENTES_DATA, FORM_OPTIONS } from '../data/adminData';

const Clientes = ({ handleNewClient, showNewClientModal, setShowNewClientModal, newClientData, handleInputChange, handleSaveClient }) => {
    
    return (
        <>
            <div className="clientes">
                <SectionHeader 
                    title="👥 Gestión de Clientes" 
                    buttonText="➕ Nuevo Cliente" 
                    onButtonClick={handleNewClient} 
                />
                
                <div className="clients-grid">
                    {CLIENTES_DATA.map(cliente => (
                        <div key={cliente.id} className="client-card">
                            <div className="client-info">
                                <h4>{cliente.nombre}</h4>
                                <p>� {cliente.telefono}</p>
                                <p>📧 {cliente.email}</p>
                                <p>🗓️ Última visita: {cliente.ultimaVisita}</p>
                                <p>💆‍♀️ Servicios: {cliente.servicios} sesiones</p>
                            </div>
                            <div className="client-actions">
                                <button className="edit-btn">✏️ Editar</button>
                                <button className="history-btn">📋 Historial</button>
                            </div>
                        </div>
                    ))}
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
                            type="date"
                            label="🎂 Fecha de Nacimiento"
                            value={newClientData.fechaNacimiento}
                            onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                        />
                    </FormRow>
                    
                    <FormInput
                        label="🏠 Dirección"
                        value={newClientData.direccion}
                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                        placeholder="Ej: Av. Principal 123, Ciudad"
                    />
                    
                    <FormRow>
                        <FormSelect
                            label="💆‍♀️ Preferencias de Masaje"
                            value={newClientData.preferencias}
                            onChange={(e) => handleInputChange('preferencias', e.target.value)}
                            options={FORM_OPTIONS.preferencias}
                            defaultOption="Seleccionar preferencia"
                        />
                        <FormSelect
                            label="📱 ¿Cómo nos conoció?"
                            value={newClientData.fuente}
                            onChange={(e) => handleInputChange('fuente', e.target.value)}
                            options={FORM_OPTIONS.fuentes}
                            defaultOption="Seleccionar fuente"
                        />
                    </FormRow>
                    
                    <FormTextarea
                        label="📝 Notas Especiales"
                        value={newClientData.notas}
                        onChange={(e) => handleInputChange('notas', e.target.value)}
                        placeholder="Ej: Alérgico a ciertos aceites, prefiere presión suave, etc."
                    />
                </div>
            </Modal>
        </>
    );
};

export default Clientes;
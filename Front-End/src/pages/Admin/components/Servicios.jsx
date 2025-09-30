import React from 'react';
import { SectionHeader } from './ui/Card';
import { Modal } from './ui/Modal';
import { FormInput, FormTextarea, FormRow } from './ui/Form';
import { SERVICIOS_DATA } from '../data/adminData';

const Servicios = ({ handleNewService, showNewServiceModal, setShowNewServiceModal, newServiceData, handleServiceInputChange, handleSaveService }) => {
    
    return (
        <>
            <div className="servicios">
                <SectionHeader 
                    title="💆‍♀️ Gestión de Servicios" 
                    buttonText="➕ Nuevo Servicio" 
                    onButtonClick={handleNewService} 
                />
                
                <div className="services-grid">
                    {SERVICIOS_DATA.map(servicio => (
                        <div key={servicio.id} className="service-card">
                            <h3>{servicio.nombre}</h3>
                            <p className="duration">⏱️ {servicio.duracion}</p>
                            <p className="price">S/ {servicio.precio}</p>
                            <div className="service-actions">
                                <button className="btn-edit">Editar</button>
                                <button className="btn-delete">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={showNewServiceModal}
                onClose={() => setShowNewServiceModal(false)}
                title="➕ Agregar Nuevo Servicio"
                onSave={handleSaveService}
                saveButtonText="💾 Crear Servicio"
            >
                <div className="service-form">
                    <FormInput
                        label="💆‍♀️ Nombre del Servicio"
                        value={newServiceData.nombre}
                        onChange={(e) => handleServiceInputChange('nombre', e.target.value)}
                        placeholder="Ej: Masaje Sueco, Reflexología, Aromaterapia"
                        required
                    />
                    
                    <FormRow>
                        <FormInput
                            type="number"
                            label="⏱️ Duración (minutos)"
                            value={newServiceData.duracion}
                            onChange={(e) => handleServiceInputChange('duracion', e.target.value)}
                            placeholder="Ej: 60, 90, 120"
                            min="15"
                            max="300"
                            required
                        />
                        <FormInput
                            type="number"
                            label="💰 Precio (Soles)"
                            value={newServiceData.precio}
                            onChange={(e) => handleServiceInputChange('precio', e.target.value)}
                            placeholder="Ej: 300, 450, 650"
                            min="50"
                            step="10"
                            required
                        />
                    </FormRow>
                    
                    <FormTextarea
                        label="📝 Descripción del Servicio"
                        value={newServiceData.descripcion}
                        onChange={(e) => handleServiceInputChange('descripcion', e.target.value)}
                        placeholder="Describe los beneficios del servicio, técnicas utilizadas, recomendaciones..."
                        rows={4}
                    />

                    <div className="service-preview">
                        <h4>👀 Vista Previa</h4>
                        <div className="preview-card">
                            <h5>{newServiceData.nombre || 'Nombre del Servicio'}</h5>
                            <p>⏱️ {newServiceData.duracion || '0'} minutos</p>
                            <p>💰 S/ {newServiceData.precio || '0'}</p>
                            <p>{newServiceData.descripcion || 'Sin descripción'}</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Servicios;
import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { FormInput, FormRow } from './ui/Form';
import { getAllClients, createClient , 
    descargarExcelClientes,enviarReporteClientes } from './JS/ClientesService';


const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newClientData, setNewClientData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        ultimaVisita: '',
        servicios: '',
        tipoMasaje: ''
    });

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const data = await getAllClients();
            setClientes(data);
        } catch (error) {
            console.error('Error cargando clientes:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setNewClientData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveClient = async () => {
        // el nombre no debe contener numeros vlidacion xd
        const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(newClientData.nombre);
        if (!nombreValido) {
            alert("El nombre no puede contener números ni caracteres especiales");
            return;
        }
        try {
            await createClient({
                username: newClientData.nombre,
                phone: newClientData.telefono,
                email: newClientData.email,
                password: 'default123',
                dni: '00000000',
                enabled: true
            });
            setShowModal(false);
            setNewClientData({
                nombre: '',
                telefono: '',
                email: '',
                ultimaVisita: '',
                servicios: '',
                tipoMasaje: ''
            });
            fetchClientes();
        } catch (error) {
            console.error('Error guardando cliente:', error);
        }
    };

    // Filtrado por nombre
    const filteredByName = clientes.filter(c =>
        c.username?.toLowerCase().includes(searchName.toLowerCase())
    );

    // Filtrado por fecha
    const filteredByDate = filteredByName.filter(c => {
        if (!dateFrom && !dateTo) return true;
        if (!c.ultimaVisita) return true;

        let fecha = c.ultimaVisita.includes('T') ? c.ultimaVisita.split('T')[0] : c.ultimaVisita;
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
                        placeholder="Andre Ts"
                        value={searchName}
                        onChange={e => {
                            // Solo permitir letras y espacios
                            const soloLetras = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                            setSearchName(soloLetras);
                        }}
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
                    <button 
                        style={{ height: '40px', marginLeft: '10px' }} 
                        onClick={descargarExcelClientes} 
                      >
                        ⬇️ Descargar Excel
                      </button>
                    <button 
                        style={{ height: '40px', marginLeft: '10px' }} 
                        onClick={enviarReporteClientes} 
                      >
                        📊 Reporte Excel
                      </button>
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
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{cliente.username || '-'}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{cliente.phone || '-'}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{cliente.email || '-'}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{cliente.ultimaVisita || '-'}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{cliente.servicios || '-'}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{cliente.tipoMasaje || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="➕ Agregar Nuevo Cliente"
                onSave={handleSaveClient}
                saveButtonText="💾 Guardar Cliente"
            >
                <div className="client-form">
                    <FormRow>
                        <FormInput
                            label="👤 Nombre Completo"
                            value={newClientData.nombre}
                            onChange={e => handleInputChange('nombre', e.target.value)}
                            placeholder="Ej: María García López"
                            required
                        />
                        <FormInput
                            type="tel"
                            label="📞 Teléfono"
                            value={newClientData.telefono}
                            onChange={e => handleInputChange('telefono', e.target.value)}
                            placeholder="Ej: +1 (555) 123-4567"
                            required
                        />
                    </FormRow>
                    <FormRow>
                        <FormInput
                            type="email"
                            label="📧 Email"
                            value={newClientData.email}
                            onChange={e => handleInputChange('email', e.target.value)}
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
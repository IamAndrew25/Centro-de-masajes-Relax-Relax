import React from 'react';
import { SectionHeader } from './ui/Card';
import { RESERVAS_DATA } from '../data/adminData';

const Reservas = () => {
    const tableHeaders = ["Cliente", "Servicio", "Fecha", "Hora", "Estado", "Acciones"];

    return (
        <div className="reservas">
            <SectionHeader title="Gestión de Reservas" buttonText="Nueva Reserva" />
            
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
        </div>
    );
};

export default Reservas;
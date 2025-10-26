import React, { useState } from "react";
import MainLayout from '../../layouts/MainLayout';
import "./Claims.css";
import { toast } from "react-toastify";

const Claims = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    email: "",
    telefono: "",
    servicio: "",
    tipo: "Reclamo",
    detalle: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.succes("Tu reclamo ha sido enviado correctamente. Gracias por confiar en Relax Total.");
    // Aquí se puede manejar para enviar los datos a la Bd o API, si es necesario.
  };

  return (
    <MainLayout>
        <div className="claims-container">
        {/* Hero */}
        <section className="claims-hero">
            <h1>Libro de Reclamaciones</h1>
            <p>Tu satisfacción es nuestra prioridad en Relax Total</p>
        </section>

        {/* Formulario */}
        <section className="claims-content">
            <div className="claims-wrapper">
            <h2>Registra tu reclamo o queja</h2>
            <p>
                Completa el siguiente formulario para registrar tu reclamo o queja
                según lo establecido por la normativa peruana.
            </p>

            <form className="claims-form" onSubmit={handleSubmit}>
                <div className="claims-field">
                <label>Nombre completo</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="claims-field">
                <label>DNI</label>
                <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="claims-field">
                <label>Correo electrónico</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="claims-field">
                <label>Teléfono</label>
                <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="claims-field">
                <label>Servicio contratado</label>
                <input
                    type="text"
                    name="servicio"
                    value={formData.servicio}
                    onChange={handleChange}
                    placeholder="Ejemplo: Masaje relajante"
                    required
                />
                </div>

                <div className="claims-field">
                <label>Tipo</label>
                <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                >
                    <option value="Reclamo">Reclamo</option>
                    <option value="Queja">Queja</option>
                </select>
                </div>

                <div className="claims-field">
                <label>Detalle</label>
                <textarea
                    name="detalle"
                    rows="5"
                    value={formData.detalle}
                    onChange={handleChange}
                    placeholder="Describe tu reclamo o queja con el mayor detalle posible"
                    required
                ></textarea>
                </div>

                <button type="submit" className="claims-btn-submit">
                Enviar reclamo
                </button>
            </form>

            {/* CTA */}
            <div className="claims-cta">
                <a href="/" className="claims-btn-back">
                Volver al inicio
                </a>
            </div>
            </div>
        </section>
        </div>
    </MainLayout>
  );
};

export default Claims;

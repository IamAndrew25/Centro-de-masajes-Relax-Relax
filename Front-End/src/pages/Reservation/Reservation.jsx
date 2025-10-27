import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "./Reservation.css";

import heroImage from "../../assets/images/Banner.jpg";

const Reservation = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
  });
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
      const params = new URLSearchParams(location.search);
      const serviceFromURL = params.get('servicio');
      if (serviceFromURL) {
        // Actualiza el estado del formulario si el parámetro existe
        setFormData(prevData => ({ ...prevData, service: serviceFromURL }));
      }
    }, [location]);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Permite un '+' al inicio y solo números después, con un máximo de 12 caracteres en total.
    if (value === "" || /^\+?[0-9]*$/.test(value) && value.length <= 13) {
      setFormData({ ...formData, phone: value });
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // 1. Validar campos vacíos
    for (const key in formData) {
      if (!formData[key]) {
        newErrors[key] = "Este campo es obligatorio.";
      }
    }

    // 2. Validar formato de email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del correo electrónico no es válido.";
    }

    // 3. Validar teléfono
    if (formData.phone && formData.phone.length < 9) {
      newErrors.phone = "El teléfono debe tener al menos 9 dígitos.";
    }

    setErrors(newErrors);

    // Si no hay errores, procesar el formulario
    if (Object.keys(newErrors).length === 0) {
      setSubmitMessage("¡Tu reserva ha sido confirmada con éxito!");
      // Limpiar formulario y errores después de un envío exitoso
      setFormData({ name: "", email: "", phone: "", service: "", date: "", time: "" });
      setErrors({});
      // Opcional: Ocultar el mensaje después de unos segundos
      setTimeout(() => setSubmitMessage(""), 5000);
    } else {
      setSubmitMessage(""); // Limpiar mensaje de éxito si hay errores
    }
  };

  return (
    <MainLayout>
      <div className="reservation-container">
        {/* Hero */}
        <section
          className="hero-section"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="hero-overlay"></div>
          <h1>Reserva tu Experiencia</h1>
          <p>Elige tu fecha, servicio y asegura tu momento de relajación.</p>
        </section>

        {/* Formulario de Reserva */}
        <section className="reservation-content">
          <div className="reservation-form-card">
            <h2>Formulario de Reserva</h2>
            {submitMessage && <p className="submit-message">{submitMessage}</p>}
            <form className="reservation-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input type="text" id="name" placeholder="Tu nombre completo" value={formData.name} onChange={handleChange} />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input type="email" id="email" placeholder="ejemplo@email.com" value={formData.email} onChange={handleChange} />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input type="tel" id="phone" placeholder="+51 99999999" value={formData.phone} onChange={handlePhoneChange} />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="service">Servicio</label>
                <select id="service" value={formData.service} onChange={handleChange}>
                  <option value="">Seleccione un servicio</option>
                  <option>Masaje Relajante</option>
                  <option>Masaje Descontracturante</option>
                  <option>Ritual Pre Natal</option>
                  <option>Paquete Premium</option>
                  <option>Masaje para Parejas</option>
                  <option>Masaje Sueco</option>
                  <option>Masaje de Aromaterapia</option>
                  <option>Masaje con Piedras Calientes</option>
                  <option>Masaje Deportivo</option>
                  <option>Drenaje Linfático</option>
                </select>
                {errors.service && <p className="error-text">{errors.service}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="date">Fecha</label>
                <input type="date" id="date" value={formData.date} onChange={handleChange} />
                {errors.date && <p className="error-text">{errors.date}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="time">Hora</label>
                <input type="time" id="time" value={formData.time} onChange={handleChange} />
                {errors.time && <p className="error-text">{errors.time}</p>}
              </div>

              <button type="submit" className="btn-reserve">
                Confirmar Reserva
              </button>
            </form>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Reservation;

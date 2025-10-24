import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import './Contact.css';
import heroImage from '../../assets/images/Banner.jpg';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí va la lógica para enviar el formulario al backensito
    console.log('Datos del formulario:', formData);
    setSubmitMessage('¡Gracias por tu mensaje! Te responderemos pronto.');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitMessage(''), 5000);
  };

  return (
    <MainLayout>
      <div className="contact-page-container">
        <section
          className="hero-section"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="hero-overlay"></div>
          <h1 className="main-title">Contáctanos</h1>
          <p className="subtitle">Estamos aquí para ayudarte. Resuelve tus dudas o envíanos tus comentarios.</p>
        </section>

        <section className="contact-content">
          <div className="contact-content-wrapper">
            
            {/* Formulario de Contacto */}
            <div className="contact-form-card">
              <h2>Escríbenos</h2>
              {submitMessage && <p className="submit-message">{submitMessage}</p>}
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <input type="text" id="name" placeholder="Tu nombre completo" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input type="email" id="email" placeholder="ejemplo@email.com" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Mensaje</label>
                  <textarea id="message" rows="5" placeholder="Escribe tu consulta aquí..." value={formData.message} onChange={handleChange}></textarea>
                </div>
                <button type="submit" className="btn-contact-submit">
                  Enviar Mensaje
                </button>
              </form>
            </div>

            {/* Informacion de Contacto */}
            <div className="contact-info-card">
              <h2>Información</h2>
              <p>
                Puedes encontrarnos en nuestra sede principal o contactarnos
                directamente a través de nuestros canales de atención.
              </p>
              <ul className="contact-info-list">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>Av. El buen masaje, Miraflores - Lima, Perú</span> 
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <span>+51 922 955 336</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>contacto@relaxtotal.com</span>
                </li>
              </ul>
              
              {/* Placeholder para el mapa */}
              <div className="contact-map-placeholder">
                {/* Aqui se puede insertar un iframe de maps, pero no hay tienda local xD*/}
                <p>(Aquí va el mapa de Google Maps, si tuvieramos local)</p>
              </div>
            </div>

          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Contact;
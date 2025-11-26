import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import './Contact.css';
import heroImage from '../../assets/images/Banner.jpg';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getBusinessBasics } from "../Admin/components/JS/businessConfigService"


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Información del negocio que viene del backend
  const [businessInfo, setBusinessInfo] = useState({
    nombreSpa: 'Relax Total',
    direccion: 'Av. El buen masaje, Miraflores - Lima, Perú',
    telefono: '+51 922 955 336',
    email: 'contacto@relaxtotal.com',
  });

  useEffect(() => {
  const fetchBusinessInfo = async () => {
    try {
      const data = await getBusinessBasics();
      setBusinessInfo(data);
    } catch (err) {
      console.error("Error al cargar información de negocio:", err);
    }
  };
  fetchBusinessInfo();
}, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    toast.success('¡Gracias por tu mensaje! Te responderemos pronto.');
    setFormData({ name: '', email: '', message: '' });
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
          <p className="subtitle">
            Estamos aquí para ayudarte. Resuelve tus dudas o envíanos tus comentarios.
          </p>
        </section>

        <section className="contact-content">
          <div className="contact-content-wrapper">
            {/* Formulario de Contacto */}
            <div className="contact-form-card">
              <h2>Escríbenos</h2>
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="ejemplo@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Mensaje</label>
                  <textarea
                    id="message"
                    rows="5"
                    placeholder="Escribe tu consulta aquí..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <button type="submit" className="btn-contact-submit">
                  Enviar Mensaje
                </button>
              </form>
            </div>

            {/* Información de Contacto */}
            <div className="contact-info-card">
              <h2>Información</h2>
              <p>
                Puedes encontrarnos en nuestra sede principal o contactarnos
                directamente a través de nuestros canales de atención.
              </p>
              <ul className="contact-info-list">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>{businessInfo.direccion}</span>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <span>{businessInfo.telefono}</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>{businessInfo.email}</span>
                </li>
              </ul>

              <div className="contact-map-placeholder">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d675.6633095080708!2d-77.03602974731582!3d-12.120105988690884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c90d67ad26b1%3A0x554d1dbb917b4471!2sQ%20Spa%20%26%20Wellness!5e1!3m2!1ses-419!2spe!4v1764053376226!5m2!1ses-419!2spe" width="100%" height="200" style={{ border:0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title='Mapa de Ubicacion'></iframe>
              </div>
            </div>

          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Contact;

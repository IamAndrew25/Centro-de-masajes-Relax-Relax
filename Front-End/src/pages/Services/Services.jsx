import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "./Services.css";
import heroImage from "../../assets/images/Banner.jpg";

// Datos de ejemplo
const servicesData = {
  Relajantes: [
    { id: 1, name: "Masaje Sueco", duration: "60 min", price: 85, description: "Técnica clásica para reducir el estrés y mejorar la circulación." },
    { id: 2, name: "Masaje de Aromaterapia", duration: "75 min", price: 95, description: "Utiliza aceites esenciales para calmar el sistema nervioso." },
    { id: 3, name: "Masaje con Piedras Calientes", duration: "90 min", price: 110, description: "El calor penetrante relaja los músculos profundos." },
  ],
  Terapeuticos: [
    { id: 4, name: "Masaje Deportivo", duration: "45 min", price: 75, description: "Enfocado en la recuperación muscular y prevención de lesiones." },
    { id: 5, name: "Drenaje Linfático", duration: "60 min", price: 90, description: "Suave masaje para estimular la circulación linfática y desintoxicación." },
  ],
  RitualesSpa: [
    { id: 6, name: "Ritual Renovador Facial y Corporal", duration: "120 min", price: 150, description: "Experiencia completa que combina exfoliación, envoltura y masaje." },
    { id: 7, name: "Masaje para Parejas", duration: "60 min", price: 170, description: "Masaje relajante en sala privada para compartir con tu ser querido." },
  ],
};

const Services = () => {
  const location = useLocation();
  const categories = Object.keys(servicesData);
  const navigate = useNavigate();

  const getCategoryFromHash = () => {
    const hash = location.hash.replace("#", "");
    return categories.includes(hash) ? hash : categories[0];
  };

  const [activeTab, setActiveTab] = useState(getCategoryFromHash());

  useEffect(() => {
    const categoryFromHash = getCategoryFromHash();
    if (categoryFromHash !== activeTab) {
      setActiveTab(categoryFromHash);
    }
  }, [location.hash]);

  // Tarjeta de servicio
  const ServiceCard = ({ service }) => (
    <div className="service-card">
      {/* Puedes añadir imagen si quieres */}
      {/* <img src={`/images/${service.id}.jpg`} alt={service.name} className="service-image" /> */}
      <div className="card-content">
        <h3>{service.name}</h3>
        <p className="card-duration">{service.duration}</p>
        <p className="card-description">{service.description}</p>
        <div className="card-footer">
          <span className="card-price">S/ {service.price}</span>
          <button className="cta-button" onClick={() => navigate(`/reserva?servicio=${encodeURIComponent(service.name)}`)}>Reservar</button>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="services-page">
        
        {/* Hero con overlay */}
        <div
          className="hero-section"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="hero-overlay"></div>
          <h1 className="main-title">Descubre Nuestros Servicios</h1>
          <p className="subtitle">
            <br /><br /><br /><br />Encuentra el tratamiento perfecto para tu mente, cuerpo y espíritu.
          </p>
        </div>

        <div className="services-container">
          {/* Tabs */}
          <div className="tabs-container">
            {categories.map((category) => (
              <button
                key={category}
                className={`tab-button ${activeTab === category ? "active" : ""}`}
                onClick={() => setActiveTab(category)}
              >
                {category.replace(/([A-Z])/g, " $1").trim()}
              </button>
            ))}
          </div>

          {/* Contenido de pestañas */}
          <div className="tab-content">
            <h2 className="tab-title">
              {activeTab.replace(/([A-Z])/g, " $1").trim()}
            </h2>

            <div className="cards-grid">
              {servicesData[activeTab].map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Services;

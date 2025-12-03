import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import MainLayout from "../../layouts/MainLayout";
import "./Services.css";
import heroImage from "../../assets/images/Banner.jpg";
import axios from 'axios';

// Datos de ejemplo (estáticos)
const staticServicesData = {
  Relajantes: [],
  Terapeuticos: [
    { id: 's4', name: "Masaje Deportivo", duration: "45 min", price: 75, description: "Enfocado en la recuperación muscular y prevención de lesiones." },
    { id: 's5', name: "Drenaje Linfático", duration: "60 min", price: 90, description: "Suave masaje para estimular la circulación linfática y desintoxicación." },
  ],
  RitualesSpa: [
    { id: 's6', name: "Ritual Renovador Facial y Corporal", duration: "120 min", price: 150, description: "Experiencia completa que combina exfoliación, envoltura y masaje." },
    { id: 's7', name: "Masaje para Parejas", duration: "60 min", price: 170, description: "Masaje relajante en sala privada para compartir con tu ser querido." },
  ],
};

const Services = () => {
  const location = useLocation();
  const [servicesData, setServicesData] = useState(staticServicesData);
  const categories = Object.keys(staticServicesData);

  const getCategoryFromHash = () => {
    const hash = location.hash.replace("#", "");
    return categories.includes(hash) ? hash : categories[0];
  };

  const [activeTab, setActiveTab] = useState(getCategoryFromHash());

  useEffect(() => {
    const fetchAndMergeServices = async () => {
      try {
        const response = await axios.get('http://3.16.225.135:8080/services');
        const backendServices = response.data;
        const transformedServices = backendServices.map(service => ({
          id: service.id,
          name: service.name,
          duration: `${service.durationMin} min`,
          price: service.baseprice,
          description: service.description
        }));
        
        // mantengo las otras categorias estaticas por ahora
        setServicesData(prevData => ({
          ...prevData,
          Relajantes: transformedServices
        }));

      } catch (error) {
        console.error('Error cargando servicios del backend:', error);
        setServicesData(staticServicesData);
      }
    };

    fetchAndMergeServices();
  }, []);

  useEffect(() => {
    const categoryFromHash = getCategoryFromHash();
    if (categoryFromHash !== activeTab) {
      setActiveTab(categoryFromHash);
    }
  }, [location.hash]);

  const ServiceCard = ({ service }) => {
    const {addToCart} = useCart();

    return (
    <div className="service-card">
      <div className="card-content">
        <h3>{service.name}</h3>
        <p className="card-duration">{service.duration}</p>
        <p className="card-description">{service.description}</p>
        <div className="card-footer">
          <span className="card-price">S/ {service.price}</span>
          <button className="cta-button" onClick={() => addToCart(service)}>Reservar</button>
        </div>
      </div>
    </div>
  );
  };
  
  return (
    <MainLayout>
      <div className="services-page">
        
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
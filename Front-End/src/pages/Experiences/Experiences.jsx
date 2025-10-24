import React from "react";
import MainLayout from "../../layouts/MainLayout";
import "./Experiences.css";

import heroImage from "../../assets/images/Banner.jpg";
import halfDayImage from "../../assets/images/package-ejecutivo.jpg";
import fullDayImage from "../../assets/images/pic2.jpg";
import bacheloretteImage from "../../assets/images/Despedida.jpg";

const experiencesData = [
  {
    id: 1,
    name: "Half Day Spa (Escapada)",
    image: halfDayImage,
    duration: "Aprox. 3 horas",
    price: 320,
    description: "Tu pausa perfecta. Incluye acceso a tina de hidromasajes, exfoliación corporal y un masaje relajante de 60 minutos.",
  },
  {
    id: 2,
    name: "Full Day Spa (Renovación Total)",
    image: fullDayImage,
    duration: "Aprox. 5 horas",
    price: 550,
    description: "Un día completo para ti. Incluye sauna, hidromasaje, masaje de 90 min (a elección), limpieza facial profunda y un aperitivo ligero.",
  },
  {
    id: 3,
    name: "Experiencia (Despedida de Solter@)",
    image: bacheloretteImage,
    duration: "Aprox. 2.5 horas",
    price: 190,
    description: "Celebren un momento especial. Incluye sala privada, masaje relajante, exfoliación de manos y pies, y copas de espumante. (Mínimo 2 personas).",
  },
];

const ExperienceCard = ({ experience }) => (
  <div className="experience-card">
    <img src={experience.image} alt={experience.name} className="experience-image" />
    <div className="card-content">
      <h3>{experience.name}</h3>
      <p className="card-duration">{experience.duration}</p>
      <p className="card-description">{experience.description}</p>
      <div className="card-footer">
        <span className="card-price">S/ {experience.price}</span>
        <button className="cta-button">Reservar</button>
      </div>
    </div>
  </div>
);

const Experiences = () => {
  return (
    <MainLayout>
      <div className="experiences-page">
        
        {/* Hero Section */}
        <div
          className="hero-section"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="hero-overlay"></div>
          <h1 className="main-title">Nuestras Experiencias</h1>
          <p className="subtitle">
            Rituales y escapadas de spa diseñadas para una desconexión profunda.
          </p>
        </div>

        {/* Contenido de Experiencias */}
        <div className="experiences-container">
          <h2 className="tab-title">Escapadas y Rituales</h2>
          <div className="cards-grid">
            {experiencesData.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default Experiences;
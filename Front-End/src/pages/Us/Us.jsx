import React from "react";
import MainLayout from "../../layouts/MainLayout";
import "./Us.css";

// Importa tus imágenes
import heroOilImage from "../../assets/images/Banner.jpg";
import especialista1 from "../../assets/images/ter1.jpg";
import especialista2 from "../../assets/images/ter2.jpg";
import especialista3 from "../../assets/images/ter3.jpg";

const especialistas = [
  {
    img: especialista1,
    name: "Mg. Carlos Salazar",
    specialty: "Especialista en Rehabilitación Deportiva",
  },
  {
    img: especialista2,
    name: "Lic. Andrea Volsnik",
    specialty: "Terapia física avanzada",
  },
  {
    img: especialista3,
    name: "Lic. María Cardinale",
    specialty: "Terapia Manual y Ortopédica",
  },
];

const Us = () => {
  return (
    <MainLayout>
      <div className="nosotros-container">
        {/* Hero */}
        <section
          className="hero-section"
          style={{ backgroundImage: `url(${heroOilImage})` }}
        >
          <div className="hero-overlay"></div>
          <h1>Nosotros</h1>
        </section>

        {/* Misión y Visión */}
        <section className="section-nosotros">
          <div className="container-nosotros">
            <div>
              <h2 className="title-MV">Misión</h2>
              <p className="MV-text">
                Brindar experiencias de bienestar únicas mediante masajes de
                alta calidad con terapeutas certificados, facilitando reservas y
                pagos digitales a través de nuestra plataforma web y móvil.
                Contribuir a reducir el estrés, mejorar la salud integral y
                promover el equilibrio personal.
              </p>
            </div>
            <div>
              <h2 className="title-MV">Visión</h2>
              <p className="MV-text">
                Ser la plataforma líder de masajes y bienestar en el país,
                reconocida por la innovación tecnológica, la calidad profesional
                y el compromiso con la salud integral. Expandirnos como la
                primera opción confiable, accesible y segura para quienes buscan
                relajación y armonía.
              </p>
            </div>
          </div>
        </section>

        {/* Especialistas */}
        <section className="section-nosotros clip-down band">
        <div className="container-nosotros">
            <h2 className="title-nosotros">Nuestros especialistas</h2>
            <div className="cards-nosotros">
            {especialistas.map((especialista, index) => (
                <article className="card-nosotros" key={index}>
                <div className="media-nosotros">
                    <img
                    src={especialista.img}
                    alt={`Foto de ${especialista.name}`}
                    />
                </div>
                <div className="body-nosotros">
                    <h4>{especialista.name}</h4>
                    <p>{especialista.specialty}</p>
                </div>
                </article>
            ))}

            {/* Boton de inscripción*/}
            <div className="band-btn">
                <a href="#inscripcion" className="cta-nosotros">
                Inscríbete hoy
                </a>
            </div>
            </div>
        </div>
        </section>

      </div>
    </MainLayout>
  );
};

export default Us;

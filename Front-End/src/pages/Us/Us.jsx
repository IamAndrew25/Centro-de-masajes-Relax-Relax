import React from "react";
import MainLayout from "../../layouts/MainLayout";
import { Link } from "react-router-dom";
import "./Us.css";

// Importa tus imágenes
import heroOilImage from "../../assets/images/Banner.jpg";
import especialista1 from "../../assets/images/ter1.jpg";
import especialista2 from "../../assets/images/ter2.jpg";
import especialista3 from "../../assets/images/ter3.jpg";
import spaImage from "../../assets/images/spa_main.jpg";

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
        
        {/* Hero Banner */}
        <section
          className="hero-section"
          style={{ backgroundImage: `url(${heroOilImage})` }}
        >
          <div className="hero-overlay"></div>
          <h1>Nosotros</h1>
        </section>

        <section className="section-confianza">
          <div className="confianza-content">
            <h2 className="confianza-title">
              La ciencia del bienestar, <br /> confiada en <strong>nuestras manos.</strong>
            </h2>
            <p className="confianza-text">
              Brindamos experiencias de bienestar únicas mediante masajes de
              alta calidad con terapeutas certificados. Contribuimos a reducir el estrés, mejorar la salud integral y promover el equilibrio personal.
            </p>
          </div>
        </section>
        
        {/* mision y vision*/}
        <section className="section-MV-accent">
          <div className="container-MV-accent grid-2">
            <div>
              <h3 className="title-MV-accent">Misión</h3>
              <p className="MV-text">
                Brindar experiencias de bienestar únicas mediante masajes de
                alta calidad con terapeutas certificados, facilitando reservas y
                pagos digitales a través de nuestra plataforma web y móvil.
                Contribuir a reducir el estrés, mejorar la salud integral y
                promover el equilibrio personal.
              </p>
            </div>
            <div>
              <h3 className="title-MV-accent">Visión</h3>
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

        {/*Seccion iamge*/}
        <section
          className="section-cta-image"
          style={{ backgroundImage: `url(${spaImage})` }}
        >
          <div className="cta-overlay-dark"></div>
          <div className="cta-content">
            <h2 className="cta-title">
              <strong>Lujoso es tener tiempo.</strong><br />
              Conviertelo en una tradición.
            </h2>
            <p className="cta-subtitle">
              Reserva tu momento de paz y bienestar hoy mismo.
            </p>
            <Link to="/servicios/masajes" className="cta-nosotros cta-main">
              ¡Conoce nuestros tratamientos!
            </Link>
          </div>
        </section>

        {/* Especialistas */}
        <section className="section-nosotros band"> 
          <div className="container-nosotros-full">
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
                <Link to="/reserva" className="cta-nosotros">
                  Inscríbete hoy
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Us;
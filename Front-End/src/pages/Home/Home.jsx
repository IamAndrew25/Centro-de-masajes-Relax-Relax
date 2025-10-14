import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import './Home.css';
import heroOilImage from '../../assets/images/Banner.jpg';
import massageTherapy1 from '../../assets/images/pic1.jpg';
import massageTherapy2 from '../../assets/images/pic2.jpg';

const Home = () => {
  return (
    <MainLayout>
      <div className="home-container">
        {/* Seccion de imagen */}
        <section className="hero-section" style={{ backgroundImage: `url(${heroOilImage})` }}>
          <div className="hero-overlay"></div>
        </section>

        {/* Seccion principal de masajes*/}
        <section className="bienestar-section">
          <div className="bienestar-container">
            <div className="bienestar-content">
              <h2>Cuida tu bienestar</h2>
              <div className="bienestar-features">
                <div className="feature-item">
                  <FaCheck className="check-icon" />
                  <span>Más de 10 técnicas diferentes (relajantes, descontracturantes, deportivos, etc)</span>
                </div>
                <div className="feature-item">
                  <FaCheck className="check-icon" />
                  <span>Fisioterapeutas especializados</span>
                </div>
                <div className="feature-item">
                  <FaCheck className="check-icon" />
                  <span>Para todos los objetivos y necesidades</span>
                </div>
                <div className="feature-item">
                  <FaCheck className="check-icon" />
                  <span>Sesiones de masaje personalizados</span>
                </div>
              </div>
              <Link to="/plans" className="btn-cta">Ver tarifas</Link>
            </div>
            <div className="images">
              <div className="therapy-image-container">
                <img src={massageTherapy1} alt="Terapia de masajes" className="therapy-image" />
              </div>
              <div className="therapy-image-container">
                <img src={massageTherapy2} alt="Fisioterapia profesional" className="therapy-image" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
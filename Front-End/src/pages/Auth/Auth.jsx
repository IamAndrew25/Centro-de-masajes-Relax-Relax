import React, { useState, useEffect } from 'react';
// Importamos formularios
import LoginForm from './Login'; 
import RegisterForm from './Register';

// Estilos e imagen
import './Auth.css'; 
import sliderImg1 from '../../assets/images/Slider1.jpg';
import sliderImg2 from '../../assets/images/Slider_2.jpg';

const slides = [
  {
    image: sliderImg1,
    text: 'Visita nuestra tienda',
  },
  {
    image: sliderImg2,
    text: 'Descubre ofertas increíbles',
  },
];

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const toggleView = () => setIsLoginView(!isLoginView);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); //Cambio de slider cada 5seg

    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="auth-page">
      <div className={`auth-container ${!isLoginView ? 'register-view' : ''}`}>
        {/* Slider */}
        <div className="slider">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide.image}
              alt="Imagen del carrusel"
              className={`background-slider ${index === currentSlide ? 'active' : ''}`}
            />
          ))}
          <div className="overlay-text">
            <h2>{slides[currentSlide].text}</h2>
            <div className="carousel-dots">
              {slides.map((_, index) => (
                <span key={index} className={`dot ${index === currentSlide ? 'active' : ''}`}></span>
              ))}
            </div>
          </div>
        </div>

        {/* Formulario Login/Registro */}
        {/*La relajacion es el arte de dejar ir, lo que no puedes controlar*/ }
        <div className="form-section">
          {isLoginView ? (
            <LoginForm onToggleView={toggleView} />
          ) : (
            <RegisterForm onToggleView={toggleView} />
          )}
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
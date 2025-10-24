import React from "react";
import MainLayout from "../../layouts/MainLayout";
import "./Plans.css";
import { useNavigate } from "react-router-dom";

import heroImage from "../../assets/images/Banner.jpg";
import packageCouples from "../../assets/images/package-couples.jpg";
import packagePrenatal from "../../assets/images/package-prenatal.jpg";
import packageFather from "../../assets/images/package-father.jpg";
import paqueteEjecutivo from "../../assets/images/package-ejecutivo.jpg";
import paquetePremium from "../../assets/images/package-premium.jpg";


const customPackages = [
  {
    id: 1,
    name: "Masaje para Parejas",
    image: packageCouples,
    price: 165,
    details: [
      "Masaje Relajante",
      "Masaje Descontracturante",
      "Piedras Calientes",
      "Reflexología (60min)"
    ],
    note: "Disponible solo Martes y Miércoles. No aplica otros días de la semana."
  },
  {
    id: 2,
    name: "Ritual Pre Natal",
    image: packagePrenatal,
    price: 140,
    details: [
      "Masaje Pre Natal (60MIN)",
      "Tina de Hidromasajes (20 MIN)",
      "Infusión Herbal"
    ],
    note: "Precio por persona."
  },
  {
    id: 3,
    name: "Promo Día del Padre",
    image: packageFather,
    price: 289,
    details: [
      "Sauna o tina de Hidromasajes (30 min)",
      "Limpieza facial express",
      "Masaje a elección (60 min)"
    ],
    note: "Precio por dos personas. Incluye 02 copas de vino."
  },
  {
    id: 4,
    name: "Paquete Ejecutivo",
    image: paqueteEjecutivo,
    price: "30% Descuento",
    details: ["Hidromasaje", "Masaje relajante", "Limpieza facial", "Exfoliación corporal", "Aperitivo"],
    note: "Promoción disponible todo agosto."
  },
  {
    id: 5,
    name: "Paquete Premium (2x1)",
    image: paquetePremium,
    price: "2x1",
    details: ["Hidromasaje", "Masaje relajante", "Masaje facial", "Exfoliación corporal", "Limpieza y mascarilla facial revitalizante", "Emboltura de miel", "Aperitivo"],
    note: "Promoción disponible todo agosto."
  },
];

// Datos de planes de membresía
const membershipPlans = [
  {
    id: "basic",
    title: "3 meses",
    price: "S/ 90",
    benefits: [
      "Acceso a reservas online sin costo extra",
      "Confirmación inmediata de disponibilidad",
      "5% de descuento en compras de temporada"
    ],
  },
  {
    id: "premium",
    title: "6 meses",
    price: "S/ 160",
    note: "10% ahorro",
    benefits: [
      "Todos los beneficios del Básico",
      "Atención prioritaria en reservas",
      "10% de descuento en paquetes especiales",
      "Acceso anticipado a promociones"
    ],
  },
  {
    id: "vip",
    title: "1 año",
    price: "S/ 350",
    note: "25% ahorro",
    benefits: [
      "Todos los beneficios del Premium",
      "Servicio personalizado",
      "15% de descuento en todos los servicios",
      "Acceso a eventos o experiencias privadas",
      "Regalo de bienvenida exclusivo"
    ],
  },
];

const Plans = () => {
  const navigate = useNavigate();
  const redirectlogin=()=>{
    navigate('/login')
  };

  return (
    <MainLayout>
      <div className="plans-container">
        {/* Hero */}
        <section
          className="hero-section"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="hero-overlay"></div>
          <h1>Planes y Paquetes</h1>
        </section>

        {/* Contenido */}
        <section className="plans-content">
          <div className="plans-grid">

            {/* Paquetes personalizados */}
            <div className="packages-section">
              <h2>Nuestros Paquetes Experiencia</h2>
              <div className="packages-list">
                {customPackages.map((pkg) => (
                  <div key={pkg.id} className="package-card">
                    <div 
                      className="package-image"
                      style={{ backgroundImage: `url(${pkg.image})` }}
                    ></div>

                    <div className="package-details">
                        <h3>{pkg.name}</h3>
                        <p className="package-includes">Incluye:</p>
                        <ul>
                            {pkg.details.map((detail, i) => (
                                <li key={i}>{detail}</li>
                            ))}
                        </ul>
                        <p className="package-note">{pkg.note}</p>
                        <div className="package-footer">
                            <span className="package-price">
                              {typeof pkg.price === 'number'
                                ? `S/ ${pkg.price}`
                                : pkg.price}
                            </span>
                            <button className="cta-button" onClick={redirectlogin}>¡Quiero la Promoción!</button>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Planes de Membresia */}
            <div className="plans clip-shape">
              <h2>Planes de Membresía</h2>
              <div className="plan-options">
                {membershipPlans.map((plan) => (
                  <div key={plan.id} className={`plan-card ${plan.id}`}>
                    <h4>{plan.title}</h4>
                    <p className="price">{plan.price}</p>
                    {plan.note && <small>({plan.note})</small>}
                    <ul>
                      {plan.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                    <button className="btn-plan" onClick={redirectlogin}>¡Quiero este!</button>
                  </div>
                ))}
              </div>

              {/* Medios de pago */}
              <div className="payments">
                <h4>Elige tu medio de pago</h4>
                <div className="icons">
                  <img src="https://img.icons8.com/color/48/visa.png" alt="visa" />
                  <img src="https://img.icons8.com/color/48/mastercard.png" alt="mastercard" />
                  <img src="https://img.icons8.com/color/48/paypal.png" alt="paypal" />
                  <img src="https://img.icons8.com/color/48/cash.png" alt="pagoefectivo" />
                </div>
              </div>

              {/* Aceptacion */}
              <div className="terms">
                <input type="checkbox" id="privacy" />
                <label htmlFor="privacy">
                  He leído y aceptado <a href="/privacy">Política de privacidad</a>
                </label>
              </div>

              {/* Boton Final */}
              <button className="btn-pay">Pagar ahora</button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Plans;

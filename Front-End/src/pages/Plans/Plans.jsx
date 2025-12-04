import React, { useState, useEffect } from "react"; 
import MainLayout from "../../layouts/MainLayout";
import "./Plans.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import axios from "axios"; 

import heroImage from "../../assets/images/Banner.jpg";

// Esta función es para los PLANES
const mapFromBackend = (plan) => {
  const toArraySafe = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { /* no-op */ }
      return v.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    }
    return [];
  };

  return {
    id: plan.id,
    nombre: plan.name,
    descripcion: plan.description,
    precio: plan.price,
    tipo: plan.tipo || 'plan',
    icono: plan.icono || '💠',
    servicios_incluidos: toArraySafe(plan.servicios_incluidos),
    beneficios: toArraySafe(plan.beneficios),
    destacado: !!plan.destacado,
    estado: plan.estado || 'activo',
    duracion: plan.duracion ?? (plan.durationDays ? Math.round(plan.durationDays / 30) : 1),
    duracion_unidad: plan.duracion_unidad || (plan.durationDays ? 'meses' : 'meses'),
    createdAt: plan.createdAt
  };
};


// Esta función es para PROMOCIONES
const mapFromBackendPromotions = (p) => {
  let priceString = "";
  // Formatea el precio/descuento
  if (p.discountPercent > 0) {
    priceString = `${p.discountPercent}% OFF`;
  } else if (p.discountAmount > 0) {
    priceString = `S/ ${p.discountAmount} OFF`;
  } else {
    priceString = "Promo Especial"; 
  }

  const detailsArray = p.description
    ? p.description.split('\n').map(s => s.trim()).filter(s => s.length > 0)
    : [];
  
  // La nota ahora sera la fecha de fin
  const noteString = p.endDate 
    ? `Válido hasta ${new Date(p.endDate).toLocaleDateString('es-ES')}` 
    : "";

  let imageUrl = p.imageUrl;
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/assets')) {
      imageUrl = `http://localhost:8080${imageUrl}`;
    }

  return {
    id: p.id,
    name: p.name,
    image: imageUrl,
    price: priceString,
    details: detailsArray,
    note: noteString,
    active: p.active,
  };
};


const Plans = () => {
  const navigate = useNavigate();
  const {addToCart} = useCart();

  // Estado para Planes de Membresía
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [loadingMemberships, setLoadingMemberships] = useState(true);

  // Estado para Paquetes (Promociones)
  const [customPackages, setCustomPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);


  // Use effect para PLANES
  useEffect(() => {
    const loadPlans = async () => {
      setLoadingMemberships(true);
      try {
        const res = await axios.get('http://localhost:8080/plans');
        const data = Array.isArray(res.data) ? res.data.map(mapFromBackend) : [];
        const activeMemberships = data.filter(p => 
          (p.tipo === 'membresia' || p.tipo === 'vip' || p.tipo === 'plan') && p.estado === 'activo'
        );
        setMembershipPlans(activeMemberships);
      } catch (error) {
        console.error("Error cargando los planes de membresía:", error);
        setMembershipPlans([]); 
      } finally {
        setLoadingMemberships(false);
      }
    };

    loadPlans();
  }, []);

  // Use effect para PROMOCIONES
  useEffect(() => {
    const loadPromotions = async () => {
      setLoadingPackages(true);
      try {
        const res = await axios.get('http://localhost:8080/promotions');
        const data = Array.isArray(res.data) ? res.data.map(mapFromBackendPromotions) : [];
        const activePromotions = data.filter(p => p.active);
        setCustomPackages(activePromotions);
      } catch (error) {
        console.error("Error cargando las promociones:", error);
        setCustomPackages([]);
      } finally {
        setLoadingPackages(false);
      }
    };

    loadPromotions();
  }, []); 

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

            {/* Seccion de paquetes(PROMOCIONES)*/}
            <div className="packages-section">
              <h2>Nuestros Paquetes Experiencia</h2>
              <div className="packages-list">
                
                {loadingPackages ? (
                  <p>Cargando promociones...</p>
                ) : customPackages.length === 0 ? (
                  <p>No hay promociones disponibles en este momento.</p>
                ) : (
                  customPackages.map((pkg) => (
                    <div key={pkg.id} className="package-card">
                      <div 
                        className="package-image"
                        style={{ backgroundImage: `url(${pkg.image})` }}
                      ></div>

                      <div className="package-details">
                          <h3>{pkg.name}</h3>
                          
                          {pkg.details && pkg.details.length > 0 && (
                            <p className="package-includes">Incluye:</p>
                          )}
                          
                          <ul>
                              {pkg.details.map((detail, i) => (
                                  <li key={i}>{detail}</li>
                              ))}
                          </ul>
                          
                          {/* Muestra la nota (fecha de fin) solo si existe */}
                          {pkg.note && (
                            <p className="package-note">{pkg.note}</p>
                          )}
                          
                          <div className="package-footer">
                              <span className="package-price">
                                {pkg.price}
                              </span>
                              <button className="cta-button" onClick={() => addToCart(pkg)}>¡Quiero la Promoción!</button>
                          </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Seccion de membresias */}
            <div className="plans clip-shape">
              <h2>Planes de Membresía</h2>
              <div className="plan-options">
                
                {loadingMemberships ? (
                  <p>Cargando planes...</p>
                ) : (
                  membershipPlans.map((plan) => (
                    <div key={plan.id} className={`plan-card ${plan.tipo}`}>
                      <h4>{plan.nombre}</h4>
                      
                      <p className="price">
                        S/ {plan.precio}
                        {plan.duracion && plan.duracion_unidad && (
                          <span style={{ fontSize: '0.8em', fontWeight: 400, marginLeft: '5px' }}>
                            / {plan.duracion} {plan.duracion === 1 ? plan.duracion_unidad.replace("es", "") : plan.duracion_unidad}
                          </span>
                        )}
                      </p>
                      
                      {plan.descripcion && plan.descripcion !== plan.nombre && (
                        <small>({plan.descripcion})</small>
                      )}
                      
                      {(plan.servicios_incluidos && plan.servicios_incluidos.length > 0) && (
                        <>
                          <p style={{ margin: '10px 0 5px', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'left', paddingLeft: '10px' }}>
                            Servicios Incluidos:
                          </p>
                          <ul>
                            {(plan.servicios_incluidos || []).map((servicio, i) => (
                              <li key={`svc-${i}`}>{servicio}</li>
                            ))}
                          </ul>
                        </>
                      )}
                      
                      {(plan.beneficios && plan.beneficios.length > 0) && (
                         <>
                          <p style={{ margin: '10px 0 5px', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'left', paddingLeft: '10px' }}>
                            Beneficios:
                          </p>
                          <ul>
                            {(plan.beneficios || []).map((benefit, i) => (
                              <li key={`bft-${i}`}>{benefit}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      <button className="btn-plan" onClick={() => addToCart({ ...plan, name: plan.nombre })}>¡Quiero este!</button>
                    </div>
                  ))
                )}
                {!loadingMemberships && membershipPlans.length === 0 && (
                  <p>No hay planes de membresía disponibles en este momento.</p>
                )}

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

              <div className="terms">
                <input type="checkbox" id="privacy" />
                <label htmlFor="privacy">
                  He leído y aceptado <a href="/privacy">Política de privacidad</a>
                </label>
              </div>

            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Plans;
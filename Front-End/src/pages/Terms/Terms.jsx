import React from "react";
import MainLayout from "../../layouts/MainLayout";
import "./Terms.css";

const Terms = () => {
  return (
    <MainLayout>
      <div className="terms-container">
      {/* Hero */}
      <section className="terms-hero">
        <h1>Términos y Condiciones</h1>
        <p>Bienvenido a Relax Total</p>
      </section>

      {/* Contenido */}
      <section className="terms-content">
        <div className="terms-wrapper">
          <section>
            <h2>1. Aceptación de los términos</h2>
            <p>
              Al acceder a nuestro sitio web y contratar los servicios de Relax
              Total, aceptas los presentes términos y condiciones en su
              totalidad.
            </p>
          </section>

          <section>
            <h2>2. Servicios</h2>
            <p>
              Relax Total ofrece servicios de masajes terapéuticos y de
              bienestar. Todos los servicios están sujetos a disponibilidad y
              deben reservarse con anticipación a través de nuestra plataforma.
            </p>
          </section>

          <section>
            <h2>3. Reservas y cancelaciones</h2>
            <ul>
              <li>
                Las reservas se confirman mediante nuestra plataforma web.
              </li>
              <li>
                Puedes cancelar o reprogramar tu cita con al menos 24 horas de
                anticipación.
              </li>
              <li>
                La falta de asistencia sin notificación previa puede generar
                cargos adicionales.
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Uso adecuado</h2>
            <p>
              Nuestros servicios son exclusivamente terapéuticos y de bienestar.
              Cualquier uso indebido de las instalaciones o conducta inapropiada
              será motivo de cancelación inmediata del servicio.
            </p>
          </section>

          <section>
            <h2>5. Limitación de responsabilidad</h2>
            <p>
              Relax Total no se responsabiliza por reacciones adversas que
              resulten de condiciones médicas no informadas previamente por el
              cliente.
            </p>
          </section>

          <section>
            <h2>6. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de actualizar o modificar estos términos
              en cualquier momento. Las modificaciones entrarán en vigor una vez
              publicadas en nuestro sitio web.
            </p>
          </section>

          {/* CTA */}
          <div className="terms-cta">
            <a href="/" className="terms-btn-back">
              Volver al inicio
            </a>
          </div>
        </div>
      </section>
    </div>
    </MainLayout>
  );
};

export default Terms;
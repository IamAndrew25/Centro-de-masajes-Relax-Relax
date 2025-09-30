import React from "react";
import MainLayout from "../../layouts/MainLayout";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <MainLayout>
      <div className="privacy-container">
      {/* Hero */}
      <section className="privacy-hero">
        <h1>Política de Privacidad</h1>
        <p>Tu confianza es lo más importante para Relax Total</p>
      </section>

      {/* Contenido */}
      <section className="privacy-content">
        <div className="privacy-wrapper">
          <section>
            <h2>1. Información que recopilamos</h2>
            <p>
              En Relax Total valoramos tu privacidad. Recopilamos información
              personal solo cuando es necesaria para brindarte un mejor servicio,
              como tu nombre, correo electrónico, teléfono y datos relacionados
              con la reserva de citas.
            </p>
          </section>

          <section>
            <h2>2. Uso de la información</h2>
            <p>
              La información recolectada se utiliza exclusivamente para:
            </p>
            <ul>
              <li>Procesar tus reservas de masajes y servicios.</li>
              <li>Brindarte atención personalizada.</li>
              <li>Enviar notificaciones sobre promociones o recordatorios.</li>
            </ul>
          </section>

          <section>
            <h2>3. Protección de datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger tu información contra accesos no autorizados, alteraciones
              o divulgaciones indebidas.
            </p>
          </section>

          <section>
            <h2>4. Compartir información</h2>
            <p>
              No compartimos tu información personal con terceros, salvo que sea
              necesario por obligaciones legales o para cumplir con los servicios
              contratados.
            </p>
          </section>

          <section>
            <h2>5. Tus derechos</h2>
            <p>
              Puedes solicitar en cualquier momento la actualización, corrección o
              eliminación de tus datos personales enviando un correo a:{" "}
              <strong>contacto@relaxtotal.com</strong>
            </p>
          </section>

          {/* CTA */}
          <div className="privacy-cta">
            <a href="/" className="privacy-btn-back">
              Volver al inicio
            </a>
          </div>
        </div>
      </section>
    </div>
    </MainLayout>
  );
};

export default PrivacyPolicy;

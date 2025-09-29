import React from "react";
import { FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Información */}
        <div className="footer-section">
          <h3>Centro de Masajes</h3>
          <p>Av. El buen masaje Miraflores - Lima, Perú</p>
          <p>Teléfono: +51 922 955 336</p>
          <p>Email: contacto@relaxtotal.com</p>
        </div>

        {/* Métodos de pago */}
        <div className="footer-section">
          <h4>Métodos de pago</h4>
          <div className="payment-icons">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcPaypal />
          </div>
        </div>

        {/* Reclamaciones */}
        <div className="footer-section">
          <h4>Atención al cliente</h4>
          <ul>
            {/*Para añadir mas links*/} 
            <li><a href="/claims">Libro de Reclamaciones</a></li>
            <li><a href="/privacy">Política de Privacidad</a></li>
            <li><a href="/terms">Términos y Condiciones</a></li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div className="footer-section">
          <h4>Síguenos</h4>
          <div className="social-icons">{/* Estaba probando estos iconos */}
            <a href="#"><img src="https://img.icons8.com/ios-filled/30/facebook-new.png" alt="Facebook" /></a>
            <a href="#"><img src="https://img.icons8.com/ios-filled/30/instagram-new.png" alt="Instagram" /></a>
            <a href="#"><img src="https://img.icons8.com/ios-filled/30/whatsapp.png" alt="WhatsApp" /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        {/* Toma la fecha actual */}
        <p>© {new Date().getFullYear()} Relax Total. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;

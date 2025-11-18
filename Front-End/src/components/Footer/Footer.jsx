import React from "react";
import { FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa";
import "./Footer.css";
import { getBusinessBasics } from "../../pages/Admin/components/JS/businessConfigService";


const Footer = () => {
  const [businessInfo, setBusinessInfo] = React.useState({
    nombreSpa: "Relax Total",
    direccion: "Av. El buen masaje, Miraflores - Lima, Perú",
    telefono: "+51 922 955 336",
    email: "contacto@relaxtotal.com",
  });

  React.useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const data = await getBusinessBasics(); // { nombreSpa, direccion, telefono, email }
        setBusinessInfo((prev) => ({
          ...prev,
          ...data,
        }));
      } catch (err) {
        console.error("Error al cargar info del footer:", err);
        // Si falla, se quedan los valores por defecto
      }
    };

    fetchBusinessInfo();
  }, []);

  const currentYear = new Date().getFullYear();
  const nombreSpa = businessInfo.nombreSpa || "Relax Total";
  const email = businessInfo.email || "contacto@relaxtotal.com";

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Información */}
        <div className="footer-section">
          <h3>Centro de Masajes {nombreSpa}</h3>
          <p>{businessInfo.direccion}</p>
          <p>Teléfono: {businessInfo.telefono}</p>
          <p>
            Email:{" "}
            <a href={`mailto:${email}`}>
              {email}
            </a>
          </p>
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

        {/* Atención al cliente */}
        <div className="footer-section">
          <h4>Atención al cliente</h4>
          <ul>
            <li>
              <a href={`mailto:${email}`}>Escríbenos</a>
            </li>
            <li><a href="/claims">Libro de Reclamaciones</a></li>
            <li><a href="/privacy">Política de Privacidad</a></li>
            <li><a href="/terms">Términos y Condiciones</a></li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div className="footer-section">
          <h4>Síguenos</h4>
          <div className="social-icons">
            <a href="#">
              <img
                src="https://img.icons8.com/ios-filled/30/facebook-new.png"
                alt="Facebook"
              />
            </a>
            <a href="#">
              <img
                src="https://img.icons8.com/ios-filled/30/instagram-new.png"
                alt="Instagram"
              />
            </a>
            <a href="#">
              <img
                src="https://img.icons8.com/ios-filled/30/whatsapp.png"
                alt="WhatsApp"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} {nombreSpa}. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
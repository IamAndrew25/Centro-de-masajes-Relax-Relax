
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";




const Footer = () => (
  <footer className="footer">
      <div className="footer-container" style={{
        display:'flex',
        justifyContent:'center',
        alignItems:'flex-start',
        gap:'60px',
        padding:'60px 0 30px 0',
        background:'#333',
        color:'#fff',
        fontSize:'1.15rem',
        minHeight:'200px'
      }}>
      <div className="footer-section" style={{minWidth:220, lineHeight:'2'}}>
            <p className="footer-title" style={{color:'#ff7f27',fontWeight:'bold',marginBottom:10}}>
          Centro de Masajes
        </p>
        <p>Av. El buen masaje Miraflores - Lima, Perú</p>
        <p>Teléfono: +51 922 955 336</p>
        <p>Email: contacto@relaxtotal.com</p>
      </div>
  <div className="footer-section" style={{minWidth:180, lineHeight:'2'}}>
            <p className="footer-title" style={{color:'#ff7f27',fontWeight:'bold',marginBottom:10}}>Métodos de pago</p>
        <div className="footer-payments">
                  <FaCcVisa size={32} title="Visa" style={{marginRight:10, color:'#fff', background:'#222', borderRadius:4, padding:2}} />
                  <FaCcMastercard size={32} title="Mastercard" style={{marginRight:10, color:'#fff', background:'#222', borderRadius:4, padding:2}} />
                  <FaCcAmex size={32} title="American Express" style={{color:'#fff', background:'#222', borderRadius:4, padding:2}} />
        </div>
      </div>
  <div className="footer-section" style={{minWidth:220, lineHeight:'2'}}>
            <p className="footer-title" style={{color:'#ff7f27',fontWeight:'bold',marginBottom:10}}>Atención al cliente</p>
        <ul>
          <li>Libro de Reclamaciones</li>
          <li>Política de Privacidad</li>
          <li>Términos y Condiciones</li>
        </ul>
      </div>
  <div className="footer-section" style={{minWidth:120, lineHeight:'2'}}>
            <p className="footer-title" style={{color:'#ff7f27',fontWeight:'bold',marginBottom:10}}>Síguenos</p>
  <div className="footer-social" style={{display:'flex',alignItems:'center',gap:'20px'}}>
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook size={24} style={{color:'#fff'}} /></a>
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram size={24} style={{color:'#fff'}} /></a>
  <a href="https://wa.me/51922955336" target="_blank" rel="noopener noreferrer"><FaWhatsapp size={24} style={{color:'#fff'}} /></a>
  </div>
      </div>
    </div>
  </footer>
);

export default Footer;

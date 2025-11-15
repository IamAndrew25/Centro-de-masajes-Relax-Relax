import { useState } from "react";
import { toast } from 'react-toastify'; 
import '../Auth.css'; 

export default function ForgotPassword({ onClose }) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Error desconocido");
      }
      toast(
        `El enlace fue enviado al correo ${email}. Revise su bandeja de entrada.`, 
        {
          position: "top-center",
          autoClose: 3500,
          hideProgressBar: true, //toast personalizado solo para este caso
          closeButton: false,
          pauseOnHover: true,
          draggable: true,
          style: {                     
            backgroundColor: '#383838',
            color: '#FFFFFF',
            border: '1px solid #505050'
          },
        }
      );

      onClose();
      
    } catch (err) {
      toast.error(err.message || "Error al enviar correo.");
      console.error(err);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="form-inner-container" style={{ width: '100%', maxWidth: 'none', margin: 0 }}>
          
          <h2 className="form-title">Recuperar Contraseña</h2>
          <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Ingresa tu correo electrónico y te enviaremos un enlace para reestablecer tu contraseña.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="email-modal">Correo Electrónico</label>
              <input
                id="email-modal"
                className="auth-input"
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-action-button" style={{ marginTop: '1rem' }}>
              Enviar correo
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
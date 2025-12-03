import { useState } from "react";
import { useSearchParams, NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { FiLock } from "react-icons/fi";
import '../Auth.css';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token"); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (newPassword.length < 6) {
      toast.warn("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warn("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await fetch("http://3.16.225.135:8080/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error desconocido");
      }

      toast.success(data.message || "¡Contraseña actualizada con éxito!");
      //Redirige al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      toast.error(err.message || "Error al actualizar contraseña. El token puede ser inválido o haber expirado.");
      console.error(err);
    }
  };

  return (
    <div className="auth-page">
      <div className="reset-card-container">
        <div className="form-inner-container" style={{ width: '100%', maxWidth: 'none', margin: 0 }}>
          <FiLock size={40} className="auth-icon" />
          <h2 className="form-title" style={{ textAlign: 'center' }}>
            Reestablecer Contraseña
          </h2>
          <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5', textAlign: 'center' }}>
            Ingresa tu nueva contraseña. Asegúrate de que sea segura.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="newPassword">Nueva Contraseña</label>
              <input
                id="newPassword"
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-label" htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-action-button" style={{ marginTop: '1rem' }}>
              Actualizar contraseña
            </button>
          </form>

          <div className="auth-signup-link" style={{ marginTop: '1.5rem' }}>
            <NavLink to="/login" className="auth-toggle-link">
              Regresar al login
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
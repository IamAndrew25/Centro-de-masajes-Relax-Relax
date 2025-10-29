import { useState } from "react";
import { useSearchParams} from "react-router-dom"; // Para leer ?token=...
import { NavLink } from 'react-router-dom';


export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token"); // token de la URL
    const [setMenuOpen] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      setMessage(data.message || "Contraseña actualizada!");
    } catch (err) {
      setMessage("Error al actualizar contraseña.");
      console.error(err);
    }
  };
    const closeMenu = () => {
    setMenuOpen(false);
  }

  return (
    <div className="reset-password-container">
      <h2>Cambiar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Actualizar contraseña</button>
      </form>
      {message && <p>{message}</p>}
      <NavLink to="/login" className="nav-link nav-cta" onClick={closeMenu}>Regresar al login</NavLink>
    </div>
  );
}

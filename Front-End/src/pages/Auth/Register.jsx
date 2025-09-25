import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { register } from '../../api/authApi';

const Register = ({ onToggleView }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError("Debes aceptar la política de privacidad y los términos.");
      return;
    }

    setLoading(true);
    try {
      const response = await register({
        fullName,
        phone,
        dni,
        email,
        password,
      });
      console.log("Registro exitoso:", response);
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      onToggleView(); // volver al login tras registrarse
    } catch (error) {
      console.error("Error en registro:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Error en el registro. Verifica tus datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-inner-container">
      <button onClick={onToggleView} className="back-link">
        <IoIosArrowBack size={18} /> Regresar
      </button>

      <h1 className="form-title">¡A por los buenos masajes, Únete!</h1>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="fullName">Nombre completo</label>
          <input type="text" id="fullName" placeholder="Barney tu papá"
            value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="phone">Teléfono</label>
          <input type="tel" id="phone" placeholder="9894594487"
            value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="dni">DNI</label>
          <input type="text" id="dni" placeholder="Ej. 12345678A"
            value={dni} onChange={(e) => setDni(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Ingresa tu correo"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" placeholder="Ingresa tu contraseña"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="privacy-policy">
          <input type="checkbox" id="privacy"
            checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <label htmlFor="privacy">
            Acepto la <a href="/privacy">Política de privacidad</a> y los <a href="/terms">Términos y condiciones*</a>
          </label>
        </div>
        <button type="submit" className="action-button" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
      <div className="signup-link">
        Ya tienes una cuenta?{' '}
        <span onClick={onToggleView} className="toggle-link">Inicia sesión</span>
      </div>
    </div>
  );
};

export default Register;

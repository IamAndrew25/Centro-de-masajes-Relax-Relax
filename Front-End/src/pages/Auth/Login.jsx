import React, { useState } from 'react';
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { TfiMicrosoftAlt } from "react-icons/tfi";
import logo from '../../assets/images/logo.png';
import { login } from '../../api/authApi';

const Login = ({ onToggleView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login({ email, password });
      console.log("Login exitoso:", response);

      if (response.token) {
        localStorage.setItem("token", response.token);
        window.location.href='/home';
        // Aquí podrías redirigir al usuario a otra página, por ejemplo:
        // window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error("Error en login:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-inner-container">
      <img src={logo} alt="Logo de la empresa" className="logo" />
      <h1 className="welcome-message">Hola, me alegra que estes de vuelta</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Ingresa tu correo"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="password">
            Contraseña
            <a href="/forgot-password" className="forgot-password">¿Has olvidado tu contraseña?</a>
          </label>
          <input type="password" id="password" placeholder="Ingresa tu contraseña"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="remember-me">
          <input type="checkbox" id="recordarme" />
          <label htmlFor="recordarme">Recordarme</label>
        </div>
        <button type="submit" className="action-button" disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar sesión'}
        </button>
      </form>
      <div className="separator">O continúa con</div>
      <div className="social-login">
        <button className="social-button"><FaGoogle size={20} /> Google</button>
        <button className="social-button"><FaFacebook size={20} /> Facebook</button>
        <button className="social-button"><TfiMicrosoftAlt size={20} /> Microsoft</button>
      </div>
      <div className="signup-link">
        Todavía no tienes una cuenta?{' '}
        <span onClick={onToggleView} className="toggle-link">Únete!!</span>
      </div>
    </div>
  );
};

export default Login;

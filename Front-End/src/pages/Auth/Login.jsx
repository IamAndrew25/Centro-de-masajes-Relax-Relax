import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { TfiMicrosoftAlt } from "react-icons/tfi";
import logo from '../../assets/images/logo.png';
import { login } from '../../api/authApi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


const Login = ({ onToggleView }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones del lado del cliente
    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, ingresa un formato de correo válido.");
      return;
    }

    setLoading(true);
    try {
      const response = await login({ email, password });
      console.log("Login exitoso:", response);

      if (response.token) {
        localStorage.setItem("token", response.token);
        // Redirigir según el rol del usuario
        if (response.roleName === 'ADMIN') { // Verifica si el rol es ADMIN
          navigate('/admin'); // Redirige a la página de admin
        } else {
          navigate('/home'); // Redirige a la pagina de inicio para otros roles
        }
      }
    } catch (error) {
      console.error("Error en login:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-inner-container">
      <img src={logo} alt="Logo de la empresa" className="logo" />
      <h1 className="welcome-message">Hola, me alegra que estes de vuelta</h1>
      {error && <p className="auth-error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label htmlFor="email" className="auth-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />
        </div>
        <div className="auth-input-group">
          <label htmlFor="password" className="auth-label">
            Contraseña
            <Link to="/ForgotPassword" className="auth-forgot-password">
              ¿Has olvidado tu contraseña?
            </Link>
          </label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />
        </div>
        <div className="auth-remember-me">
          <input type="checkbox" id="recordarme" />
          <label htmlFor="recordarme">Recordarme</label>
        </div>
        <button type="submit" className="auth-action-button" disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar sesión'}
        </button>
      </form>
      <div className="auth-separator">O continúa con</div>
      <div className="auth-social-login">
        <button className="auth-social-button"><FaGoogle size={20} /> Google</button>
        <button className="auth-social-button"><FaFacebook size={20} /> Facebook</button>
        <button className="auth-social-button"><TfiMicrosoftAlt size={20} /> Microsoft</button>
      </div>
      <div className="auth-signup-link">
        Todavía no tienes una cuenta?{' '}
        <span onClick={onToggleView} className="auth-toggle-link">Únete!!</span>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { register } from '../../api/authApi';

const Register = ({ onToggleView }) => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  //Restricciones de nombre
  const handleUsername = (e) => {
    const value = e.target.value;
    // Limita la longitud a 20 caracteres
    if (value.length <= 30) {
      setUsername(value);
    }
  };
  //Restricciones de dni
  const handlePhone = (e) => {
    const value = e.target.value;
    //Permite solo números y un campo vacio
    if (value === '' || /^[0-9\b]+$/.test(value)&& value.length <= 9) {
      setPhone(value);
    }
  };

  //Restricciones de dni
  const handleDni = (e) => {
    const value = e.target.value;
    // Permite solo números, un campo vacio y limita la longitud a 8
    if ((value === '' || /^[0-9\b]+$/.test(value)) && value.length <= 8) {
      setDni(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones del lado del cliente
    if (!username || !phone || !dni || !email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    if (username.length > 30) {
      setError("El nombre no debe exceder los 30 caracteres.");
      return;
    }
    if (phone.length !== 9) {
      setError("El numero de celular debe tener exactamente 9 dígitos.");
      return;
    }
    if (dni.length !== 8) {
      setError("El DNI debe tener exactamente 8 dígitos.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, ingresa un formato de correo válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (!agreed) {
      setError("Debes aceptar la política de privacidad y los términos.");
      return;
    }

    setLoading(true);
    try {
      const response = await register({
        username,
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
          <label htmlFor="username">Nombre completo</label>
          <input type="text" id="username" placeholder="Barney tu papá"
            value={username} onChange={handleUsername} />
        </div>
        <div className="input-group">
          <label htmlFor="phone">Teléfono</label>
          <input type="tel" id="phone" placeholder="Ejm. 95321687"
            value={phone} onChange={handlePhone} />
        </div>
        <div className="input-group">
          <label htmlFor="dni">DNI</label>
          <input type="text" id="dni" placeholder="Ejm. 75248632"
            value={dni} onChange={handleDni} />
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
            Acepto la <Link to="/privacy">Política de privacidad</Link> y los <Link to="/terms">Términos y condiciones*</Link>
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

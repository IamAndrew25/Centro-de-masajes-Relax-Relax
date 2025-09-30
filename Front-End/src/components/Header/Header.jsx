import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from "react-icons/fa";
import './Header.css';

const Header = () => {
  // Estado para controlar el menu, toggle para estados activo o inactivo
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {setMenuOpen(!menuOpen);};

  return (
    <header className="header">
      <div className="header-container">
        {/* Sección para el logo del sitio. Lo he envuelto en un NavLink para que redirija al inicio */}
        <div className="logo">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            <h1>Relax Total</h1>
          </NavLink>
        </div>

        {/* Boton Hamburguesa */}
        {/* Al hacer clic, se ejecuta la función 'toggleMenu' */}
        <div className="menu-icon" onClick={toggleMenu}>
          {/* Si 'menuOpen' es true, muestra el icono de cierre */}
          {/* Si es false, muestra el icono de hamburguesa */}
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Menu */}
        {/* La clase 'active' se añade condicionalmente si 'menuOpen' es true, */}
        {/* lo que permite mostrar u ocultar el menu con CSS. */}
        <nav className={`nav ${menuOpen ? "active" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={toggleMenu}>Reserva</NavLink>
          <NavLink to="/planes" className="nav-link" onClick={toggleMenu}>Planes</NavLink>
          <NavLink to="/nosotros" className="nav-link" onClick={toggleMenu}>Nosotros</NavLink>
          <NavLink to="/login" className="nav-link nav-cta" onClick={toggleMenu}>Inicia sesión</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;

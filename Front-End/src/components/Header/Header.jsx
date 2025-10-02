import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBars, FaTimes } from "react-icons/fa"; 
import { AiOutlineShoppingCart } from "react-icons/ai"; 
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [cartItems] = useState([
    { id: 1, name: "Plan Individual - 3 meses", price: 28 },
    { id: 2, name: "Plan Parejas - 6 meses", price: 49 }
  ]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) setIsDropdownOpen(false); 
  };
  
  const toggleCart = () => setCartOpen(!cartOpen);

  const closeMenu = () => {
    setMenuOpen(false);
  }

  const serviceCategories = [

    { name: "Masajes", path: "/servicios/masajes" }, 
    { name: "Experiencias", path: "/servicios/experiencias" }, 
    { name: "Planes & Membresías", path: "/servicios/planes" }, 

  ];

  // Determina las clases CSS del ítem de Servicios
  const dropdownClass = `nav-link dropdown-item ${isMobile && isDropdownOpen ? 'mobile-open' : ''}`;


  const handleDropdownInteraction = () => {
    if (isMobile) {
      // En móvil: Alternar el estado al hacer clic 
      setIsDropdownOpen(!isDropdownOpen);
    } 
  };


  return (
    <>
      <header className="header">
        <div className="header-container">
          
          {/* Logo */}
          <div className="logo">
            <NavLink to="/" onClick={closeMenu}>
              <h1>Relax Total</h1>
            </NavLink>
          </div>

          {/* Icono Hamburguesa */}
          <div className="menu-icon" onClick={toggleMenu}>
            {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </div>

          {/* Navegación + Carrito */}
          <nav 
            className={`nav ${menuOpen ? "active" : ""}`} 
            onMouseLeave={() => {
              if (!isMobile) setIsDropdownOpen(false);
            }}
          >
            
            <NavLink to="/reserva" className="nav-link" onClick={closeMenu}>Reserva</NavLink>
            
            {/* MENÚ DESPLEGABLE DE SERVICIOS */}
            <div 
              className={dropdownClass}
              onMouseEnter={() => {
                if (!isMobile) setIsDropdownOpen(true); 
              }}
              onClick={handleDropdownInteraction}
            >
              <div className="dropdown-title">
                <span>Servicios</span>
              </div>
              
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  {serviceCategories.map((category, index) => (
                    <li key={index}>
                      <Link 
                        to={category.path} 
                        onClick={() => {
                          closeMenu(); 
                          setIsDropdownOpen(false);
                        }}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <NavLink to="/nosotros" className="nav-link" onClick={closeMenu}>Nosotros</NavLink>
            
            <NavLink to="/login" className="nav-link nav-cta" onClick={closeMenu}>Inicia sesión</NavLink>

            {/* Carrito dentro del nav */}
            <div className="cart-icon" onClick={toggleCart}>
              <AiOutlineShoppingCart size={24} /> 
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Sidebar Carrito */}
      <div className={`cart-sidebar ${cartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Tu carrito</h2>
          <FaTimes size={22} className="close-cart" onClick={toggleCart} /> 
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <p>Tu carrito está vacío</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <p>{item.name}</p>
                <span>${item.price}</span>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <button className="checkout-btn">Pagar ahora</button>
        )}
      </div>
    </>
  );
};

export default Header;
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from "react-icons/fa"; 
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from '../../context/cartContext';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItems, removeFromCart, cartItemCount, totalCartPrice } = useCart();

  useEffect(() => {
    // Comprueba si hay un token en localStorage para saber si el usuario inició sesión
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoggedIn]); // Se ejecuta cuando el estado de login cambia

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) setIsDropdownOpen(false); 
  };
  
  const toggleCart = () => setCartOpen(!cartOpen);
  const closeMenu = () => { setMenuOpen(false);}

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsUserDropdownOpen(false);
    closeMenu();
    navigate('/home'); // Redirige al inicio
  };


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
            
            {/* Menu de servicios */}
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
            <NavLink to="/contact" className="nav-link" onClick={closeMenu}>Contacto</NavLink>


            {isLoggedIn ? (
              <div className="nav-link user-menu">
                <span onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="nav-cta-logged-in">
                  Bienvenido
                </span>
                {isUserDropdownOpen && (
                  <ul className="dropdown-menu user-dropdown">
                    <li>
                      <Link to="#" onClick={handleLogout}>
                        Cerrar Sesión
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="nav-link nav-cta" onClick={closeMenu}>
                Inicia sesión
              </NavLink>
            )}

            {/* Carrito dentro del nav */}
            <div className="cart-icon" onClick={toggleCart}>
              <AiOutlineShoppingCart size={24} /> 
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
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
          {cartItemCount === 0 ? (
            <p>Tu carrito está vacío</p>
          ) : (
            cartItems.map(item => {
              const rawPrice = item.precio !== undefined ? item.precio : item.price;

              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-details">
                    <p>{item.name || item.title}</p>
                    
                    <span>
                      {typeof rawPrice === 'number'
                        ? `S/ ${rawPrice.toFixed(2)}`
                        : rawPrice // Mostrar '30% Descuento' o '2x1' tal cual
                      }
                    </span>

                  </div>
                  {/*Boton para eliminar */}
                  <FaTimes 
                    size={18} 
                    className="cart-item-remove" 
                    onClick={() => removeFromCart(item.id)}
                  />
                </div>
              );
            })
          )}
        </div>
        {cartItemCount > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <strong>Total:</strong>
              <strong>S/ {totalCartPrice.toFixed(2)}</strong>
            </div>
            {/* Futura pag de checkout */}
            <button 
              className="checkout-btn" 
              onClick={() => {
                navigate('/checkout'); // Navegamos a la página de pago
                toggleCart(); // Cerramos el carrito
              }}
            >
              Pagar ahora
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
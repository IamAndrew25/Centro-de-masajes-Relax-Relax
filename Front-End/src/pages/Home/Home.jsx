import React from 'react';
import './Home.css';

// Importar imágenes desde public
const paginaPrincipal = '/pagina_principal.png';
const textoImg = '/texto.png';
const p1c = '/p1c.png';
const p2c = '/p2c.png';
const rectangle14 = '/Rectangle14.png';

const Home = ({ onLogin }) => {
    return (
        <div className="home-container">
            {/* Header/Navegación */}
            <header className="header">
                <div className="container">
                    <div className="logo">
                        <h1>Relax Total</h1>
                    </div>
                    <nav className="navigation">
                        <a 
                            href="#" 
                            className="nav-link"
                            onMouseEnter={(e) => {
                                e.target.style.backgroundImage = `url(${rectangle14})`;
                                e.target.style.backgroundSize = 'cover';
                                e.target.style.backgroundPosition = 'center';
                                e.target.style.backgroundRepeat = 'no-repeat';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundImage = 'none';
                                e.target.style.color = '#2c3e50';
                            }}
                        >
                            Reserva
                        </a>
                        <a 
                            href="#" 
                            className="nav-link active"
                            onMouseEnter={(e) => {
                                e.target.style.backgroundImage = `url(${rectangle14})`;
                                e.target.style.backgroundSize = 'cover';
                                e.target.style.backgroundPosition = 'center';
                                e.target.style.backgroundRepeat = 'no-repeat';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundImage = 'none';
                                e.target.style.color = '#2c3e50';
                            }}
                        >
                            Planes
                        </a>
                        <a 
                            href="#" 
                            className="nav-link"
                            onMouseEnter={(e) => {
                                e.target.style.backgroundImage = `url(${rectangle14})`;
                                e.target.style.backgroundSize = 'cover';
                                e.target.style.backgroundPosition = 'center';
                                e.target.style.backgroundRepeat = 'no-repeat';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundImage = 'none';
                                e.target.style.color = '#2c3e50';
                            }}
                        >
                            Nosotros
                        </a>
                        <a 
                            href="#" 
                            className="nav-link"
                            onClick={(e) => {
                                e.preventDefault();
                                // Aquí se conectará con tu sistema de login real
                                // Por ahora, simulamos un prompt simple
                                const userType = prompt("Ingrese tipo de usuario:\n- 'admin' para administrador\n- 'client' para cliente");
                                if (userType === 'admin' || userType === 'client') {
                                    onLogin && onLogin(userType);
                                }
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundImage = `url(${rectangle14})`;
                                e.target.style.backgroundSize = 'cover';
                                e.target.style.backgroundPosition = 'center';
                                e.target.style.backgroundRepeat = 'no-repeat';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundImage = 'none';
                                e.target.style.color = '#2c3e50';
                            }}
                        >
                            Iniciar sesión
                        </a>
                    </nav>
                </div>
            </header>

            {/* Sección Hero - Imagen ocupa todo el ancho */}
            <section className="hero">
                <div className="hero-image">
                    <img src={paginaPrincipal} alt="Masaje con aceites esenciales" />
                </div>
            </section>

            {/* Sección de Contenido Principal - Fondo oscuro desde la mitad hacia abajo */}
            <section className="main-content">
                <div className="content-wrapper">
                    <div className="content-inner">
                        {/* Imagen de texto al lado izquierdo */}
                        <div className="text-image">
                            <img src={textoImg} alt="Texto informativo" />
                        </div>
                        {/* Galería de imágenes al lado derecho */}
                        <div className="image-gallery">
                            <div className="image-item image-top">
                                <img src={p2c} alt="Terapia de masajes" />
                            </div>
                            <div className="image-item image-bottom">
                                <img src={p1c} alt="Masaje relajante" />
                            </div>
                        </div>
                    </div>
                    {/* Botón Ver tarifas */}
                    <button 
                        className="ver-tarifas-button"
                        style={{
                            backgroundImage: `url(${rectangle14})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            color: '#2c3e50'
                        }}
                    >
                        Ver tarifas
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;

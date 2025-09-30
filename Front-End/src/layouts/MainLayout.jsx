import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Main.css';

//children representa un elemento o componente que se anide dentro de MainLayout cuando se use
const MainLayout = ({ children }) => {
  return (
    // Contenedor principal que envuelve toda la estructura de la pagina
    <div className="main-layout">
      {/* Renderiza el componente Header */}
      <Header />

      {/* Define el contenido de la pagina */}
      <main className="main-content">
        {/* Aqui se renderizará el contenido de la pagina */}
        {/* Inicio, Nosotros, etc */}
        {children}
      </main>

      {/* Renderiza el componente Footer*/}
      <Footer />
    </div>
  );
};

// Exporta el componente para que sea usado en todo el proyecto
export default MainLayout;
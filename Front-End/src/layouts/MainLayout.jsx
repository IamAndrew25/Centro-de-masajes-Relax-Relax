import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import logo from '../assets/images/logo.png';

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

      <FloatingWhatsApp
        phoneNumber="+51922955336"
        accountName="Relax Total"
        allowEsc={true}           
        allowClickAway={true}     
        notification={true}       
        notificationSound={false} 
        avatar={logo}             
        chatMessage="¡Hola! 👋 ¿Cómo podemos ayudarte hoy?"
        placeholder="Escribe tu mensaje..."
        statusMessage="Normalmente responde en 1 hora"
      />
    </div>
  );
};

// Exporta el componente para que sea usado en todo el proyecto
export default MainLayout;
import { BrowserRouter, Routes, Route } from "react-router";
import Auth from "../pages/Auth/Auth";
import Home from "../pages/Home/Home";
import Us from "../pages/Us/Us";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import Terms from "../pages/Terms/Terms";
import Claims from "../pages/Claims/Claims"; 
import Plans from "../pages/Plans/Plans"; 
import Services from "../pages/Services/Services";
import Experiences from "../pages/Experiences/Experiences";
import Reservation from "../pages/Reservation/Reservation";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Principales */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/nosotros" element={<Us />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/reserva" element={<Reservation />} />
        
        {/* RUTAS DEL MENÚ DESPLEGABLE 'SERVICIOS' */}
        
        {/* 2. Masajes*/}
        <Route path="/servicios/masajes" element={<Services />} /> 
        
        {/* 3. Experiencias */}
        <Route path="/servicios/experiencias" element={<Experiences />} /> 
        
        {/* 4. Planes y Membresías */}
        <Route path="/servicios/planes" element={<Plans />} /> 

        {/* Otras rutas */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/claims" element={<Claims />} />
      </Routes>
    </BrowserRouter>
  );
}
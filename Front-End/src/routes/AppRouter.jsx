import { BrowserRouter, Routes, Route } from "react-router";
import Auth from "../pages/Auth/Auth";
import Home from "../pages/Home/Home";
import Us from "../pages/Us/Us";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import Terms from "../pages/Terms/Terms";
import Claims from "../pages/Claims/Claims"; 
//import PlanesPage from "../pages/Plans/Plans-pack"; Importamos el componente

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        {/*<Route path="/" element={<Auth />} />*/}
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Us />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/claims" element={<Claims />} />
        {/* Aqui iria la ruta para planes y paquetes de masajes*/}
        {/*<Route path="/planes" element={<PlanesPage />} />*/}
        {/* Dentro de element se pone el componente a usar*/}

        
        
        
      </Routes>
    </BrowserRouter>
  );
}

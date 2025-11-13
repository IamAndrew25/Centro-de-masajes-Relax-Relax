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
import Admin from "../pages/Admin/Admin";
import Contact from "../pages/Contact/Contact";
import Checkout from "../pages/Checkout/Checkout";
import ProtectedRoute from "../routes/ProtectedRouter";
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Rutas Públicas --- */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/nosotros" element={<Us />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/servicios/masajes" element={<Services />} />
        <Route path="/servicios/experiencias" element={<Experiences />} />
        <Route path="/servicios/planes" element={<Plans />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/claims" element={<Claims />} />

        {/* --- Rutas Protegidas (Requieren Login) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/reserva" element={<Reservation />} />{/*No mover */}
        </Route>   
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
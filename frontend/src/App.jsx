
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Planes from './pages/Planes';
import Nosotros from './pages/Nosotros';
import Reserva from './pages/Reserva';
import LoginPage from './pages/LoginPage';
import ClientesPage from './pages/ClientesPage';
import Pago from './pages/Pago';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planes" element={<Planes />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/reserva" element={<Reserva />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/pago" element={<Pago />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

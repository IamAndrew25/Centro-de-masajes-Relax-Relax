import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useCart } from '../../context/cartContext';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import { FaCreditCard, FaCalendarAlt, FaLock, FaCcVisa, FaCcMastercard} from 'react-icons/fa';
import { createPayment } from '../../api/paymentApi';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems, totalCartPrice, clearCart, appointmentId} = useCart();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [operationDate, setOperationDate] = useState('');
  const [operationTime, setOperationTime] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para generar datos de operación al cargar el componente
  useEffect(() => {
    const now = new Date();
    setOperationDate(now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    setOperationTime(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }));
    setOrderNumber(Math.floor(100000 + Math.random() * 900000).toString());
  }, []);

  // Manejador para enviar el formulario de pago
  const handlePayment = async (e) => {
    e.preventDefault();

    //Validacion de cita
    if (!appointmentId) {
      toast.error('Error: No se ha encontrado una cita. Por favor, reserva una hora antes de pagar.');
      navigate('/reserva');
      return;
    }

    //Validaciones del formulario
    if (!cardNumber || !cardExpiry || !cardCvv) {
      toast.warn('Por favor, completa todos los campos de la tarjeta.');
      return;
    }
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanedCardNumber.length !== 16 || !/^\d+$/.test(cleanedCardNumber)) {
        toast.warn('El número de tarjeta debe tener 16 dígitos numéricos.');
        return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        toast.warn('La fecha de caducidad debe estar en formato MM/AA.');
        return;
    }
    // Validar que la fecha no este pasada
    const [month, year] = cardExpiry.split('/');
    const expiryDate = new Date(`20${year}`, month - 1);
    const currentDate = new Date();
    currentDate.setDate(1);
    if (expiryDate < currentDate) {
        toast.warn('La tarjeta ha caducado.');
        return;
    }

    const cleanedCvv = cardCvv.replace(/\D/g, '');
    if (cleanedCvv.length < 3 ) {
        toast.warn('El CVV debe tener 3 dígitos.');
        return;
    }

    setIsLoading(true);

    try {
      const paymentDetails = {
        amount: totalCartPrice,
        method: "CREDIT_CARD",
        appointmentId: appointmentId
      };

      // Llama a la función importada createPayment
      const paymentResponse = await createPayment(paymentDetails);

      console.log("Pago creado con éxito en backend:", paymentResponse);

      // Si la llamada fue exitosa
      toast.success('¡Pago procesado con éxito! Gracias por tu compra.');
      clearCart();
      navigate('/home');

    } catch (apiError) {
      // Si hubo un error en la llamada a la API
      console.error("Error en el pago:", apiError);
      toast.error(apiError.message || "Hubo un problema al procesar tu pago. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const cleanedValue = value.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < cleanedValue.length && i < 16; i += 4) {
      parts.push(cleanedValue.substring(i, i + 4));
    }
    return parts.join(' ').trim();
  };

  const formatCardExpiry = (value) => {
    const cleanedValue = value.replace(/\D/g, '');
    if (cleanedValue.length >= 2) {
      return `${cleanedValue.substring(0, 2)}/${cleanedValue.substring(2, 4)}`;
    }
    return cleanedValue;
  };

  if (cartItems.length === 0 && !isLoading) {
    return (
      <MainLayout>
        <div className="checkout-container empty">
          <div className="checkout-wrapper empty-cart-message">
            <h1>Tu carrito está vacío.</h1>
            <p>Parece que no tienes productos en tu carrito. <a onClick={() => navigate('/')}>¡Explora nuestros servicios!</a></p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="checkout-container">
        <div className="checkout-card-wrapper">

          <div className="operation-data-card">
            <h2>Datos de la operación</h2>
            <div className="data-row">
              <span className="label">Importe:</span>
              <span className="value">{totalCartPrice.toFixed(2)} S/</span>
            </div>
            <div className="data-row">
              <span className="label">Negocio:</span>
              <span className="value">Relax Total</span>
            </div>
            <div className="data-row">
              <span className="label">Nº de pedido:</span>
              <span className="value">{orderNumber}</span>
            </div>
            <div className="data-row">
              <span className="label">Fecha:</span>
              <span className="value">{operationDate}</span>
            </div>
            <div className="data-row">
              <span className="label">Hora:</span>
              <span className="value">{operationTime}</span>
            </div>
          </div>

          <div className="payment-card">
            <div className="payment-header">
                <h2>Pago por tarjeta</h2>
                <div className="card-logos">
                    <FaCcVisa size={30} color="#1A1F71"/>
                    <FaCcMastercard size={30} color="#EB001B"/>
                </div>
            </div>

            {/* Formulario de pago */}
            <form onSubmit={handlePayment} className="payment-form">

              <div className="input-group">
                <FaCreditCard className="input-icon"/>
                <input
                  type="text"
                  placeholder="Número de tarjeta"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength="19"
                  inputMode="numeric"
                  pattern="[\d ]{16,19}"
                  title="Ingrese los 16 dígitos de su tarjeta"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <FaCalendarAlt className="input-icon"/>
                  <input
                    type="text"
                    placeholder="Caducidad (MM/AA)"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                    maxLength="5" // MM/AA
                    inputMode="numeric"
                    pattern="\d{2}/\d{2}"
                    title="Ingrese la fecha en formato MM/AA"
                    disabled={isLoading}
                    required
                  />
                </div>
                {/* Input: CVV */}
                <div className="input-group">
                  <FaLock className="input-icon"/>
                  <input
                    type="password"
                    placeholder="CVV"
                    value={cardCvv}
                    // Solo permite dígitos y limita longitud en onChange
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                    maxLength="3"
                    inputMode="numeric"
                    pattern="\d{3,4}"
                    title="Ingrese el código de 3 o 4 dígitos"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="button-row">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                 >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-pay"
                  disabled={isLoading}
                >
                  {isLoading ? 'Procesando...' : 'Pagar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div> 
    </MainLayout>
  );
};

export default Checkout;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useCart } from "../../context/cartContext";
import { getUserIdFromToken } from "../../api/authApi";
import { createAppointment } from "../../api/appointmentApi";
import { getAllWorkers } from "../Admin/components/JS/workerService"; 
import { toast } from 'react-toastify';
import "./Reservation.css";
import heroImage from "../../assets/images/Banner.jpg";

const Reservation = () => {
  const navigate = useNavigate();
  const { cartItems, totalCartPrice } = useCart();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    workerId: "",
  });

  const [userId, setUserId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [workers, setWorkers] = useState([]); 

  const serviceToBook = cartItems.length > 0 ? cartItems[0] : null;

  useEffect(() => {
    const id = getUserIdFromToken();
    setUserId(id);

    if (!serviceToBook) {
      toast.info("Por favor, selecciona un servicio primero.", {
        toastId: 'serviceError'
      });
      navigate("/servicios/masajes");
      return;
    }
    setSubmitMessage("");

    // Función para cargar los especialistas
    const fetchWorkers = async () => {
      try {
        const workerList = await getAllWorkers();
        setWorkers(workerList); 
      } catch (error) {
        console.error("Error al cargar especialistas:", error);
        toast.error("No se pudo cargar la lista de especialistas.");
      }
    };

    fetchWorkers();

  }, [serviceToBook, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.workerId) newErrors.workerId = "Selecciona un especialista.";
    if (!formData.date) newErrors.date = "Selecciona una fecha.";
    if (!formData.time) newErrors.time = "Selecciona una hora.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setSubmitMessage("");
      const appointmentStart = `${formData.date}T${formData.time}:00`;

      const appointmentData = {
        userId: userId,
        serviceId: serviceToBook.id,
        workerId: parseInt(formData.workerId, 10), // Esto ya estaba correcto
        appointmentStart: appointmentStart,
        amount: totalCartPrice,
        status: "PENDING",
      };

      try {
        console.log("Enviando datos de cita:", appointmentData);
        const createdAppointment = await createAppointment(appointmentData);
        console.log("Cita creada con éxito:", createdAppointment);

        setSubmitMessage("¡Tu reserva ha sido registrada con éxito! Será revisada por un administrador.");
        toast.success("Reserva registrada.");
        setFormData({ date: "", time: "", workerId: "" });

      } catch (apiError) {
        console.error("Error al registrar la reserva:", apiError);
        setSubmitMessage("");
        toast.error(apiError.message || "No se pudo registrar la reserva. Inténtalo de nuevo.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setSubmitMessage("");
    }
  };

  if (!userId || !serviceToBook) {
    return <MainLayout><div className="loading">Cargando...</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="reservation-container">
        <section
          className="hero-section"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="hero-overlay"></div>
          <h1>Reserva tu Cita</h1>
          <p>Selecciona fecha y hora para: <strong>{serviceToBook.name}</strong></p>
        </section>

        <section className="reservation-content">
          <div className="reservation-form-card">
            <h2>Completa los Detalles de tu Reserva</h2>
            {submitMessage && (
              <p className={`submit-message ${Object.keys(errors).length > 0 ? 'error' : 'success'}`}>
                {submitMessage}
              </p>
            )}

            <form className="reservation-form" onSubmit={handleSubmit} noValidate>
                <p className="service-summary">
                  Servicio: <strong>{serviceToBook.name}</strong> (S/ {totalCartPrice.toFixed(2)})
                </p>

                <div className="form-group">
                  <label htmlFor="workerId">Especialista</label>
                  <select id="workerId" value={formData.workerId} onChange={handleChange} required>
                      <option value="">-- Seleccionar Especialista --</option>
                      {/* Mapea la lista de trabajadores obtenida del estado */}
                      {workers.map(worker => (
                        <option key={worker.id} value={worker.id}>
                          {worker.username}
                        </option>
                      ))}
                  </select>
                  {errors.workerId && <p className="error-text">{errors.workerId}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="date">Fecha</label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                  {errors.date && <p className="error-text">{errors.date}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="time">Hora</label>
                  <input
                    type="time"
                    id="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                  {errors.time && <p className="error-text">{errors.time}</p>}
                </div>

                <button type="submit" className="btn-reserve" disabled={isLoading}>
                  {isLoading ? "Registrando Reserva..." : "Confirmar Reserva"}
                </button>
            </form>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Reservation;
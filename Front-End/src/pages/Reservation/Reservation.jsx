// src/pages/Reservation/Reservation.jsx
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

const normalize = (text = "") => {
  try {
    return String(text)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toUpperCase();
  } catch (e) {
    return String(text).toUpperCase();
  }
};

const getWeekdayNumber = (dateStr) => {
  const d = new Date(dateStr + "T00:00:00");
  const jsDay = d.getDay();
  return jsDay === 0 ? 7 : jsDay;
};

const safeGetAvailabilityFields = (a = {}) => {
  const obj = { ...a };

  let weekdayNum = null;
  if (obj.weekday !== undefined && obj.weekday !== null) {
    weekdayNum = Number(obj.weekday) || null;
  } else if (obj.weekdayNumber !== undefined) {
    weekdayNum = Number(obj.weekdayNumber) || null;
  } else if (obj.day) {
    const maybeNum = Number(obj.day);
    if (!Number.isNaN(maybeNum) && maybeNum >= 1 && maybeNum <= 7) {
      weekdayNum = maybeNum;
    } else {
      const mapping = {
        'LUNES': 1, 'MARTES': 2, 'MIERCOLES': 3, 'MIÉRCOLES': 3,
        'MIERCOLES': 3, 'JUEVES': 4, 'VIERNES': 5, 'SABADO': 6, 'SÁBADO': 6, 'DOMINGO': 7
      };
      weekdayNum = mapping[normalize(obj.day)] ?? null;
    }
  }

  let active = true;
  if (obj.active !== undefined && obj.active !== null) active = Boolean(obj.active);
  else if (obj.activo !== undefined && obj.activo !== null) active = Boolean(obj.activo);

  const inicio = obj.inicio ?? obj.start_time ?? obj.startTime ?? obj.start ?? "";
  const fin = obj.fin ?? obj.end_time ?? obj.endTime ?? obj.end ?? "";

  return {
    weekday: weekdayNum,
    dayText: obj.day ? normalize(obj.day) : null,
    inicio: String(inicio).slice(0,5),
    fin: String(fin).slice(0,5),
    active
  };
};

const availabilityMatchesDate = (availabilityEntry, dateStr) => {
  const av = safeGetAvailabilityFields(availabilityEntry);
  if (!av.active) return false;
  const weekdayOfDate = getWeekdayNumber(dateStr);
  if (av.weekday && Number(av.weekday) === weekdayOfDate) return true;
  if (av.dayText) {
    const mappingName = { 1: 'LUNES', 2: 'MARTES', 3: 'MIERCOLES', 4: 'JUEVES', 5: 'VIERNES', 6: 'SABADO', 7: 'DOMINGO' };
    if (normalize(mappingName[weekdayOfDate]) === av.dayText) return true;
  }
  return false;
};

const getDurationMinutes = (service) => {
  if (!service) return null;
  const possible = service.duration ?? service.durationMin ?? service.duration_min ?? service.durationMinutes ?? service.duration_minutes ?? service.duration_minutos ?? service.durationMinutesMin ?? service.durationMinutos;
  if (typeof possible === 'number') return possible;
  if (typeof possible === 'string') {
    const m = possible.match(/\d+/);
    return m ? parseInt(m[0], 10) : null;
  }
  return null;
};

const Reservation = () => {
  const navigate = useNavigate();
  const { cartItems, totalCartPrice, setAppointmentId } = useCart();

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
  const [availableHours, setAvailableHours] = useState([]);

  const serviceToBook = cartItems.length > 0 ? cartItems[0] : null;

  useEffect(() => {
    const id = getUserIdFromToken();
    setUserId(id);

    if (!serviceToBook) {
      toast.info("Por favor, selecciona un servicio primero.", { toastId: 'serviceError' });
      navigate("/servicios/masajes");
      return;
    }
    setSubmitMessage("");

    const fetchWorkers = async () => {
      try {
        const workerList = await getAllWorkers();
        console.log("Workers cargados desde backend:", workerList);
        workerList.forEach(w => console.log("worker", w.id, "availability:", w.availability));
        setWorkers(workerList);
      } catch (error) {
        console.error("Error cargando especialistas:", error);
        toast.error("No se pudo cargar la lista de especialistas.");
      }
    };

    fetchWorkers();
  }, [serviceToBook, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }));
  };

  const filteredWorkers = workers.filter(
    w => (w.estado ? normalize(w.estado) === "ACTIVO" : true) && Array.isArray(w.availability) && w.availability.length > 0
  );

  let workersAvailableToday = filteredWorkers;
  if (formData.date) {
    workersAvailableToday = filteredWorkers.filter(w => {
      if (!Array.isArray(w.availability)) return false;
      return w.availability.some(a => availabilityMatchesDate(a, formData.date));
    });
    console.log("Workers disponibles para", formData.date, ":", workersAvailableToday.map(w=>w.id));
  }

  const fetchAvailableHours = async (workerId, date) => {
    if (!workerId || !date || !serviceToBook) {
      setAvailableHours([]);
      return;
    }
    try {
      const duration = getDurationMinutes(serviceToBook);
      console.log("Duracion calculada del servicio:", duration, "service object:", serviceToBook);
      if (!duration) {
        console.error("❌ Duración inválida del servicio:", serviceToBook);
        setAvailableHours([]);
        return;
      }

      const res = await fetch(`http://3.16.225.135:8080/user/worker/${workerId}/availability/date/${date}?durationMinutes=${duration}`);
      if (!res.ok) {
        const txt = await res.text().catch(()=>null);
        console.error("Backend returned not ok:", res.status, txt);
        setAvailableHours([]);
        return;
      }
      const data = await res.json();
      console.log("Horas recibidas desde backend:", data);
      if (Array.isArray(data)) {
        if (data.length === 0) console.warn("⚠️ Backend devolvió array vacío de horas para", workerId, date);
        setAvailableHours(data);
      } else {
        console.warn("⚠️ Formato inesperado de horas:", data);
        setAvailableHours([]);
      }
    } catch (err) {
      console.error("Error obteniendo horas disponibles:", err);
      setAvailableHours([]);
    }
  };

  useEffect(() => {
    if (formData.workerId && formData.date) {
      fetchAvailableHours(formData.workerId, formData.date);
    } else {
      setAvailableHours([]);
    }
  }, [formData.date, formData.workerId, serviceToBook]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};
  if (!formData.workerId) newErrors.workerId = "Selecciona un especialista.";
  if (!formData.date) newErrors.date = "Selecciona una fecha.";
  if (!formData.time) newErrors.time = "Selecciona una hora.";
  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  setIsLoading(true);
  setSubmitMessage("");

  // --- FIX HORA ---
  let rawTime = formData.time;

  if (!rawTime || !rawTime.includes(":")) {
    toast.error("Selecciona una hora válida.");
    return;
  }

  let [hour, minute] = rawTime.split(":");
  hour = hour.padStart(2, "0");
  minute = minute.padStart(2, "0");

  const appointmentStart = `${formData.date}T${hour}:${minute}:00`;

  const appointmentData = {
    userId,
    serviceId: serviceToBook.id,
    workerId: parseInt(formData.workerId, 10),
    appointmentStart,
    status: "PENDING",
  };

  try {
    console.log("Enviando datos:", appointmentData);
    const resp = await createAppointment(appointmentData);
    
    console.log("RESPUESTA BACKEND:", resp);

    const appointmentId = resp.id;

    if (!appointmentId) {
      toast.error("El backend no devolvió ID.");
      return;
    }

    setAppointmentId(appointmentId);
    localStorage.setItem("appointmentId", appointmentId);

    toast.success("Reserva registrada.");
    setFormData({ date: "", time: "", workerId: "" });
    setAvailableHours([]);

  } catch (error) {
    toast.error(error.message || "No se pudo registrar la reserva.");
  } finally {
    setIsLoading(false);
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

                {/* Especialista */}
                <div className="form-group">
                  <label htmlFor="workerId">Especialista</label>
                  <select id="workerId" value={formData.workerId} onChange={handleChange} required>
                      <option value="">-- Seleccionar Especialista --</option>
                      {workersAvailableToday.map(worker => (
                        <option key={worker.id} value={worker.id}>
                          {worker.username}
                        </option>
                      ))}
                  </select>
                  {errors.workerId && <p className="error-text">{errors.workerId}</p>}
                </div>

                {/* Fecha */}
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

                {/* Hora (SELECT dinámico) */}
                <div className="form-group">
                  <label htmlFor="time">Hora</label>
                  <select id="time" value={formData.time} onChange={handleChange} required>
                    <option value="">-- Selecciona una hora --</option>
                    {availableHours.length > 0 ? (
                      availableHours.map((hour, index) => (
                        <option key={index} value={hour}>{hour}</option>
                      ))
                    ) : (
                      <option value="" disabled>No hay horarios disponibles</option>
                    )}
                  </select>
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

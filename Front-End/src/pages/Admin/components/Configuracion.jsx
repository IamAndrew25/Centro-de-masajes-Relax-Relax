import React, { useEffect, useState } from "react";
import { getBusinessBasics, updateBusinessBasics } from "./JS/businessConfigService";
// 👆 si este archivo NO está en src/pages/Admin/components, cambia la ruta

// Componentes internos para cada sección de configuración
const InformacionNegocio = () => {
  const [basics, setBasics] = useState({
    nombreSpa: "Relax Total",
    direccion: "Av. Principal 123, Ciudad",
    telefono: "+1 (555) 123-4567",
    email: "info@relaxtotal.com",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBasics = async () => {
      try {
        const data = await getBusinessBasics();
        setBasics(data);
      } catch (err) {
        console.error("Error al cargar datos básicos:", err);
      }
    };
    fetchBasics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBasics((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateBusinessBasics(basics);
      alert("Datos básicos guardados correctamente ✅");
    } catch (err) {
      console.error("Error al guardar datos básicos:", err);
      alert("Hubo un error al guardar los datos.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="config-section">
      <h3>🏢 Información del Negocio</h3>

      <form className="config-grid" onSubmit={handleSave}>
        <div className="config-card">
          <h4>Datos Básicos</h4>
          <div className="config-form">
            <div className="form-group">
              <label>Nombre del Spa:</label>
              <input
                type="text"
                name="nombreSpa"
                value={basics.nombreSpa}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Dirección:</label>
              <input
                type="text"
                name="direccion"
                value={basics.direccion}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Teléfono:</label>
              <input
                type="tel"
                name="telefono"
                value={basics.telefono}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={basics.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-save-config"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InformacionNegocio;
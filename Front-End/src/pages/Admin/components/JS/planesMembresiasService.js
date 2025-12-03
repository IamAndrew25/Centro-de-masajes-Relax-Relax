import axios from 'axios';

const API_URL = 'http://3.16.225.135:8080/plans';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

/*
  Backend model (PlanModel) fields we support:
  {
    id,
    name,
    description,
    price,
    durationDays,
    tipo,
    icono,
    servicios_incluidos, // JSON array
    beneficios,          // JSON array
    destacado,
    estado,
    duracion,
    duracion_unidad,
    createdAt
  }
*/

/* Convert frontend form (formData) -> backend payload */
const mapToBackend = (form) => {
  // servicios_incluidos / beneficios pueden llegar como string multilinea (desde el textarea)
  const toArray = (v) => {
    if (!v && v !== '') return [];
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') {
      return v.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    }
    return [];
  };

  // durationDays en días en backend
  const dur = Number(form.duracion || 0) || 0;
  const duracion_unidad = form.duracion_unidad || 'meses';
  const durationDays = duracion_unidad === 'meses' ? dur * 30 : dur;

  return {
    name: form.nombre,
    description: form.descripcion || form.nombre,
    price: Number(form.precio) || 0,
    durationDays: Number(durationDays) || 0,
    tipo: form.tipo || 'plan',
    icono: form.icono || '💠',
    servicios_incluidos: toArray(form.servicios_incluidos),
    beneficios: toArray(form.beneficios),
    destacado: Boolean(form.destacado),
    estado: form.estado || 'activo',
    duracion: Number(form.duracion) || 1,
    duracion_unidad: duracion_unidad
  };
};

/* Convert backend plan -> frontend-friendly object (used in lists and in form builder) */
const mapFromBackend = (plan) => {
  // plan.servicios_incluidos/beneficios pueden venir como array o como JSON-string dependiendo de DB/driver
  const toArraySafe = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') {
      try {
        // si es JSON string (p.ej MySQL devuelve texto), intentar parse
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { /* no-op */ }
      // si es string multilinea separado por \n
      return v.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    }
    return [];
  };

  return {
    id: plan.id,
    // fields para render y para buildFormFromPlan
    nombre: plan.name,
    descripcion: plan.description,
    precio: plan.price,
    tipo: plan.tipo || 'plan',
    icono: plan.icono || '💠',
    servicios_incluidos: toArraySafe(plan.servicios_incluidos),
    beneficios: toArraySafe(plan.beneficios),
    destacado: !!plan.destacado,
    estado: plan.estado || 'activo',
    duracion: plan.duracion ?? (plan.durationDays ? Math.round(plan.durationDays / 30) : 1),
    duracion_unidad: plan.duracion_unidad || (plan.durationDays ? 'meses' : 'meses'),
    createdAt: plan.createdAt
  };
};

export const getPlanes = async () => {
  const res = await axios.get(API_URL, getAuthHeader());
  return Array.isArray(res.data) ? res.data.map(mapFromBackend) : [];
};

export const createPlan = async (formData) => {
  const body = mapToBackend(formData);
  const res = await axios.post(API_URL, body, getAuthHeader());
  return mapFromBackend(res.data);
};

export const updatePlan = async (id, formData) => {
  const body = mapToBackend(formData);
  const res = await axios.put(`${API_URL}/${id}`, body, getAuthHeader());
  return mapFromBackend(res.data);
};

export const deletePlan = async (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader());
};

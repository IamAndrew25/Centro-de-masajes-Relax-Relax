import axios from 'axios';

const API_URL = 'http://localhost:8080/promotions';

const toDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d)) return null;
    return d.toISOString().split("T")[0]; // 👉 SOLO LA FECHA
};


const mapToBackend = (formData) => {
    return {
        name: formData.nombre,
        description: formData.descripcion,
        imageUrl: formData.imagen_url || null,
        discountPercent:
            formData.tipo_descuento === "porcentaje"
                ? Number(formData.descuento)
                : 0,     // <-- evitar null
        discountAmount:
            formData.tipo_descuento === "monto"
                ? Number(formData.descuento)
                : 0,     // <-- evitar null
        startDate: toDate(formData.fecha_inicio),
        endDate: toDate(formData.fecha_fin),
        active: formData.estado === "activa"
    };
};


export const getPromociones = async () => {
    const res = axios.get(API_URL);
    return (await res).data;
};

export const createPromocion = async (formData) => {
    const body = mapToBackend(formData);
    const res = await axios.post(API_URL, body);
    return res.data;
};

export const updatePromocion = async (id, formData) => {
    const body = mapToBackend(formData);
    const res = await axios.put(`${API_URL}/${id}`, body);
    return res.data;
};

export const deletePromocion = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};

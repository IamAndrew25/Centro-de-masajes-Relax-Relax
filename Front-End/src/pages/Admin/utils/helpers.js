// Funciones utilitarias reutilizables

// Función para formatear números con separadores de miles
export const formatNumber = (number) => {
    return number.toLocaleString();
};

// Función para formatear moneda en soles
export const formatCurrency = (amount) => {
    return `S/ ${formatNumber(amount)}`;
};

// Función para manejar cambios en formularios
export const createFormHandler = (setState) => (field, value) => {
    setState(prev => ({
        ...prev,
        [field]: value
    }));
};

// Función para resetear formularios
export const resetForm = (setState, initialState) => {
    setState(initialState);
};

// Función para crear manejadores de eventos
export const createEventHandler = (callback) => (e) => {
    callback(e.target.value);
};

// Función para renderizar elementos de lista dinámicamente
export const renderList = (items, renderItem) => {
    return items.map((item, index) => renderItem(item, index));
};
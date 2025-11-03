// src/utils/dateUtils.js

/**
 * Formatea una fecha en formato dd/mm/yyyy
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada en formato dd/mm/yyyy
 */
export const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
};

/**
 * Formatea una fecha con hora en formato 12 horas (AM/PM)
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha y hora formateada (dd/mm/yyyy hh:mm AM/PM)
 */
export const formatearFechaConHora = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    
    // Obtener fecha
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    
    // Obtener hora en formato 12 horas
    let horas = date.getHours();
    const minutos = String(date.getMinutes()).padStart(2, '0');
    const periodo = horas >= 12 ? 'p.m.' : 'a.m.';
    
    // Convertir a formato 12 horas
    horas = horas % 12;
    horas = horas ? horas : 12; // Si es 0, mostrar 12
    const horasFormateadas = String(horas).padStart(2, '0');
    
    return `${dia}/${mes}/${anio} ${horasFormateadas}:${minutos} ${periodo}`;
};

/**
 * Formatea solo la hora en formato 12 horas (AM/PM)
 * @param {string|Date} fecha - Fecha de la cual extraer la hora
 * @returns {string} Hora formateada (hh:mm AM/PM)
 */
export const formatearHora = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    
    let horas = date.getHours();
    const minutos = String(date.getMinutes()).padStart(2, '0');
    const periodo = horas >= 12 ? 'p.m.' : 'a.m.';
    
    horas = horas % 12;
    horas = horas ? horas : 12;
    const horasFormateadas = String(horas).padStart(2, '0');
    
    return `${horasFormateadas}:${minutos} ${periodo}`;
};


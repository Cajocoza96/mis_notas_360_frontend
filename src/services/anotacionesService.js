const API_URL = import.meta.env.VITE_API_URL;

//Obtiene el token de autenticación del localStorage
const obtenerToken = () => {
    return localStorage.getItem('token');
};

//Maneja errores de las peticiones HTTP
const manejarErrorRespuesta = (response, mensajeError) => {
    if (!response.ok) {
        throw new Error(mensajeError);
    }
};

//Obtiene los contadores de anotaciones por estado
export const obtenerContadores = async () => {
    try {
        const token = obtenerToken();
        
        const respuesta = await fetch(`${API_URL}/anotaciones/contadores`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        manejarErrorRespuesta(respuesta, 'Error al cargar contadores');

        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error('Error al cargar contadores:', error);
        throw error;
    }
};

//Obtiene todas las anotaciones activas (no eliminadas)
export const obtenerAnotaciones = async () => {
    try {
        const token = obtenerToken();

        const response = await fetch(`${API_URL}/anotaciones/obtener`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        manejarErrorRespuesta(response, 'Error al cargar anotaciones');

        const data = await response.json();
        return data.anotaciones;
    } catch (error) {
        console.error('Error al cargar anotaciones:', error);
        throw error;
    }
};

//Obtiene todas las anotaciones eliminadas (papelera)
export const obtenerAnotacionesEliminadas = async () => {
    try {
        const token = obtenerToken();

        const response = await fetch(`${API_URL}/anotaciones/obtener-papelera`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        manejarErrorRespuesta(response, 'Error al cargar anotaciones eliminadas');

        const data = await response.json();
        return data.anotaciones;
    } catch (error) {
        console.error('Error al cargar anotaciones eliminadas:', error);
        throw error;
    }
};

//Mueve una anotación a la papelera (soft delete)
export const moverAPapelera = async (id) => {
    try {
        const token = obtenerToken();

        const response = await fetch(`${API_URL}/anotaciones/papelera/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        manejarErrorRespuesta(response, 'Error al mover a papelera');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al mover a papelera:', error);
        throw error;
    }
};

//Restaura una anotación desde la papelera
export const restaurarDesdePapelera = async (anotacionId) => {
    try {
        const token = obtenerToken();

        const response = await fetch(`${API_URL}/anotaciones/restaurar/${anotacionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        manejarErrorRespuesta(response, 'Error al restaurar nota desde la papelera');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al restaurar nota desde la papelera:', error);
        throw error;
    }
};

//Elimina definitivamente una anotación desde la papelera
export const eliminarDefinitivamente = async (anotacionId) => {
    try {
        const token = obtenerToken();

        const response = await fetch(`${API_URL}/anotaciones/eliminar-definitivamente/${anotacionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        manejarErrorRespuesta(response, 'Error al eliminar la nota definitivamente');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al eliminar la nota definitivamente desde la papelera:', error);
        throw error;
    }
};

//Vacía completamente la papelera (elimina todas las anotaciones eliminadas)
export const vaciarPapelera = async () => {
    try {
        const token = obtenerToken();

        const response = await fetch(`${API_URL}/anotaciones/obtener-papelera/vaciar`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        manejarErrorRespuesta(response, 'Error al vaciar la papelera');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al eliminar todas las notas definitivamente desde la papelera:', error);
        throw error;
    }
};

//Busca anotaciones por término de búsqueda
export const buscarAnotaciones = async (termino) => {
    try {
        const token = obtenerToken();

        const response = await fetch(
            `${API_URL}/anotaciones/buscar?q=${encodeURIComponent(termino)}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        manejarErrorRespuesta(response, 'Error al buscar anotaciones');

        const data = await response.json();
        return data.anotaciones;
    } catch (error) {
        console.error('Error en búsqueda:', error);
        throw error;
    }
};

//Obtiene una anotación específica por su ID para editar
export const obtenerAnotacionPorId = async (id) => {
    try {
        const token = obtenerToken();

        const response = await fetch(`${API_URL}/anotaciones/obtener/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        manejarErrorRespuesta(response, 'Error al cargar la anotación');

        const data = await response.json();
        return data.anotacion;
    } catch (error) {
        console.error('Error al cargar la anotación:', error);
        throw error;
    }
};

//Crea una nueva anotación
export const crearAnotacion = async (datosAnotacion) => {
    try {
        const token = obtenerToken();

        const response = await fetch(`${API_URL}/anotaciones/guardar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datosAnotacion)
        });

        manejarErrorRespuesta(response, 'Error al guardar la anotación');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al guardar la anotación:', error);
        throw error;
    }
};

//Actualiza una anotación existente
export const actualizarAnotacion = async (anotacionId, datosAnotacion) => {
    try {
        const token = obtenerToken();

        const response = await fetch(`${API_URL}/anotaciones/actualizar/${anotacionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datosAnotacion)
        });

        manejarErrorRespuesta(response, 'Error al actualizar la anotación');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al actualizar la anotación:', error);
        throw error;
    }
};

// Exportar también API_URL por si se necesita en otros lugares
export { API_URL };
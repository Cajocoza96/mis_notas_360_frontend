//Obtiene el nombre del estado
export const obtenerNombreEstado = (estado) => {
    const estados = {
        'no_asignado': 'No asignado',
        'pendiente': 'Pendiente',
        'finalizado': 'Finalizado'
    };
    return estados[estado] || 'No asignado';
};

//Obtiene el texto del estado segun el valor seleccionado
export const obtenerTextoEstado = (estadoSeleccionado) => {
    switch (estadoSeleccionado) {
        case "no_asignado":
            return "No asignado";
        case "pendiente":
            return "Pendiente";
        case "finalizado":
            return "Finalizado";
        default:
            return "Agregar estado";
    }
}

//Función para mapear el estado de la BD al frontend
export const obtenerEstadoProps = (estado) => {
    return {
        no_asignado: estado === 'no_asignado',
        pendiente: estado === 'pendiente',
        finalizado: estado === 'finalizado'
    };
}


//Función para mapear estados de BD a frontend
export const mapearEstadoDesdeBD = (estadoBD) => {
    const mapeo = {
        'no_asignado': 'no_asignado',
        'pendiente': 'pendiente',
        'finalizado': 'finalizado'
    };
    return mapeo[estadoBD] || 'no_asignado';
}

// Calcular qué opciones deben mostrarse según el estado de las tareas
export const obtenerOpcionesDisponibles = (tareas) => {
    if (!tareas || tareas.length === 0) {
        // Sin tareas: mostrar TODAS las opciones para que el usuario elija
        return ["no_asignado", "pendiente", "finalizado"];
    } else {
        const todasCompletadas = tareas.every(tarea => tarea.completada);
        
        if (todasCompletadas) {
            // Todas completadas: solo mostrar "Finalizado"
            return ["finalizado"];
        } else {
            // Hay tareas sin completar: solo mostrar "Pendiente"
            return ["pendiente"];
        }
    }
};



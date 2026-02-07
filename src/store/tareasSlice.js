import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    anotacionId: null,
    errorGuardado: null,

    tareas: [],
    tareaActual: null, // Para editar una tarea específica
    modoModal: 'crear', // 'crear' o 'editar'

    verModalCrearNota: false,
    verModalPapeleraNota: false,
    verModalPapeleraTodasLasNotas: false,
    verModalRestaurarNota: false,
    verModalEliminarNotaDefinitiva: false,
    verModalEliminarTodasLasNotasDefinitivo: false,

    verTarea: false,
    verModalTarea: false,

    verModalEstado: false,

    verInputBusqueda: false,
    terminoBusqueda: "",
    coincidenciaActual: 0,
    totalCoincidencias: 0,

    verModalModosIA: false,
    verModalTiNoTa: false,
    verModalGenerarContenido: false,
    modoIASeleccionado: null, // 'correct', 'improve', 'summarize', 'text-to-tasks'

    // Estados para las secciones seleccionadas
    seccionesSeleccionadas: {
        titulo: false,
        nota: false,
        tareas: false
    },

    procesandoIA: false,
    errorIA: null,

    ordenTareasSeleccionado: 'creacion',
    ordenTareasTemporal: 'creacion',

    verModalOrdenTareas: false,

    // Estados para CrearEditNota
    isTituloFocused: false,
    isNotaFocused: false,
    titulo: "",
    nota: "",
    canUndo: false,
    canRedo: false,

    estadoSeleccionado: null,

    // Contadores de estados
    contadores: {
        cant_no_asignado: 0,
        cant_pendiente: 0,
        cant_finalizado: 0,
        cant_todos_estados: 0
    }
}

//  Función helper para reordenar tareas según el orden activo
function reordenarTareasSegunOrden(state) {
    const tipoOrden = state.ordenTareasSeleccionado;

    if (tipoOrden === 'creacion') {
        //  Ordenar por orden_creacion (viene de la BD)
        state.tareas = [...state.tareas].sort((a, b) => {
            const ordenA = a.orden_creacion !== undefined ? a.orden_creacion : 999999;
            const ordenB = b.orden_creacion !== undefined ? b.orden_creacion : 999999;
            return ordenA - ordenB;
        });
    } else if (tipoOrden === 'ascendente') {
        state.tareas = [...state.tareas].sort((a, b) => {
            // Extraer número al inicio si existe
            const matchA = a.texto.match(/^(\d+)\./);
            const matchB = b.texto.match(/^(\d+)\./);

            const numA = matchA ? parseInt(matchA[1]) : null;
            const numB = matchB ? parseInt(matchB[1]) : null;

            // Si ambos tienen número, comparar numéricamente
            if (numA !== null && numB !== null) {
                if (numA !== numB) return numA - numB;
                return a.texto.toLowerCase().localeCompare(b.texto.toLowerCase());
            }

            // Si solo uno tiene número, el que tiene número va primero
            if (numA !== null) return -1;
            if (numB !== null) return 1;

            // Si ninguno tiene número, comparar alfabéticamente
            return a.texto.toLowerCase().localeCompare(b.texto.toLowerCase());
        });
    } else if (tipoOrden === 'descendente') {
        state.tareas = [...state.tareas].sort((a, b) => {
            // Extraer número al inicio si existe
            const matchA = a.texto.match(/^(\d+)\./);
            const matchB = b.texto.match(/^(\d+)\./);

            const numA = matchA ? parseInt(matchA[1]) : null;
            const numB = matchB ? parseInt(matchB[1]) : null;

            // Si ambos tienen número, comparar numéricamente (invertido)
            if (numA !== null && numB !== null) {
                if (numA !== numB) return numB - numA;
                return b.texto.toLowerCase().localeCompare(a.texto.toLowerCase());
            }

            // Si solo uno tiene número, el que tiene número va primero
            if (numA !== null) return -1;
            if (numB !== null) return 1;

            // Si ninguno tiene número, comparar alfabéticamente (invertido)
            return b.texto.toLowerCase().localeCompare(a.texto.toLowerCase());
        });
    }
}

const tareasSlice = createSlice({
    name: 'tareas',
    initialState,
    reducers: {
        setAnotacionId: (state, action) => {
            state.anotacionId = action.payload
        },
        setErrorGuardado: (state, action) => {
            state.errorGuardado = action.payload
        },

        toggleVerModalCrearNota: (state) => {
            state.verModalCrearNota = !state.verModalCrearNota
        },
        setVerModalCrearNota: (state, action) => {
            state.verModalCrearNota = action.payload
        },

        toggleVerModalPapeleraNota: (state) => {
            state.verModalPapeleraNota = !state.verModalPapeleraNota
        },
        setVerModalPapeleraNota: (state, action) => {
            state.verModalPapeleraNota = action.payload
        },

        toggleVerModalPapeleraTodasLasNotas: (state) => {
            state.verModalPapeleraTodasLasNotas = !state.verModalPapeleraTodasLasNotas
        },
        setVerModalPapeleraTodasLasNotas: (state, action) => {
            state.verModalPapeleraTodasLasNotas = action.payload
        },

        toggleVerModalRestaurarNota: (state) => {
            state.verModalRestaurarNota = !state.verModalRestaurarNota
        },
        setVerModalRestaurarNota: (state, action) => {
            state.verModalRestaurarNota = action.payload
        },

        toggleVerModalEliminarNotaDefinitiva: (state) => {
            state.verModalEliminarNotaDefinitiva = !state.verModalEliminarNotaDefinitiva
        },
        setVerModalEliminarNotaDefinitiva: (state, action) => {
            state.verModalEliminarNotaDefinitiva = action.payload
        },

        toggleVerModalEliminarTodasLasNotasDefinitivo: (state) => {
            state.verModalEliminarTodasLasNotasDefinitivo = !state.verModalEliminarTodasLasNotasDefinitivo
        },
        setVerModalEliminarTodasLasNotasDefinitivo: (state, action) => {
            state.verModalEliminarTodasLasNotasDefinitivo = action.payload
        },

        toggleVerTarea: (state) => {
            state.verTarea = !state.verTarea
        },
        setVerTarea: (state, action) => {
            state.verTarea = action.payload
        },

        toggleVerModalTarea: (state) => {
            state.verModalTarea = !state.verModalTarea
        },
        setVerModalTarea: (state, action) => {
            state.verModalTarea = action.payload
        },

        toggleVerModalEstado: (state) => {
            state.verModalEstado = !state.verModalEstado
        },
        setVerModalEstado: (state, action) => {
            state.verModalEstado = action.payload
        },

        toggleVerInputBusqueda: (state) => {
            state.verInputBusqueda = !state.verInputBusqueda
        },
        setVerInputBusqueda: (state, action) => {
            state.verInputBusqueda = action.payload
        },
        setTerminoBusqueda: (state, action) => {
            state.terminoBusqueda = action.payload
        },
        setCoincidenciaActual: (state, action) => {
            state.coincidenciaActual = action.payload
        },
        setTotalCoincidencias: (state, action) => {
            state.totalCoincidencias = action.payload
        },

        toggleVerModalModosIA: (state) => {
            state.verModalModosIA = !state.verModalModosIA
        },
        setVerModalModosIA: (state, action) => {
            state.verModalModosIA = action.payload
        },

        toggleVerModalTiNoTa: (state) => {
            state.verModalTiNoTa = !state.verModalTiNoTa
        },
        setVerModalTiNoTa: (state, action) => {
            state.verModalTiNoTa = action.payload
        },

        toggleVerModalGenerarContenido: (state) => {
            state.verModalGenerarContenido = !state.verModalGenerarContenido
        },
        setVerModalGenerarContenido: (state, action) => {
            state.verModalGenerarContenido = action.payload
        },

        // IA - Seleccionar modo
        setModoIASeleccionado: (state, action) => {
            state.modoIASeleccionado = action.payload;
        },

        //  IA - Toggle secciones individuales
        toggleSeccionTitulo: (state) => {
            state.seccionesSeleccionadas.titulo = !state.seccionesSeleccionadas.titulo;
        },
        toggleSeccionNota: (state) => {
            state.seccionesSeleccionadas.nota = !state.seccionesSeleccionadas.nota;
        },
        toggleSeccionTareas: (state) => {
            state.seccionesSeleccionadas.tareas = !state.seccionesSeleccionadas.tareas;
        },

        //  IA - Resetear secciones
        resetSeccionesSeleccionadas: (state) => {
            state.seccionesSeleccionadas = {
                titulo: false,
                nota: false,
                tareas: false
            };
        },

        // IA - Estado de procesamiento
        setProcesandoIA: (state, action) => {
            state.procesandoIA = action.payload;
        },

        // IA - Error
        setErrorIA: (state, action) => {
            state.errorIA = action.payload;
        },

        // IA - Reemplazar tareas con las generadas por IA
        reemplazarTareasConIA: (state, action) => {
            const tareasGeneradas = action.payload;

            // Calcular el siguiente orden_creacion
            const siguienteOrdenCreacion = state.tareas.length > 0
                ? Math.max(...state.tareas.map(t => t.orden_creacion ?? -1)) + 1
                : 0;

            // Crear nuevas tareas con la estructura correcta
            const nuevasTareas = tareasGeneradas.map((textoTarea, index) => ({
                id: Date.now() + index, // ID único temporal
                texto: textoTarea,
                completada: false,
                orden_creacion: siguienteOrdenCreacion + index
            }));

            // Agregar al array existente
            state.tareas = [...state.tareas, ...nuevasTareas];

            // Reordenar según orden activo
            reordenarTareasSegunOrden(state);
        },

        setOrdenTareasTemporal: (state, action) => {
            state.ordenTareasTemporal = action.payload;
        },

        //  Establecer orden al cargar anotación
        setOrdenTareasSeleccionado: (state, action) => {
            state.ordenTareasSeleccionado = action.payload;
            state.ordenTareasTemporal = action.payload;
        },

        //  CORREGIDO: Solo usa la función helper
        aplicarOrdenTareas: (state) => {
            state.ordenTareasSeleccionado = state.ordenTareasTemporal;
            reordenarTareasSegunOrden(state);
        },

        cancelarOrdenTareas: (state) => {
            state.ordenTareasTemporal = state.ordenTareasSeleccionado;
        },

        toggleVerModalOrdenTareas: (state) => {
            state.verModalOrdenTareas = !state.verModalOrdenTareas
        },
        setVerModalOrdenTareas: (state, action) => {
            state.verModalOrdenTareas = action.payload
        },

        setTareas: (state, action) => {
            state.tareas = action.payload
            //  Aplicar ordenamiento según el orden seleccionado
            reordenarTareasSegunOrden(state);
        },

        agregarTarea: (state, action) => {

            //  Calcular el siguiente orden_creacion
            const siguienteOrdenCreacion = state.tareas.length > 0 ? Math.max(...state.tareas.map(t => t.orden_creacion ?? -1)) + 1 : 0;

            const nuevaTarea = {
                id: Date.now(),
                texto: action.payload,
                completada: false,
                orden_creacion: siguienteOrdenCreacion
            }
            state.tareas.push(nuevaTarea);

            //  Reordenar automáticamente según el orden activo
            reordenarTareasSegunOrden(state);
        },

        editarTarea: (state, action) => {
            const { id, texto } = action.payload;
            const tarea = state.tareas.find(t => t.id === id);
            if (tarea) {
                tarea.texto = texto;

                //  Reordenar automáticamente según el orden activo
                reordenarTareasSegunOrden(state);
            }
        },

        eliminarTarea: (state, action) => {
            state.tareas = state.tareas.filter(t => t.id !== action.payload)

            //Si despues de eliminar no quedan tareas, resetear el estado a null
            if (state.tareas.length === 0) {
                state.estadoSeleccionado = null
            }
        },

        toggleCompletarTarea: (state, action) => {
            const tarea = state.tareas.find(t => t.id === action.payload)
            if (tarea) {
                tarea.completada = !tarea.completada
            }
        },

        setTareaActual: (state, action) => {
            state.tareaActual = action.payload
        },

        setModoModal: (state, action) => {
            state.modoModal = action.payload
        },


        // Reducers para CrearEditNota
        setIsTituloFocused: (state, action) => {
            state.isTituloFocused = action.payload
        },
        setIsNotaFocused: (state, action) => {
            state.isNotaFocused = action.payload
        },
        setTitulo: (state, action) => {
            state.titulo = action.payload
        },
        setNota: (state, action) => {
            state.nota = action.payload
        },
        setCanUndo: (state, action) => {
            state.canUndo = action.payload
        },
        setCanRedo: (state, action) => {
            state.canRedo = action.payload
        },

        setEstadoSeleccionado: (state, action) => {
            state.estadoSeleccionado = action.payload
        },

        setEstadoAutomatico: (state) => {
            const { tareas } = state;

            // Solo actualizar automáticamente si HAY tareas
            if (tareas.length > 0) {
                const todasCompletadas = tareas.every(tarea => tarea.completada);

                if (todasCompletadas) {
                    // Todas las tareas completadas: estado "Finalizado"
                    state.estadoSeleccionado = "finalizado";
                } else {
                    // Hay al menos una tarea sin completar: estado "Pendiente"
                    state.estadoSeleccionado = "pendiente";
                }
            }
            // Si no hay tareas (length === 0), NO cambiamos el estado
            // El usuario puede elegir manualmente cualquier estado
        },


        // Actualizar contadores
        setContadores: (state, action) => {
            state.contadores = action.payload
        },

        // Resetear estado de la nota
        resetNotaState: (state) => {
            state.isTituloFocused = false
            state.isNotaFocused = false
            state.titulo = ""
            state.nota = ""
            state.canUndo = false
            state.canRedo = false
            state.estadoSeleccionado = null
            state.anotacionId = null

            state.tareas = []
            state.tareaActual = null
            state.modoModal = 'crear'

            // Limpiar buscador
            state.verInputBusqueda = false
            state.terminoBusqueda = ""
            state.coincidenciaActual = 0
            state.totalCoincidencias = 0
        },

        //Para resetear todo
        resetAllTareasState: (state) => {
            return initialState;
        }
    }
})

export const {
    setAnotacionId,
    setErrorGuardado,

    toggleVerModalCrearNota,
    setVerModalCrearNota,
    toggleVerModalPapeleraNota,
    setVerModalPapeleraNota,
    toggleVerModalPapeleraTodasLasNotas,
    setVerModalPapeleraTodasLasNotas,
    toggleVerModalRestaurarNota,
    setVerModalRestaurarNota,
    toggleVerModalEliminarNotaDefinitiva,
    setVerModalEliminarNotaDefinitiva,
    toggleVerModalEliminarTodasLasNotasDefinitivo,
    setVerModalEliminarTodasLasNotasDefinitivo,

    toggleVerTarea,
    setVerTarea,
    toggleVerModalTarea,
    setVerModalTarea,
    toggleVerModalEstado,
    setVerModalEstado,

    toggleVerInputBusqueda,
    setVerInputBusqueda,
    setCoincidenciaActual,
    setTerminoBusqueda,
    setTotalCoincidencias,

    toggleVerModalModosIA,
    setVerModalModosIA,
    toggleVerModalTiNoTa,
    setVerModalTiNoTa,
    toggleVerModalGenerarContenido,
    setVerModalGenerarContenido,
    setModoIASeleccionado,
    toggleSeccionTitulo,
    toggleSeccionNota,
    toggleSeccionTareas,
    resetSeccionesSeleccionadas,
    setProcesandoIA,
    setErrorIA,
    reemplazarTareasConIA,

    setOrdenTareasTemporal,
    setOrdenTareasSeleccionado,
    aplicarOrdenTareas,
    cancelarOrdenTareas,

    toggleVerModalOrdenTareas,
    setVerModalOrdenTareas,
    setTareas,
    agregarTarea,
    editarTarea,
    eliminarTarea,
    toggleCompletarTarea,
    setTareaActual,
    setModoModal,
    setIsTituloFocused,
    setIsNotaFocused,
    setTitulo,
    setNota,
    setCanUndo,
    setCanRedo,
    resetNotaState,
    setEstadoSeleccionado,
    setEstadoAutomatico,

    setContadores,

    resetAllTareasState
} = tareasSlice.actions

export default tareasSlice.reducer
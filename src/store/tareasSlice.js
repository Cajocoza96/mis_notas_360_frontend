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

        toggleVerModalOrdenTareas : (state) => {
            state.verModalOrdenTareas =!state.verModalOrdenTareas
        },
        setVerModalOrdenTareas: (state, action) => {
            state.verModalOrdenTareas = action.payload
        },

        setTareas: (state, action) => {
            state.tareas = action.payload
        },

        agregarTarea: (state, action) => {
            const nuevaTarea = {
                id: Date.now(),
                texto: action.payload,
                completada: false
            }
            state.tareas.push(nuevaTarea)
        },

        editarTarea: (state, action) => {
            const { id, texto } = action.payload
            const tarea = state.tareas.find(t => t.id === id)
            if (tarea) {
                tarea.texto = texto
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


        // Nuevo: Actualizar contadores
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
    toggleVerModalOrdenTareas,
    setVerModalOrdenTareas,
    setVerModalEstado,
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
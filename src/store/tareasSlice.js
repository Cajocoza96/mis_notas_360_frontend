import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    anotacionId: null,
    errorGuardado: null,

    tareas: [],
    tareaActual: null, // Para editar una tarea específica
    modoModal: 'crear', // 'crear' o 'editar'

    verModalCrearNota: false,
    verModalPapeleraNota: false,
    verModalRestaurarNota: false,
    verModalEliminarNotaDefinitiva: false,
    verModalEliminarTodasLasNotasDefinitivo: false,

    verTarea: false,
    verModalTarea: false,

    verModalEstado: false,

    // Estados para CrearEditNota
    isTituloFocused: false,
    isNotaFocused: false,
    titulo: "",
    nota: "",
    canUndo: false,
    canRedo: false,

    estadoSeleccionado: null
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
    setEstadoSeleccionado
} = tareasSlice.actions

export default tareasSlice.reducer
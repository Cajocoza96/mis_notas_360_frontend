import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tareas: [],
    tareaActual: null, // Para editar una tarea específica
    modoModal: 'crear' // 'crear' o 'editar'
}

const tareasSlice = createSlice({
    name: 'tareas',
    initialState,
    reducers: {
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
        }
    }
})

export const {
    agregarTarea,
    editarTarea,
    eliminarTarea,
    toggleCompletarTarea,
    setTareaActual,
    setModoModal
} = tareasSlice.actions

export default tareasSlice.reducer
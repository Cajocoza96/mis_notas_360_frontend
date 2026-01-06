import { useState, useCallback, useRef, useEffect } from "react";
import { logDesarrollo, errorDesarrollo, registrarError } from "../utils/errorHandler";

export const useUndoRedo = (initialState = {}) => {
    // Estados para el historial
    const [history, setHistory] = useState([initialState]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);

    const timeoutRef = useRef(null);

    // ✅ Función para obtener el estado actual del historial
    const getCurrentState = useCallback(() => {
        return history[currentIndex];
    }, [history, currentIndex]);

    // Función para agregar un nuevo estado al historial (SIN debounce)
    const addToHistoryImmediate = useCallback((newState) => {
        if (isUndoRedoAction) return;

        setHistory(prevHistory => {
            // Eliminar cualquier estado "futuro" si estamos en medio del historial
            const newHistory = prevHistory.slice(0, currentIndex + 1);

            // Verificar si el nuevo estado es diferente al último
            const lastState = newHistory[newHistory.length - 1];
            if (lastState &&
                lastState.titulo === newState.titulo &&
                lastState.nota === newState.nota &&
                JSON.stringify(lastState.tareas) === JSON.stringify(newState.tareas)) {
                return prevHistory; // No agregar estados duplicados
            }

            // Agregar el nuevo estado
            const updatedHistory = [...newHistory, newState];

            // Limitar el historial a 100 estados para evitar problemas de memoria
            if (updatedHistory.length > 100) {
                const sliced = updatedHistory.slice(-100);
                setCurrentIndex(sliced.length - 1);
                return sliced;
            }

            // Actualizar el índice al final del historial
            setCurrentIndex(updatedHistory.length - 1);

            return updatedHistory;
        });
    }, [currentIndex, isUndoRedoAction]);

    // Función debounce para agregar al historial después de un retraso
    const debouncedAddToHistory = useCallback((newState) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            addToHistoryImmediate(newState);
        }, 300);
    }, [addToHistoryImmediate]);

    // Función para deshacer
    const undo = useCallback(() => {
        if (currentIndex > 0) {
            setIsUndoRedoAction(true);
            const newIndex = currentIndex - 1;
            const prevState = history[newIndex];

            setCurrentIndex(newIndex);

            // Permitir nuevos cambios después de un breve retraso
            setTimeout(() => setIsUndoRedoAction(false), 50);

            return prevState;
        }
        return null;
    }, [currentIndex, history]);

    // Función para rehacer
    const redo = useCallback(() => {
        if (currentIndex < history.length - 1) {
            setIsUndoRedoAction(true);
            const newIndex = currentIndex + 1;
            const nextState = history[newIndex];

            setCurrentIndex(newIndex);

            // Permitir nuevos cambios después de un breve retraso
            setTimeout(() => setIsUndoRedoAction(false), 50);

            return nextState;
        }
        return null;
    }, [currentIndex, history]);

    // Función para manejar atajos de teclado
    const handleKeyDown = useCallback((e) => {
        // Manejar Ctrl+Z (Deshacer)
        if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            return undo();
        }

        // Manejar Ctrl+Y o Ctrl+Shift+Z (Rehacer)
        if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
            e.preventDefault();
            return redo();
        }

        return null;
    }, [undo, redo]);

    //Nueva función para reiniciar el historial (necesaria para modo edición)
    const resetHistory = useCallback((newInitialState) => {
        // Limpiar cualquier timeout pendiente
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        logDesarrollo('🔄 Reiniciando historial con:', newInitialState);

        // ✅ Asegurar que el nuevo estado tenga la estructura correcta
        const estadoNormalizado = {
            titulo: newInitialState.titulo || "",
            nota: newInitialState.nota || "",
            tareas: Array.isArray(newInitialState.tareas) ? newInitialState.tareas : []
        };

        setHistory([estadoNormalizado]);
        setCurrentIndex(0);
        setIsUndoRedoAction(false);

        logDesarrollo('✅ Historial reiniciado. Nuevo estado:', estadoNormalizado);
    }, []);

    // Verificar si se puede deshacer o rehacer
    const canUndo = currentIndex > 0;
    const canRedo = currentIndex < history.length - 1;

    // Limpiar timeout al desmontar el componente
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        // Estados
        canUndo,
        canRedo,
        isUndoRedoAction,
        currentState: history[currentIndex],

        // Funciones
        addToHistory: debouncedAddToHistory,
        addToHistoryImmediate,
        undo,
        redo,
        handleKeyDown,
        resetHistory,
        getCurrentState
    };
};
import { useState, useCallback, useRef, useEffect } from "react";

export const useUndoRedo = (initialState = {}) => {
    // Estados para el historial
    const [history, setHistory] = useState([initialState]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);
    
    const timeoutRef = useRef(null);

    // Función para agregar un nuevo estado al historial
    const addToHistory = useCallback((newState) => {
        if (isUndoRedoAction) return;

        setHistory(prevHistory => {
            // Eliminar cualquier estado "futuro" si estamos en medio del historial
            const newHistory = prevHistory.slice(0, currentIndex + 1);
            
            // Agregar el nuevo estado
            const updatedHistory = [...newHistory, newState];
            
            // Limitar el historial a 100 estados para evitar problemas de memoria
            if (updatedHistory.length > 100) {
                return updatedHistory.slice(-100);
            }
            
            return updatedHistory;
        });

        setCurrentIndex(prevIndex => {
            const newHistory = history.slice(0, currentIndex + 1);
            newHistory.push(newState);
            return Math.min(newHistory.length - 1, 99);
        });
    }, [currentIndex, history, isUndoRedoAction]);

    // Función debounce para agregar al historial después de un retraso
    const debouncedAddToHistory = useCallback((newState) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
            addToHistory(newState);
        }, 500); // Esperar 500ms después del último cambio
    }, [addToHistory]);

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
        undo,
        redo,
        handleKeyDown
    };
};
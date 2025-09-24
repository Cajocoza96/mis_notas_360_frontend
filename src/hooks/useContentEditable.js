import { useState } from "react";

export const useContentEditable = (initialState, undoRedoHook) => {
    const [titulo, setTitulo] = useState(initialState.titulo || "");
    const [nota, setNota] = useState(initialState.nota || "");

    const {
        canUndo,
        canRedo,
        isUndoRedoAction,
        addToHistory,
        undo,
        redo,
        handleKeyDown: handleUndoRedoKeys
    } = undoRedoHook;

    // Función para actualizar el contenido de los elementos contentEditable
    const updateContentEditable = (state, tituloRef, notaRef) => {
        if (tituloRef?.current) {
            tituloRef.current.textContent = state.titulo;
        }
        if (notaRef?.current) {
            notaRef.current.textContent = state.nota;
        }
        setTitulo(state.titulo);
        setNota(state.nota);
    };

    const handleTituloChange = (tituloRef) => {
        if (tituloRef?.current && !isUndoRedoAction) {
            const newTitulo = tituloRef.current.textContent || "";
            setTitulo(newTitulo);
            addToHistory({ titulo: newTitulo, nota });
        }
    };

    const handleNotaChange = (notaRef) => {
        if (notaRef?.current && !isUndoRedoAction) {
            const newNota = notaRef.current.textContent || "";
            setNota(newNota);
            addToHistory({ titulo, nota: newNota });
        }
    };

    const handleTituloKeyDown = (e, tituloRef, notaRef) => {
        // Manejar atajos de deshacer/rehacer
        const undoRedoResult = handleUndoRedoKeys(e);
        if (undoRedoResult) {
            updateContentEditable(undoRedoResult, tituloRef, notaRef);
            return;
        }

        // Prevenir salto de línea en el título
        if (e.key === 'Enter') {
            e.preventDefault();
            notaRef?.current?.focus();
        }
    };

    const handleNotaKeyDown = (e, tituloRef, notaRef) => {
        // Manejar atajos de deshacer/rehacer
        const undoRedoResult = handleUndoRedoKeys(e);
        if (undoRedoResult) {
            updateContentEditable(undoRedoResult, tituloRef, notaRef);
            return;
        }

        // Permitir saltos de línea en la nota con Enter
        if (e.key === 'Enter') {
            // El comportamiento por defecto ya permite saltos de línea
        }
    };

    // Funciones para los botones
    const handleUndoClick = (tituloRef, notaRef) => {
        const prevState = undo();
        if (prevState) {
            updateContentEditable(prevState, tituloRef, notaRef);
        }
    };

    const handleRedoClick = (tituloRef, notaRef) => {
        const nextState = redo();
        if (nextState) {
            updateContentEditable(nextState, tituloRef, notaRef);
        }
    };

    return {
        titulo,
        nota,
        canUndo,
        canRedo,
        handleTituloChange,
        handleNotaChange,
        handleTituloKeyDown,
        handleNotaKeyDown,
        handleUndoClick,
        handleRedoClick,
        updateContentEditable
    };
};
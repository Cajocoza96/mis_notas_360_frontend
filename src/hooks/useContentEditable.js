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

    // ✅ CAMBIO: Usar innerText para preservar saltos de línea
    const updateContentEditable = (state, tituloRef, notaRef) => {
        if (tituloRef?.current) {
            tituloRef.current.innerText = state.titulo || "";
        }
        if (notaRef?.current) {
            notaRef.current.innerText = state.nota || "";
        }
        setTitulo(state.titulo || "");
        setNota(state.nota || "");
    };

    const handleTituloChange = (tituloRef) => {
        if (tituloRef?.current && !isUndoRedoAction) {
            // ✅ CAMBIO: Usar innerText
            const newTitulo = tituloRef.current.innerText || "";
            setTitulo(newTitulo);
            addToHistory({ titulo: newTitulo, nota });
        }
    };

    const handleNotaChange = (notaRef) => {
        if (notaRef?.current && !isUndoRedoAction) {
            // ✅ CAMBIO: Usar innerText
            const newNota = notaRef.current.innerText || "";
            setNota(newNota);
            addToHistory({ titulo, nota: newNota });
        }
    };

    const handleTituloKeyDown = (e, tituloRef, notaRef) => {
        const undoRedoResult = handleUndoRedoKeys(e);
        if (undoRedoResult) {
            updateContentEditable(undoRedoResult, tituloRef, notaRef);
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            if (notaRef?.current) {
                notaRef.current.focus();
                const range = document.createRange();
                const sel = window.getSelection();
                const contentLength = notaRef.current.childNodes.length;
                if (contentLength > 0) {
                    const lastNode = notaRef.current.childNodes[contentLength - 1];
                    range.setStartAfter(lastNode);
                } else {
                    range.setStart(notaRef.current, 0);
                }
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    };

    const handleNotaKeyDown = (e, tituloRef, notaRef) => {
        const undoRedoResult = handleUndoRedoKeys(e);
        if (undoRedoResult) {
            updateContentEditable(undoRedoResult, tituloRef, notaRef);
            return;
        }
    };

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
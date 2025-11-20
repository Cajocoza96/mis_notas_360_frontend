import { useState, useRef, useEffect } from "react";

export const useContentEditable = (initialState, undoRedoHook) => {
    const [titulo, setTitulo] = useState(initialState.titulo || "");
    const [nota, setNota] = useState(initialState.nota || "");

    // ✅ Referencias para acceder siempre a los valores más recientes
    const tituloRefValue = useRef(titulo);
    const notaRefValue = useRef(nota);
    
    // ✅ Referencias a los elementos DOM
    const elementRefsCache = useRef({ titulo: null, nota: null });

    const {
        canUndo,
        canRedo,
        isUndoRedoAction,
        addToHistory,
        undo,
        redo,
        handleKeyDown: handleUndoRedoKeys,
        getCurrentState
    } = undoRedoHook;

    // Actualizar las referencias cuando cambian los valores
    useEffect(() => {
        tituloRefValue.current = titulo;
    }, [titulo]);

    useEffect(() => {
        notaRefValue.current = nota;
    }, [nota]);

    const updateContentEditable = (state, tituloRef, notaRef) => {
        console.log('🔄 Actualizando contentEditable con:', state);
        
        if (tituloRef?.current) {
            tituloRef.current.innerText = state.titulo || "";
            elementRefsCache.current.titulo = tituloRef.current;
        }
        if (notaRef?.current) {
            notaRef.current.innerText = state.nota || "";
            elementRefsCache.current.nota = notaRef.current;
        }
        
        setTitulo(state.titulo || "");
        setNota(state.nota || "");
    };

    // ✅ CAMBIO CRÍTICO: Obtener valores actuales de los elementos DOM
    const getValoresActuales = () => {
        const tituloActual = elementRefsCache.current.titulo?.innerText || tituloRefValue.current || "";
        const notaActual = elementRefsCache.current.nota?.innerText || notaRefValue.current || "";
        
        return { titulo: tituloActual, nota: notaActual };
    };

    const handleTituloChange = (tituloRef) => {
        if (tituloRef?.current && !isUndoRedoAction) {
            const newTitulo = tituloRef.current.innerText || "";
            elementRefsCache.current.titulo = tituloRef.current;
            
            // ✅ Obtener la nota actual del DOM
            const notaActual = elementRefsCache.current.nota?.innerText || notaRefValue.current || "";
            
            console.log('✏️ Título cambiado:', { titulo: newTitulo, nota: notaActual });
            
            setTitulo(newTitulo);
            addToHistory({ titulo: newTitulo, nota: notaActual });
        }
    };

    const handleNotaChange = (notaRef) => {
        if (notaRef?.current && !isUndoRedoAction) {
            const newNota = notaRef.current.innerText || "";
            elementRefsCache.current.nota = notaRef.current;
            
            // ✅ Obtener el título actual del DOM
            const tituloActual = elementRefsCache.current.titulo?.innerText || tituloRefValue.current || "";
            
            console.log('📝 Nota cambiada:', { titulo: tituloActual, nota: newNota });
            
            setNota(newNota);
            addToHistory({ titulo: tituloActual, nota: newNota });
        }
    };

    const handleTituloKeyDown = (e, tituloRef, notaRef) => {
        // Guardar referencias
        elementRefsCache.current.titulo = tituloRef?.current;
        elementRefsCache.current.nota = notaRef?.current;
        
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
        // Guardar referencias
        elementRefsCache.current.titulo = tituloRef?.current;
        elementRefsCache.current.nota = notaRef?.current;
        
        const undoRedoResult = handleUndoRedoKeys(e);
        if (undoRedoResult) {
            updateContentEditable(undoRedoResult, tituloRef, notaRef);
            return;
        }
    };

    const handleUndoClick = (tituloRef, notaRef) => {
        console.log('⬅️ Undo click');
        
        // Guardar referencias antes del undo
        elementRefsCache.current.titulo = tituloRef?.current;
        elementRefsCache.current.nota = notaRef?.current;
        
        const prevState = undo();
        if (prevState) {
            console.log('Restaurando estado previo:', prevState);
            updateContentEditable(prevState, tituloRef, notaRef);
        }
    };

    const handleRedoClick = (tituloRef, notaRef) => {
        console.log('➡️ Redo click');
        
        // Guardar referencias antes del redo
        elementRefsCache.current.titulo = tituloRef?.current;
        elementRefsCache.current.nota = notaRef?.current;
        
        const nextState = redo();
        if (nextState) {
            console.log('Restaurando estado siguiente:', nextState);
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
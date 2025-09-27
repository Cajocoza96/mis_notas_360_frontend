import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useUndoRedo } from "../../hooks/useUndoRedo";
import { useContentEditable } from "../../hooks/useContentEditable";
import { resetNotaState, setCanUndo, setCanRedo, setTitulo, setNota } from "../../store/layoutSlice";
import Cabecera from "./cabecera/Cabecera";
import CuerpoEdicion from "../../componentes/cuerpo/CuerpoEdicion";
import Footer from "./footer/Footer";

export default function PaginaCrearEditNota() {
    const dispatch = useDispatch();
    const tituloRef = useRef(null);
    const notaRef = useRef(null);

    // Usar el hook de deshacer/rehacer
    const undoRedoHook = useUndoRedo({ titulo: "", nota: "" });

    // Usar el hook de contentEditable
    const {
        titulo,
        nota,
        canUndo,
        canRedo,
        handleTituloChange,
        handleNotaChange,
        handleTituloKeyDown,
        handleNotaKeyDown,
        handleUndoClick,
        handleRedoClick
    } = useContentEditable({ titulo: "", nota: "" }, undoRedoHook);

    // Sincronizar estados con Redux
    useEffect(() => {
        dispatch(setCanUndo(canUndo));
        dispatch(setCanRedo(canRedo));
        dispatch(setTitulo(titulo));
        dispatch(setNota(nota));
    }, [canUndo, canRedo, titulo, nota, dispatch]);

    // Limpiar el estado cuando el componente se desmonta
    useEffect(() => {
        return () => {
            dispatch(resetNotaState());
        };
    }, [dispatch]);

    // Funciones adaptadas para trabajar con las referencias locales
    const handleTituloChangeAdapter = (ref) => {
        handleTituloChange(ref);
    };

    const handleNotaChangeAdapter = (ref) => {
        handleNotaChange(ref);
    };

    const handleTituloKeyDownAdapter = (e, ref) => {
        handleTituloKeyDown(e, ref, notaRef);
    };

    const handleNotaKeyDownAdapter = (e, ref) => {
        handleNotaKeyDown(e, tituloRef, ref);
    };

    const handleUndoClickAdapter = () => {
        handleUndoClick(tituloRef, notaRef);
    };

    const handleRedoClickAdapter = () => {
        handleRedoClick(tituloRef, notaRef);
    };

    return (
        <div className="h-[100svh] bg-white dark:bg-gray-800 min-h-0 min-w-0 overflow-hidden
                        flex flex-col">
            
            <Cabecera 
                ref={tituloRef}
                handleTituloChange={handleTituloChangeAdapter}
                handleTituloKeyDown={handleTituloKeyDownAdapter}
            />

            <CuerpoEdicion 
                ref={notaRef}
                handleNotaChange={handleNotaChangeAdapter}
                handleNotaKeyDown={handleNotaKeyDownAdapter}
            />
            
            <div className="flex-shrink-0 h-11 lg:h-14"></div>

            <Footer 
                handleUndoClick={handleUndoClickAdapter}
                handleRedoClick={handleRedoClickAdapter}
            />
        </div>
    );
}
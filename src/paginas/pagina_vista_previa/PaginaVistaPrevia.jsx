import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useUndoRedo } from "../../hooks/useUndoRedo";
import { useContentEditable } from "../../hooks/useContentEditable";
import { resetNotaState, setCanUndo, setCanRedo, setTitulo, setNota } from "../../store/layoutSlice";

import { HiDotsVertical } from "react-icons/hi";
import { HiOutlineStar } from "react-icons/hi2";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Cuerpo from "../../componentes/cuerpo/Cuerpo";


export default function PaginaVistaPrevia() {

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
        <div className="h-[100svh] bg-white dark:bg-gray-800 min-h-0 min-w-0 
                        overflow-hidden relative
                        flex flex-col">
            <Cabecera
                iconoEstrellaMenu={
                    <div className="w-20 flex flex-row items-center justify-between">
                        <HiOutlineStar className="text-2xl md:text-3xl text-blue-600 dark:text-white cursor-pointer" />
                        <HiDotsVertical className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer" />
                    </div>
                }
            />

            <div className="flex-shrink-0 h-35 md:h-40"></div>

            <div className="overflow-y-auto overflow-x-hidden min-h-0 min-w-0 pb-3 flex-1">
                <Cuerpo
                    ref={notaRef}
                    handleNotaChange={handleNotaChangeAdapter}
                    handleNotaKeyDown={handleNotaKeyDownAdapter}
                />
            </div>

        </div>
    );
}
import React, { useState, useEffect, useRef } from "react";

import { HiX } from "react-icons/hi";

import { useDispatch, useSelector } from "react-redux";

import { agregarTarea, editarTarea, eliminarTarea, toggleVerModalTarea } from "../../store/tareasSlice";

import useIsMobile from "../../hooks/useIsMobile";

export default function ModalTarea() {

    const dispatch = useDispatch();

    const { modoModal, tareaActual } = useSelector((state) => state.tareas);

    const [textoTarea, setTextoTarea] = useState("");
    const inputRef = useRef(null);
    const hasInteractedRef = useRef(false);
    const initialSetupDoneRef = useRef(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        if (modoModal === 'editar' && tareaActual) {
            setTextoTarea(tareaActual.texto);
        } else {
            setTextoTarea("");
        }
        hasInteractedRef.current = false;
        initialSetupDoneRef.current = false;
    }, [modoModal, tareaActual]);

    useEffect(() => {
        if (inputRef.current && textoTarea && !initialSetupDoneRef.current) {
            const length = textoTarea.length;
            inputRef.current.setSelectionRange(length, length);
            inputRef.current.focus();
            initialSetupDoneRef.current = true;
        }
    }, [textoTarea]);

    // Solo registrar el listener de orientación en móviles
    useEffect(() => {
        if (!isMobile) return; // Si no es móvil, no hacer nada

        const handleOrientationChange = () => {
            if (inputRef.current && textoTarea && !hasInteractedRef.current) {
                setTimeout(() => {
                    const length = textoTarea.length;
                    inputRef.current.setSelectionRange(length, length);
                }, 100);
            }
        };

        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, [textoTarea, isMobile]);

    const handleverModalTarea = () => {
        dispatch(toggleVerModalTarea());
        setTextoTarea("");
        hasInteractedRef.current = false;
        initialSetupDoneRef.current = false;
    }

    const handleAgregar = () => {
        if (textoTarea.trim()) {
            if (modoModal === 'crear') {
                dispatch(agregarTarea(textoTarea));
            } else if (modoModal === 'editar' && tareaActual) {
                dispatch(editarTarea({ id: tareaActual.id, texto: textoTarea }));
            }
            handleverModalTarea();
        }
    }

    const handleEliminar = () => {
        if (tareaActual) {
            dispatch(eliminarTarea(tareaActual.id));
            handleverModalTarea();
        }
    }

    const handleInputChange = (e) => {
        setTextoTarea(e.target.value);
        hasInteractedRef.current = true;
    }

    const handleInputInteraction = () => {
        hasInteractedRef.current = true;
    }

    return (
        <>
            <div className="fixed inset-0 z-30 bg-black/70" onClick={handleverModalTarea}></div>


            <div className="bg-white dark:bg-gray-800 
                            z-50  overflow-hidden
                        absolute top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2
                        w-[70%] h-auto
                        flex flex-col gap-5">

                <div className="p-2 flex flex-col">

                    <div className="flex flex-row justify-end">
                        <HiX
                            className="text-xl md:text-2xl
                                text-black dark:text-white cursor-pointer"
                            onClick={handleverModalTarea} />
                    </div>

                    <p className="text-center text-base md:text-xl select-none 
                                text-violet-800 dark:text-white">
                        Casilla de tarea
                    </p>

                    <div className="border-b-3 border-violet-500 p-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={textoTarea}
                            onChange={handleInputChange}
                            onClick={handleInputInteraction}
                            onKeyDown={handleInputInteraction}
                            className="w-full text-base md:text-xl
                                border-0 focus:outline-none
                                text-black dark:text-white"/>
                    </div>

                </div>

                <div className="p-2 w-full bg-violet-800 dark:bg-black
                                flex flex-row items-center justify-around select-none">

                    {modoModal === 'editar' && (
                        <>
                            <p
                                className="text-base md:text-xl text-white cursor-pointer"
                                onClick={handleEliminar}>
                                Eliminar
                            </p>
                        </>
                    )}

                    <div className="text-base md:text-xl text-white" onClick={handleAgregar}>
                        {modoModal === 'editar' && (
                            <p className="cursor-pointer">
                                Editar
                            </p>
                        )}

                        {modoModal === 'crear' && (
                            <p className="cursor-pointer">
                                Añadir
                            </p>
                        )}
                    </div>


                </div>

            </div>
        </>
    );
}
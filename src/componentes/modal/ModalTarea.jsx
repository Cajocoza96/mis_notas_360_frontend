import React, { useState, useEffect, useRef } from "react";

import { HiX } from "react-icons/hi";

import { useDispatch, useSelector } from "react-redux";

import { agregarTarea, editarTarea, eliminarTarea, toggleVerModalTarea } from "../../store/tareasSlice";

import useIsMobile from "../../hooks/useIsMobile";

import { motion } from "framer-motion";

export default function ModalTarea() {

    const dispatch = useDispatch();

    const { modoModal, tareaActual } = useSelector((state) => state.tareas);

    const [textoTarea, setTextoTarea] = useState("");
    const inputRef = useRef(null);
    const hasInteractedRef = useRef(false);
    const initialSetupDoneRef = useRef(false);
    const isMobile = useIsMobile();

    // ✅ Calcular cantidad de caracteres en tiempo real
    const cantTarea = textoTarea ? textoTarea.length : 0;
    const limiteExcedido = cantTarea >= 500;

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
            // ✅ Validar límite antes de agregar/editar
            if (textoTarea.length > 500) {
                alert('La tarea solo permite 500 caracteres');
                return;
            }

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
        const nuevoTexto = e.target.value;
        
        // ✅ Limitar a 500 caracteres máximo
        if (nuevoTexto.length <= 500) {
            setTextoTarea(nuevoTexto);
        }
        
        hasInteractedRef.current = true;
    }

    const handleInputInteraction = () => {
        hasInteractedRef.current = true;
    }

    return (
        <>
            <motion.div
                onClick={handleverModalTarea}
                className="fixed inset-0 z-30 bg-black/70
                            flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>

                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-800 
                                z-50  overflow-hidde
                                w-[70%] h-auto
                                flex flex-col gap-5"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                    }}>

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
                                maxLength={500}
                                className="w-full text-base md:text-xl
                                border-0 focus:outline-none
                                text-black dark:text-white"/>
                        </div>

                    </div>

                    <div className="p-2 w-full bg-violet-800 dark:bg-black select-none
                                    flex flex-col gap-2">
                        <div className="flex flex-row items-center justify-around ">

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

                        {/* ✅ Contador de tarea en tiempo real */}
                        <div className="flex flex-col items-center">
                            <p className={`text-center text-base md:text-xl ${
                                limiteExcedido 
                                    ? "text-red-500" 
                                    : "text-white"
                            }`}>
                                {cantTarea}/500
                            </p>
                        </div>

                    </div>

                </motion.div>
            </motion.div>
        </>
    );
}
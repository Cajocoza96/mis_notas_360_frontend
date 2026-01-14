import React, { useState, useEffect, useRef } from "react";
import { HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { agregarTarea, editarTarea, eliminarTarea, toggleVerModalTarea } from "../../store/tareasSlice";
import useIsMobile from "../../hooks/useIsMobile";
import { motion } from "framer-motion";

import { setVerToast, setMensajeToast } from "../../store/accesoSlice";

// ✅ NUEVO: Recibir addToHistoryImmediate como prop
export default function ModalTarea({ addToHistoryImmediate, tituloRef, notaRef }) {

    const mostrarToast = (mensaje) => {
        dispatch(setMensajeToast(mensaje));
        dispatch(setVerToast(true));

        setTimeout(() => {
            dispatch(setVerToast(false));
        }, 3000);
    };

    const dispatch = useDispatch();

    const { modoModal, tareaActual, tareas } = useSelector((state) => state.tareas);
    const titulo = useSelector((state) => state.tareas.titulo);
    const nota = useSelector((state) => state.tareas.nota);

    const [textoTarea, setTextoTarea] = useState("");
    const inputRef = useRef(null);
    const hasInteractedRef = useRef(false);
    const initialSetupDoneRef = useRef(false);
    const isMobile = useIsMobile();

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

    useEffect(() => {
        if (!isMobile) return;

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
        //setTextoTarea("");
        hasInteractedRef.current = false;
        initialSetupDoneRef.current = false;
    }

    // ✅ Función auxiliar para guardar en el historial
    const guardarEnHistorial = (nuevasTareas) => {
        if (addToHistoryImmediate && tituloRef && notaRef) {
            const tituloActual = tituloRef.current?.innerText || titulo || "";
            const notaActual = notaRef.current?.innerText || nota || "";

            addToHistoryImmediate({
                titulo: tituloActual,
                nota: notaActual,
                tareas: nuevasTareas
            });
        }
    };

    const handleAgregar = () => {
        if (textoTarea.trim()) {
            if (textoTarea.length > 500) {
                mostrarToast('La tarea solo permite 500 caracteres');
                return;
            }

            if (modoModal === 'crear') {
                // ✅ Calcular el siguiente orden_creacion
                const siguienteOrdenCreacion = tareas.length > 0
                    ? Math.max(...tareas.map(t => t.orden_creacion ?? -1)) + 1
                    : 0;

                const nuevaTarea = {
                    id: Date.now(),
                    texto: textoTarea,
                    completada: false,
                    orden_creacion: siguienteOrdenCreacion
                };

                // ✅ Crear nuevo array de tareas con la nueva tarea
                const nuevasTareas = [...tareas, nuevaTarea];

                // ✅ Guardar en historial ANTES de despachar
                guardarEnHistorial(nuevasTareas);

                // Despachar acción
                dispatch(agregarTarea(textoTarea));

            } else if (modoModal === 'editar' && tareaActual) {
                // ✅ Crear nuevo array con la tarea editada
                const nuevasTareas = tareas.map(t =>
                    t.id === tareaActual.id
                        ? { ...t, texto: textoTarea }
                        : t
                );

                // ✅ Guardar en historial ANTES de despachar
                guardarEnHistorial(nuevasTareas);

                // Despachar acción
                dispatch(editarTarea({ id: tareaActual.id, texto: textoTarea }));
            }

            handleverModalTarea();
        }
    }

    const handleEliminar = () => {
        if (tareaActual) {
            // ✅ Crear nuevo array sin la tarea eliminada
            const nuevasTareas = tareas.filter(t => t.id !== tareaActual.id);

            // ✅ Guardar en historial ANTES de despachar
            guardarEnHistorial(nuevasTareas);

            // Despachar acción
            dispatch(eliminarTarea(tareaActual.id));
            handleverModalTarea();
        }
    }

    const handleInputChange = (e) => {
        const nuevoTexto = e.target.value;

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
                className="fixed inset-0 z-50 bg-black/70
                            flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-800 
                                z-50 overflow-hidden
                                w-[75%] 2xs:w-[55%] max-h-[90dvh]
                                flex flex-col ">

                    <div className="flex flex-col flex-1 
                                    min-h-0
                                    overflow-x-hidden overflow-y-auto">

                        <div className="p-2 flex flex-col">

                            <div className="flex flex-row justify-end">
                                <HiX
                                    className="text-xl md:text-2xl
                                text-black dark:text-white cursor-pointer"
                                    onClick={handleverModalTarea} />
                            </div>

                            <p className="text-center text-base md:text-lg select-none 
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
                                    className="w-full text-base md:text-lg
                                border-0 focus:outline-none
                                text-black dark:text-white"/>
                            </div>

                        </div>

                        <div className="p-2 w-full bg-violet-950 dark:bg-black select-none
                                    flex flex-col gap-2">
                            <div className="flex flex-row items-center justify-around ">

                                {modoModal === 'editar' && (
                                    <>
                                        <p
                                            className="text-base md:text-lg text-white cursor-pointer"
                                            onClick={handleEliminar}>
                                            Eliminar
                                        </p>
                                    </>
                                )}

                                <div className="text-base md:text-lg text-white" onClick={handleAgregar}>
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

                            <div className="flex flex-col items-center">
                                <p className={`text-center text-base md:text-lg ${limiteExcedido
                                        ? "text-red-600"
                                        : "text-white"
                                    }`}>
                                    {cantTarea}/500
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
            </motion.div>
        </>
    );
}
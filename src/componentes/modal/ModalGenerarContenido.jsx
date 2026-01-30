import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import { logDesarrollo, errorDesarrollo, registrarError } from "../../utils/errorHandler";

import { setVerToast, setMensajeToast } from "../../store/accesoSlice";

import {
    setProcesandoIA,
    setErrorIA,
    setVerModalGenerarContenido,
    setTitulo,
    setNota,
    setTareas
} from "../../store/tareasSlice";

import { generarContenido } from "../../services/aiService";

export default function ModalGenerarContenido({ tituloRef, notaRef, addToHistoryImmediate }) {

    const dispatch = useDispatch();

    const { procesandoIA, modoIASeleccionado } = useSelector((state) => state.tareas);

    const [promptUsuario, setPromptUsuario] = useState("");

    const MAX_CARACTERES = 255;

    //  Calcular caracteres actuales
    const caracteresActuales = promptUsuario.length;
    const caracteresRestantes = MAX_CARACTERES - caracteresActuales;
    const limiteAlcanzado = caracteresActuales >= MAX_CARACTERES;

    const obtenerNombreMetodoIA = () => {
        switch (modoIASeleccionado) {
            case 'generate-content':
                return 'Generar contenido';
            default:
                return '';
        }
    };

    const mostrarToast = (mensaje) => {
        dispatch(setMensajeToast(mensaje));
        dispatch(setVerToast(true));

        setTimeout(() => {
            dispatch(setVerToast(false));
        }, 3000);
    };

    const handleCancelar = () => {
        if (procesandoIA) return;
        //setPromptUsuario("");
        dispatch(setVerModalGenerarContenido(false));
    };

    //  Manejar cambios en el textarea con límite
    const handleTextareaChange = (e) => {
        const nuevoTexto = e.target.value;
        
        // Solo actualizar si no excede el límite
        if (nuevoTexto.length <= MAX_CARACTERES) {
            setPromptUsuario(nuevoTexto);
        }
    };

    //  Manejar pegado con límite
    const handlePaste = (e) => {
        e.preventDefault();
        
        const textoPegado = (e.clipboardData || window.clipboardData).getData('text/plain');
        const textoActual = promptUsuario;
        
        // Calcular cuánto espacio disponible hay
        const espacioDisponible = MAX_CARACTERES - textoActual.length;
        
        if (espacioDisponible > 0) {
            const textoAPegar = textoPegado.substring(0, espacioDisponible);
            
            // Obtener la posición del cursor
            const target = e.target;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            
            // Insertar el texto en la posición del cursor
            const nuevoTexto = textoActual.substring(0, start) + textoAPegar + textoActual.substring(end);
            
            setPromptUsuario(nuevoTexto);
            
            // Restaurar la posición del cursor después de la actualización
            setTimeout(() => {
                const nuevaPosicion = start + textoAPegar.length;
                target.setSelectionRange(nuevaPosicion, nuevaPosicion);
            }, 0);
        }
    };

    const handleAceptar = async () => {
        try {
            if (!promptUsuario || promptUsuario.trim() === '') {
                mostrarToast('Por favor escribe tu solicitud');
                return;
            }

            dispatch(setProcesandoIA(true));
            dispatch(setErrorIA(null));

            // Llamar al servicio de IA
            const resultado = await generarContenido(promptUsuario);

            if (resultado.success) {
                const { result } = resultado;

                // Actualizar Redux según el tipo de contenido
                if (result.tipo === 'tareas') {
                    // Convertir array de strings a objetos de tarea
                    const tareasFormateadas = result.tareas.map((texto, index) => ({
                        id: `temp-${Date.now()}-${index}`,
                        texto: texto,
                        completada: false
                    }));

                    dispatch(setTitulo(result.titulo));
                    dispatch(setNota('')); // Nota vacía
                    dispatch(setTareas(tareasFormateadas));

                    //  Esperar a que los refs se actualicen y agregar al historial
                    setTimeout(() => {
                        if (addToHistoryImmediate && tituloRef?.current && notaRef?.current) {
                            addToHistoryImmediate({
                                titulo: result.titulo,
                                nota: '',
                                tareas: tareasFormateadas
                            });
                        }
                    }, 100);

                } else {
                    // Contenido de texto
                    dispatch(setTitulo(result.titulo));
                    dispatch(setNota(result.nota));
                    dispatch(setTareas([])); // Tareas vacías

                    //  Esperar a que los refs se actualicen y agregar al historial
                    setTimeout(() => {
                        if (addToHistoryImmediate && tituloRef?.current && notaRef?.current) {
                            addToHistoryImmediate({
                                titulo: result.titulo,
                                nota: result.nota,
                                tareas: []
                            });
                        }
                    }, 100);
                }

                mostrarToast(resultado.successMessage);
                setPromptUsuario("");
                dispatch(setVerModalGenerarContenido(false));
            }

        } catch (error) {
            errorDesarrollo('Error al generar contenido:', error);

            let mensajeError = 'Error al generar contenido';

            if (error.code === 'RATE_LIMIT_AI') {
                mensajeError = error.message;
            } else if (error.message) {
                mensajeError = error.message;
            }

            dispatch(setErrorIA(mensajeError));
            mostrarToast(mensajeError);
        } finally {
            dispatch(setProcesandoIA(false));
        }
    };

    return (
        <>
            <motion.div
                onClick={handleCancelar}
                className="fixed inset-0 z-30 bg-black/70
                            flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-800 
                                z-50 p-3 overflow-hidden
                                w-[75%] 2xs:w-[55%] select-none
                                flex flex-col max-h-[90dvh]">

                    <div className="flex flex-col flex-1 
                                    overflow-y-auto overflow-x-hidden min-h-0">

                        {/* Título del modal */}
                        <div className="mb-4">
                            <p className="text-lg md:text-xl font-semibold text-black dark:text-white">
                                Método de IA escogido:
                            </p>
                            <p className="text-base md:text-lg font-semibold text-violet-800 dark:text-violet-400">
                                {obtenerNombreMetodoIA()}
                            </p>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                                Escribe lo que quieras que la IA genere: texto, ideas, pasos, tareas, investigación, etc.
                            </p>
                        </div>

                        <div className="mb-4 border border-black dark:border-white rounded-xl">
                            <textarea
                                value={promptUsuario}
                                onChange={handleTextareaChange}
                                onPaste={handlePaste}
                                disabled={procesandoIA}
                                maxLength={MAX_CARACTERES}
                                className="w-full resize-none
                                            text-base md:text-lg p-2 
                                            focus:outline-none bg-transparent
                                            text-black dark:text-white
                                            min-h-[120px]"
                                placeholder="Ej: Dame los pasos para hacer flexiones / Escribe un poema sobre el mar / Investiga sobre la fotosíntesis"
                            />

                            {/*  Contador de caracteres */}
                            <div className="px-2 pb-2 z-10 w-full">
                                <p className={`text-sm md:text-base text-right
                                            ${limiteAlcanzado 
                                                ? 'text-red-600' 
                                                : 'text-black dark:text-white'}`}>
                                    {caracteresActuales}/{MAX_CARACTERES}
                                </p>
                            </div>
                        </div>

                        {/* Mensaje de procesando */}
                        {procesandoIA && (
                            <div className="mt-4 p-3 bg-violet-100 dark:bg-violet-900/30 rounded">
                                <p className="text-sm md:text-base text-violet-800 dark:text-violet-300">
                                    Generando contenido... Por favor espera.
                                </p>
                            </div>
                        )}

                    </div>

                    <div className="flex flex-row flex-shrink-0 items-center justify-end gap-6 2xl:gap-7 mt-4">
                        <p
                            onClick={handleCancelar}
                            className={`text-base md:text-lg
                                        ${!procesandoIA ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                                        text-black dark:text-white`}>
                            Cancelar
                        </p>

                        <p
                            onClick={handleAceptar}
                            className={`text-base md:text-lg
                                        ${!procesandoIA
                                    ? 'cursor-pointer text-violet-800 dark:text-violet-400'
                                    : 'cursor-not-allowed opacity-50 text-gray-400'}
                                        `}>
                            {procesandoIA ? 'Procesando...' : 'Aceptar'}
                        </p>
                    </div>

                </div>

            </motion.div>
        </>
    );
}
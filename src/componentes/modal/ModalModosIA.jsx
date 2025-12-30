import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import { FaCircle, FaRegCircle } from "react-icons/fa";
import { FcCheckmark, FcEditImage, FcList, FcTodoList } from "react-icons/fc";

import {
    toggleVerModalModosIA,
    setModoIASeleccionado,
    setProcesandoIA,
    setErrorIA,
    setTitulo,
    setNota,
    setTareas,
    reemplazarTareasConIA
} from "../../store/tareasSlice";

import {
    corregirTexto,
    mejorarRedaccion,
    resumirTexto,
    convertirTextoATareas
} from "../../services/aiService";

export default function ModalModosIA({ tituloRef, notaRef }) {

    const dispatch = useDispatch();

    const verModalModosIA = useSelector((state) => state.tareas.verModalModosIA);
    const { titulo, nota, tareas, procesandoIA } = useSelector((state) => state.tareas);

    const [modoSeleccionado, setModoSeleccionado] = useState(null);

    const handleSeleccionar = (modo) => {
        setModoSeleccionado(modo);
        dispatch(setModoIASeleccionado(modo));
    };

    const handleCancelar = () => {
        if (!procesandoIA && verModalModosIA) {
            setModoSeleccionado(null);
            dispatch(setModoIASeleccionado(null));
            dispatch(toggleVerModalModosIA());
        }
    };

    const construirTextoCompleto = () => {
        let textoCompleto = "";

        // Agregar título si existe
        if (titulo && titulo.trim() !== "") {
            textoCompleto += titulo.trim();
        }

        // Agregar nota si existe
        if (nota && nota.trim() !== "") {
            if (textoCompleto) textoCompleto += "\n\n";
            textoCompleto += nota.trim();
        }

        // Agregar tareas si existen
        if (tareas && tareas.length > 0) {
            if (textoCompleto) textoCompleto += "\n\n";
            textoCompleto += "Tareas:\n";
            tareas.forEach((tarea, index) => {
                textoCompleto += `${index + 1}. ${tarea.texto}\n`;
            });
        }

        return textoCompleto.trim();
    };

    const aplicarCambiosEnComponentes = (resultado) => {
        // Para correct, improve, summarize: reemplazar todo el contenido
        const textoNuevo = resultado.result;

        // Intentar identificar secciones en el texto procesado
        const lineas = textoNuevo.split('\n');

        let nuevoTitulo = "";
        let nuevaNota = "";
        let nuevasTareas = [];
        let enSeccionTareas = false;

        for (let linea of lineas) {
            const lineaTrim = linea.trim();

            // Detectar inicio de sección de tareas
            if (lineaTrim.toLowerCase().startsWith('tarea') && lineaTrim.endsWith(':')) {
                enSeccionTareas = true;
                continue;
            }

            if (enSeccionTareas) {
                // Extraer tareas (quitar numeración si existe)
                const textoTarea = lineaTrim.replace(/^\d+\.\s*/, '').trim();
                if (textoTarea) {
                    nuevasTareas.push(textoTarea);
                }
            } else {
                // Primera línea no vacía es el título
                if (!nuevoTitulo && lineaTrim) {
                    nuevoTitulo = lineaTrim.substring(0, 255); // Límite de título
                } else if (lineaTrim) {
                    // Resto es nota
                    if (nuevaNota) nuevaNota += "\n";
                    nuevaNota += linea;
                }
            }
        }

        // Si no se detectaron secciones, distribuir inteligentemente
        if (!nuevoTitulo && !nuevaNota && !nuevasTareas.length) {
            // Tomar primera línea como título, resto como nota
            const primeraLinea = lineas[0]?.trim() || "";
            const restoLineas = lineas.slice(1).join('\n').trim();

            nuevoTitulo = primeraLinea.substring(0, 255);
            nuevaNota = restoLineas.substring(0, 50000);
        }

        // Limitar caracteres
        nuevaNota = nuevaNota.substring(0, 50000);

        // Actualizar Redux
        if (nuevoTitulo || titulo) {
            dispatch(setTitulo(nuevoTitulo || titulo));
        }
        if (nuevaNota || nota) {
            dispatch(setNota(nuevaNota || nota));
        }

        // Actualizar refs directamente para que se vea el cambio inmediato
        if (tituloRef?.current) {
            tituloRef.current.innerText = nuevoTitulo || titulo || "";
        }
        if (notaRef?.current) {
            notaRef.current.innerText = nuevaNota || nota || "";
        }

        // Si hay tareas generadas, reemplazar
        if (nuevasTareas.length > 0) {
            const tareasObjeto = nuevasTareas.map((texto, index) => ({
                id: Date.now() + index,
                texto: texto.substring(0, 500), // Límite por tarea
                completada: false,
                orden_creacion: tareas.length + index
            }));
            dispatch(setTareas(tareasObjeto));
        }
    };

    const handleAceptar = async () => {
        if (!modoSeleccionado) {
            dispatch(setErrorIA('Por favor selecciona un modo de IA'));
            return;
        }

        try {
            dispatch(setProcesandoIA(true));
            dispatch(setErrorIA(null));

            // Para "convertir a tareas", solo usar la nota
            if (modoSeleccionado === 'text-to-tasks') {
                if (!nota || nota.trim() === "") {
                    dispatch(setErrorIA('No hay contenido en la nota para convertir a tareas'));
                    dispatch(setProcesandoIA(false));
                    return;
                }

                const resultado = await convertirTextoATareas(nota);

                if (resultado.tasks && resultado.tasks.length > 0) {
                    // Reemplazar tareas con las generadas
                    dispatch(reemplazarTareasConIA(resultado.tasks));

                    // Limpiar la nota ya que se convirtió a tareas
                    dispatch(setNota(""));
                    if (notaRef?.current) {
                        notaRef.current.innerText = "";
                    }
                } else {
                    dispatch(setErrorIA('No se pudieron generar tareas del texto'));
                }
            } else {
                // Para correct, improve, summarize: construir texto completo
                const textoCompleto = construirTextoCompleto();

                if (!textoCompleto || textoCompleto.trim() === "") {
                    dispatch(setErrorIA('No hay contenido para procesar'));
                    dispatch(setProcesandoIA(false));
                    return;
                }

                let resultado;

                switch (modoSeleccionado) {
                    case 'correct':
                        resultado = await corregirTexto(textoCompleto);
                        break;
                    case 'improve':
                        resultado = await mejorarRedaccion(textoCompleto);
                        break;
                    case 'summarize':
                        resultado = await resumirTexto(textoCompleto);
                        break;
                    default:
                        throw new Error('Modo no válido');
                }

                // Aplicar cambios en los componentes
                aplicarCambiosEnComponentes(resultado);
            }

            // Cerrar modal
            dispatch(setProcesandoIA(false));
            setModoSeleccionado(null);
            dispatch(setModoIASeleccionado(null));
            dispatch(toggleVerModalModosIA());

        } catch (error) {
            console.error('Error en IA:', error);
            dispatch(setErrorIA(error.message || 'Error al procesar con IA'));
            dispatch(setProcesandoIA(false));

            // Si es rate limit, mostrar y cerrar modal después de 3 segundos
            if (error.code === 'RATE_LIMIT_AI') {
                setTimeout(() => {
                    dispatch(setErrorIA(null));
                    handleCancelar();
                }, 3000);
            }
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

                        {/* Opciones de IA */}
                        <div className="flex flex-col gap-2">

                            {/* Corregir ortografía y gramática */}
                            <div
                                onClick={() => !procesandoIA && handleSeleccionar('correct')}
                                className={`w-fit ${!procesandoIA ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                                            flex flex-row items-center gap-4`}>
                                <div>
                                    {modoSeleccionado === 'correct' ? (
                                        <FaCircle className="text-base md:text-lg text-violet-800 dark:text-violet-400" />
                                    ) : (
                                        <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                    )}
                                </div>

                                <div className="text-2xl md:text-3xl">
                                    <FcCheckmark />
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Corregir ortografía y gramática
                                </p>
                            </div>

                            {/* Mejorar redacción */}
                            <div
                                onClick={() => !procesandoIA && handleSeleccionar('improve')}
                                className={`w-fit ${!procesandoIA ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                                            flex flex-row items-center gap-4`}>
                                <div>
                                    {modoSeleccionado === 'improve' ? (
                                        <FaCircle className="text-base md:text-lg text-violet-800 dark:text-violet-400" />
                                    ) : (
                                        <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                    )}
                                </div>

                                <div className="text-2xl md:text-3xl">
                                    <FcEditImage />
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Mejorar redacción
                                </p>
                            </div>

                            {/* Resumir texto */}
                            <div
                                onClick={() => !procesandoIA && handleSeleccionar('summarize')}
                                className={`w-fit ${!procesandoIA ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                                            flex flex-row items-center gap-4`}>
                                <div>
                                    {modoSeleccionado === 'summarize' ? (
                                        <FaCircle className="text-base md:text-lg text-violet-800 dark:text-violet-400" />
                                    ) : (
                                        <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                    )}
                                </div>
                                <div className="text-2xl md:text-3xl">
                                    <FcList />
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Resumir texto
                                </p>
                            </div>

                            {/* Convertir texto a tareas */}
                            <div
                                onClick={() => !procesandoIA && handleSeleccionar('text-to-tasks')}
                                className={`w-fit ${!procesandoIA ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                                            flex flex-row items-center gap-4`}>
                                <div>
                                    {modoSeleccionado === 'text-to-tasks' ? (
                                        <FaCircle className="text-base md:text-lg text-violet-800 dark:text-violet-400" />
                                    ) : (
                                        <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                    )}
                                </div>
                                <div className="text-2xl md:text-3xl">
                                    <FcTodoList />
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Convertir texto a tareas
                                </p>
                            </div>

                        </div>

                        {/* Mensaje de error o procesando */}
                        {procesandoIA && (
                            <div className="mt-4 p-3 bg-violet-100 dark:bg-violet-900/30 rounded">
                                <p className="text-sm md:text-base text-violet-800 dark:text-violet-300">
                                    Procesando con IA... Por favor espera.
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
                                        ${!procesandoIA && modoSeleccionado ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                                        text-violet-800 dark:text-white`}>
                            {procesandoIA ? 'Procesando...' : 'Aceptar'}
                        </p>
                    </div>

                </div>

            </motion.div>
        </>
    );
}
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import { FaCircle, FaRegCircle } from "react-icons/fa";
import { MdTitle, MdNote, MdList } from "react-icons/md";

import { logDesarrollo, errorDesarrollo, registrarError } from "../../utils/errorHandler";

import {
    toggleVerModalTiNoTa,
    toggleSeccionTitulo,
    toggleSeccionNota,
    toggleSeccionTareas,
    setProcesandoIA,
    setErrorIA,
    setTitulo,
    setNota,
    setTareas,
    resetSeccionesSeleccionadas,
    setModoIASeleccionado,
    reemplazarTareasConIA
} from "../../store/tareasSlice";

import { setVerToast, setMensajeToast } from "../../store/accesoSlice";

import {
    corregirTexto,
    mejorarRedaccion,
    resumirTexto,
    convertirTextoATareas
} from "../../services/aiService";

export default function ModalTiNoTa({ tituloRef, notaRef, addToHistoryImmediate }) {

    const dispatch = useDispatch();

    const {
        titulo,
        nota,
        tareas,
        procesandoIA,
        modoIASeleccionado,
        seccionesSeleccionadas
    } = useSelector((state) => state.tareas);

    // ✅ Obtener el nombre legible del método de IA
    const obtenerNombreMetodoIA = () => {
        switch (modoIASeleccionado) {
            case 'correct':
                return 'Corregir ortografía y gramática';
            case 'improve':
                return 'Mejorar redacción';
            case 'summarize':
                return 'Resumir texto';
            case 'text-to-tasks':
                return 'Convertir texto a tareas';
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

    const handleToggleSeccion = (seccion) => {
        if (procesandoIA) return;

        // ✅ Si es 'text-to-tasks' y se intenta seleccionar tareas, no hacer nada
        if (modoIASeleccionado === 'text-to-tasks' && seccion === 'tareas') {
            return;

        }

        /*
        else if (modoIASeleccionado === 'summarize' && seccion === 'tareas') {
            return;
        }
        */

        switch (seccion) {
            case 'titulo':
                if (titulo && titulo.trim()) {
                    dispatch(toggleSeccionTitulo());
                }
                break;
            case 'nota':
                if (nota && nota.trim()) {
                    dispatch(toggleSeccionNota());
                }
                break;
            case 'tareas':
                if (tareas && tareas.length > 0) {
                    dispatch(toggleSeccionTareas());
                }
                break;
        }
    };

    const handleCancelar = () => {
        if (procesandoIA) return;

        dispatch(resetSeccionesSeleccionadas());
        dispatch(setModoIASeleccionado(null));
        dispatch(toggleVerModalTiNoTa());
    };

    const hayAlgunaSeccionSeleccionada = () => {
        return seccionesSeleccionadas.titulo ||
            seccionesSeleccionadas.nota ||
            seccionesSeleccionadas.tareas;
    };

    // ✅ Función mejorada para aplicar resultados
    const aplicarResultado = (resultado, esConversionATareas = false) => {

        // Guardar estados previos para el historial
        const estadoPrevio = {
            titulo: titulo || "",
            nota: nota || "",
            tareas: tareas || []
        };

        // ✅ CASO ESPECIAL: Convertir texto a tareas
        if (esConversionATareas) {

            // Variables para el nuevo estado
            let nuevoTitulo = titulo;
            let nuevaNota = nota;
            let nuevasTareas = [...(tareas || [])];

            // Actualizar título si fue seleccionado
            if (seccionesSeleccionadas.titulo && resultado.titulo !== undefined) {
                nuevoTitulo = resultado.titulo.substring(0, 255);
                dispatch(setTitulo(nuevoTitulo));
                if (tituloRef?.current) {
                    tituloRef.current.innerText = nuevoTitulo;
                }
            }

            // Actualizar nota si fue seleccionada
            if (seccionesSeleccionadas.nota && resultado.nota !== undefined) {
                nuevaNota = resultado.nota.substring(0, 50000);
                dispatch(setNota(nuevaNota));
                if (notaRef?.current) {
                    notaRef.current.innerText = nuevaNota;
                }
            }

            // ✅ SIEMPRE actualizar tareas cuando hay tareas en el resultado
            if (resultado.tareas !== undefined && Array.isArray(resultado.tareas) && resultado.tareas.length > 0) {

                // Solo enviar los textos, el reducer se encarga de crear los objetos
                const textosTareas = resultado.tareas.map(texto => texto.substring(0, 500));
                dispatch(reemplazarTareasConIA(textosTareas)); // Agregar en lugar de setTareas

                // ✅ Calcular el orden_creacion basado en las tareas existentes
                const maxOrden = nuevasTareas.length > 0
                    ? Math.max(...nuevasTareas.map(t => t.orden_creacion ?? -1))
                    : -1;

                // Obtener las nuevas tareas para el historial
                const tareasGeneradasPorIA = resultado.tareas.map((texto, index) => ({
                    id: Date.now() + index,
                    texto: texto.substring(0, 500),
                    completada: false,
                    orden_creacion: maxOrden + 1 + index // ✅ Continuar desde el último orden
                }));

                // ✅ AGREGAR las nuevas tareas a las existentes
                nuevasTareas = [...nuevasTareas, ...tareasGeneradasPorIA];
            }

            // ✅ Agregar al historial DESPUÉS de aplicar todos los cambios
            if (addToHistoryImmediate) {
                const nuevoEstado = {
                    titulo: nuevoTitulo,
                    nota: nuevaNota,
                    tareas: nuevasTareas
                };

                logDesarrollo('📝 Agregando al historial (text-to-tasks):', {
                    previo: estadoPrevio,
                    nuevo: nuevoEstado,
                    tareasPrevias: estadoPrevio.tareas.length,
                    tareasNuevas: nuevoEstado.tareas.length
                });

                addToHistoryImmediate(nuevoEstado);
            }

            return;
        }

        // ✅ OTROS CASOS: Corregir, Mejorar, Resumir
        // Variables para el nuevo estado
        let nuevoTitulo = titulo;
        let nuevaNota = nota;
        let nuevasTareas = tareas || [];

        // ✅ OTROS CASOS: Corregir, Mejorar, Resumir
        // Actualizar título si fue seleccionado
        if (seccionesSeleccionadas.titulo && resultado.titulo !== undefined) {
            nuevoTitulo = resultado.titulo.substring(0, 255);
            dispatch(setTitulo(nuevoTitulo));
            if (tituloRef?.current) {
                tituloRef.current.innerText = nuevoTitulo;
            }
        }

        // Actualizar nota si fue seleccionada
        if (seccionesSeleccionadas.nota && resultado.nota !== undefined) {
            nuevaNota = resultado.nota.substring(0, 50000);
            dispatch(setNota(nuevaNota));
            if (notaRef?.current) {
                notaRef.current.innerText = nuevaNota;
            }
        }

        // Actualizar tareas PRESERVANDO completada e id
        if (seccionesSeleccionadas.tareas && resultado.tareas !== undefined && Array.isArray(resultado.tareas)) {
            /*
            const tareasObjeto = resultado.tareas.map((texto, index) => ({
                id: Date.now() + index,
                texto: texto.substring(0, 500),
                completada: false,
                orden_creacion: index
            }));
            dispatch(setTareas(tareasObjeto));
            nuevasTareas = tareasObjeto;
            */
            // ✅ Mapear las tareas modificadas preservando completada, id y orden_creacion
            const tareasModificadas = resultado.tareas.map((textoModificado, index) => {
                const tareaOriginal = tareas[index]; // Obtener la tarea original correspondiente

                return {
                    id: tareaOriginal?.id || Date.now() + index, // ✅ Preservar ID original
                    texto: textoModificado.substring(0, 500), // ✅ Nuevo texto de la IA
                    completada: tareaOriginal?.completada ?? false, // ✅ PRESERVAR estado completada
                    orden_creacion: tareaOriginal?.orden_creacion ?? index // ✅ PRESERVAR orden
                };
            });

            dispatch(setTareas(tareasModificadas));
            nuevasTareas = tareasModificadas;
        }

        // ✅ Agregar al historial DESPUÉS de aplicar todos los cambios
        if (addToHistoryImmediate) {
            const nuevoEstado = {
                titulo: nuevoTitulo,
                nota: nuevaNota,
                tareas: nuevasTareas
            };

            logDesarrollo('📝 Agregando al historial (otros métodos IA):', {
                previo: estadoPrevio,
                nuevo: nuevoEstado
            });

            addToHistoryImmediate(nuevoEstado);
        }
    };

    const handleAceptar = async () => {
        if (!hayAlgunaSeccionSeleccionada() || procesandoIA) return;

        try {
            dispatch(setProcesandoIA(true));
            dispatch(setErrorIA(null));

            // Preparar datos según las secciones seleccionadas
            const tituloParaEnviar = seccionesSeleccionadas.titulo ? titulo : "";
            const notaParaEnviar = seccionesSeleccionadas.nota ? nota : "";

            // Cambio: Siempre enviar las tareas existentes para 'text-to-tasks'
            //const tareasParaEnviar = seccionesSeleccionadas.tareas ? tareas : [];
            const tareasParaEnviar = modoIASeleccionado === 'text-to-tasks'
                ? tareas.map(t => t.texto) // Enviar todas las tareas como array de strings
                : (seccionesSeleccionadas.tareas ? tareas : []);

            let resultado;

            switch (modoIASeleccionado) {
                case 'correct':
                    resultado = await corregirTexto(tituloParaEnviar, notaParaEnviar, tareasParaEnviar);
                    aplicarResultado(resultado.result, false);

                    // ✅ Mostrar advertencia si hay tareas con problemas
                    if (resultado.hasWarnings) {
                        mostrarToast(resultado.warningMessage);
                    }
                    break;

                case 'improve':
                    resultado = await mejorarRedaccion(tituloParaEnviar, notaParaEnviar, tareasParaEnviar);
                    aplicarResultado(resultado.result, false);

                    // ✅ Mostrar advertencia si hay tareas con problemas
                    if (resultado.hasWarnings) {
                        mostrarToast(resultado.warningMessage);
                    }
                    break;

                case 'summarize':
                    resultado = await resumirTexto(tituloParaEnviar, notaParaEnviar, tareasParaEnviar);
                    aplicarResultado(resultado.result, false);

                    // ✅ Mostrar advertencia si hay tareas con problemas
                    if (resultado.hasWarnings) {
                        mostrarToast(resultado.warningMessage);
                    }
                    break;

                case 'text-to-tasks':
                    resultado = await convertirTextoATareas(tituloParaEnviar, notaParaEnviar, tareasParaEnviar);
                    // ✅ Pasar true para indicar que es conversión a tareas
                    aplicarResultado(resultado.result, true);

                    // ✅ Mostrar advertencia si hay tareas con problemas
                    if (resultado.hasWarnings) {
                        mostrarToast(resultado.warningMessage);
                    }
                    break;

                default:
                    throw new Error('Modo no válido');
            }

            // Cerrar modal y resetear
            dispatch(setProcesandoIA(false));
            dispatch(resetSeccionesSeleccionadas());
            dispatch(setModoIASeleccionado(null));
            dispatch(toggleVerModalTiNoTa());

        } catch (error) {
            errorDesarrollo('Error en IA:', error);

            // ✅ Mostrar error en Toast
            mostrarToast(error.message || 'Error al procesar con IA');

            dispatch(setProcesandoIA(false));

            // Si es rate limit, cerrar modal después de mostrar el toast
            if (error.code === 'RATE_LIMIT_AI') {
                setTimeout(() => {
                    handleCancelar();
                }, 3000);
            }
        }
    };

    // ✅ Verificar si una sección está disponible
    const seccionDisponible = (seccion) => {
        // ✅ Si es 'text-to-tasks', deshabilitar la sección de tareas
        if (modoIASeleccionado === 'text-to-tasks' && seccion === 'tareas') {
            return false;
        }

        switch (seccion) {
            case 'titulo':
                return titulo && titulo.trim() !== '';
            case 'nota':
                return nota && nota.trim() !== '';
            case 'tareas':
                return tareas && tareas.length > 0;
            default:
                return false;
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
                                Selecciona dónde aplicar la IA:
                            </p>
                            <p className="text-base md:text-lg font-semibold text-violet-800 dark:text-violet-400">
                                {obtenerNombreMetodoIA()}
                            </p>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                                Puedes seleccionar una o varias secciones
                            </p>
                        </div>

                        {/* Opciones para escoger titulo, nota, tareas */}
                        <div className="flex flex-col gap-2">

                            {/* Título */}
                            <div
                                onClick={() => handleToggleSeccion('titulo')}
                                className={`w-fit flex flex-row items-center gap-4
                                    ${seccionDisponible('titulo') && !procesandoIA
                                        ? 'cursor-pointer'
                                        : 'cursor-not-allowed opacity-50'}`}>

                                <div>
                                    {seccionesSeleccionadas.titulo ? (
                                        <FaCircle className="text-base md:text-lg text-violet-800 dark:text-violet-400" />
                                    ) : (
                                        <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                    )}
                                </div>

                                <div className="text-2xl md:text-3xl text-black dark:text-white">
                                    <MdTitle />
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Título
                                </p>
                            </div>

                            {/* Nota */}
                            <div
                                onClick={() => handleToggleSeccion('nota')}
                                className={`w-fit flex flex-row items-center gap-4
                                    ${seccionDisponible('nota') && !procesandoIA
                                        ? 'cursor-pointer'
                                        : 'cursor-not-allowed opacity-50'}`}>

                                <div>
                                    {seccionesSeleccionadas.nota ? (
                                        <FaCircle className="text-base md:text-lg text-violet-800 dark:text-violet-400" />
                                    ) : (
                                        <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                    )}
                                </div>

                                <div className="text-2xl md:text-3xl text-black dark:text-white">
                                    <MdNote />
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Nota
                                </p>
                            </div>

                            {/* Tarea */}
                            <div
                                onClick={() => handleToggleSeccion('tareas')}
                                className={`w-fit flex flex-row items-center gap-4
                                    ${seccionDisponible('tareas') && !procesandoIA
                                        ? 'cursor-pointer'
                                        : 'cursor-not-allowed opacity-50'}`}>

                                <div>
                                    {seccionesSeleccionadas.tareas ? (
                                        <FaCircle className="text-base md:text-lg text-violet-800 dark:text-violet-400" />
                                    ) : (
                                        <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                    )}
                                </div>

                                <div className="text-2xl md:text-3xl text-black dark:text-white">
                                    <MdList />
                                </div>
                                <p className="text-base md:text-lg text-black dark:text-white">
                                    Tareas
                                </p>
                            </div>
                        </div>

                        {/* Mensaje de procesando */}
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
                                        ${!procesandoIA && hayAlgunaSeccionSeleccionada()
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
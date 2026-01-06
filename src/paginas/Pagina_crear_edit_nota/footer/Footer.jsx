import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiReply, HiCheck, HiPlusCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import {
    setModoModal, setTareaActual,
    toggleVerModalTarea, resetNotaState
} from "../../../store/tareasSlice";

import { useContadores } from "../../../hooks/useContadores";

import { mostrarNotificacion, ocultarNotificacion } from "../../../store/anotacionesSlice";

import { crearAnotacion, actualizarAnotacion } from "../../../services/anotacionesService";

import CargandoNoHayNada from "../../../componentes/cargando_no_hay_nada/CargandoNoHayNada";

import { setVerToast, setMensajeToast } from "../../../store/accesoSlice";

import { logDesarrollo, errorDesarrollo, registrarError } from "../../../utils/errorHandler";

export default function Footer({ handleUndoClick, handleRedoClick, esModoEdicion, tituloRef, notaRef }) {
    const { actualizarContadores } = useContadores();

    const [procesando, setProcesando] = useState(false);

    const {
        canUndo,
        canRedo,
        estadoSeleccionado,
        anotacionId,
        tareas  // Obtenemos las tareas del estado Redux
    } = useSelector((state) => state.tareas);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleverModalTarea = () => {
        dispatch(setModoModal('crear'));
        dispatch(setTareaActual(null));
        dispatch(toggleVerModalTarea());
    }

    const ordenTareasSeleccionado = useSelector((state) => state.tareas.ordenTareasSeleccionado);

    const handleGuardarYRedirigir = async () => {
        try {
            // IMPORTANTE: Obtener los valores actuales directamente de los refs
            let tituloActual = '';
            let notaActual = '';

            if (tituloRef && tituloRef.current) {
                tituloActual = tituloRef.current.innerText || '';
            }

            if (notaRef && notaRef.current) {
                notaActual = notaRef.current.innerText || '';
            }

            // ✅ LIMPIEZA: Remover placeholders si se colaron
            const placeholdersTitulo = ['Sin título', 'Colocar título'];
            const placeholdersNota = ['Sin nota', 'Colocar nota'];

            if (placeholdersTitulo.includes(tituloActual.trim())) {
                tituloActual = '';
            }

            if (placeholdersNota.includes(notaActual.trim())) {
                notaActual = '';
            }

            // ✅ Trim para remover espacios en blanco innecesarios
            tituloActual = tituloActual.trim();
            notaActual = notaActual.trim();

            logDesarrollo('=== DEBUG GUARDAR ===');
            logDesarrollo('Título limpio:', tituloActual);
            logDesarrollo('Nota limpia:', notaActual);
            logDesarrollo('Estado:', estadoSeleccionado);
            logDesarrollo('Tareas:', tareas);
            logDesarrollo('==================');

            /*
            // Preparar el array de tareas con su estado de completado
            const tareasParaGuardar = tareas.map(tarea => ({
                texto: tarea.texto,
                completada: tarea.completada  // true o false
            }));
            */

            // ✅ IMPORTANTE: Ordenar tareas por orden_creacion antes de guardar
            const tareasParaGuardar = [...tareas]
                .sort((a, b) => {
                    const ordenA = a.orden_creacion !== undefined ? a.orden_creacion : 999999;
                    const ordenB = b.orden_creacion !== undefined ? b.orden_creacion : 999999;
                    return ordenA - ordenB;
                })
                .map(tarea => ({
                    texto: tarea.texto,
                    completada: tarea.completada  // true o false
                }));

            logDesarrollo('Tareas ANTES de ordenar:', tareas);
            logDesarrollo('Tareas DESPUES de ordenar por creacion', tareasParaGuardar);

            // ✅ Obtener el orden de tareas seleccionado
            const ordenTareasActual = ordenTareasSeleccionado; // Desde Redux

            // Preparar el payload
            const payload = {
                titulo: tituloActual,
                nota: notaActual,
                estado: estadoSeleccionado,
                tareas: tareasParaGuardar,
                ordenTareas: ordenTareasActual // ✅ Agregar orden de tareas
            };

            logDesarrollo('Payload a enviar:', payload);

            // Determinar si es guardar nuevo o actualizar existente
            const esActualizacion = esModoEdicion && anotacionId !== null;

            let data;
            if (esActualizacion) {
                setProcesando(true);
                data = await actualizarAnotacion(anotacionId, payload);
                setProcesando(false);
                logDesarrollo('Actualización exitosa:', data);

                // ✅ Mostrar notificación de éxito para actualización
                dispatch(mostrarNotificacion({
                    mensaje: '¡Nota actualizada!',
                    esError: false
                }));

            } else {
                setProcesando(true);
                data = await crearAnotacion(payload);
                setProcesando(false);
                logDesarrollo('Guardado exitoso:', data);

                // ✅ Mostrar notificación de éxito para creación
                dispatch(mostrarNotificacion({
                    mensaje: '¡Nota guardada!',
                    esError: false
                }));
            }

            await actualizarContadores();

            // Ocultar el modal automaticamente despues de 3 segundos
            setTimeout(() => {
                dispatch(ocultarNotificacion());
            }, 2000);

            // ✅ Redirigir después de un pequeño delay para que se vea el modal
            setTimeout(() => {
                navigate('/panel-principal', { state: { recargar: true } });

                // Resetear el estado después de navegar
                setTimeout(() => {
                    dispatch(resetNotaState());
                }, 500);
            }, 2000); // Esperar 3 segundos antes de redirigir

        } catch (error) {
            setProcesando(false);
            errorDesarrollo('Error al guardar y redirigir:', error);

            // ✅ DETECTAR ERROR DE RATE LIMIT
            if (error.code === 'RATE_LIMIT_EXCEEDED') {
                // ✅ Mostrar Toast con el mensaje del backend (detail)
                // El mensaje ya viene en error.message desde anotacionesService
                dispatch(setMensajeToast(error.message));
                dispatch(setVerToast(true));

                setTimeout(() => {
                    dispatch(setVerToast(false));
                }, 3000);
            } else {
                // ✅ Para otros errores, mostrar notificación normal
                dispatch(mostrarNotificacion({
                    mensaje: '¡Error al guardar la nota!',
                    esError: true
                }));

                setTimeout(() => {
                    dispatch(ocultarNotificacion());
                }, 2000);
            }
        }
    }

    return (
        <div className="p-2 z-10 w-full
                        bg-violet-300 dark:bg-black
                        grid grid-cols-3">

            {procesando && (<CargandoNoHayNada pantallaCompletaCarga={true} />)}

            <div className="flex flex-col items-center select-none">

                <div className="flex flex-col 
                                2xs:flex-row items-center gap-2 cursor-pointer"
                    onClick={handleverModalTarea}>
                    <HiPlusCircle className="text-2xl md:text-3xl  text-violet-800 dark:text-violet-400 " />
                    <p className="text-base md:text-lg text-black dark:text-white">
                        Agregar tarea
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 select-none">
                <p className="text-black dark:text-white text-sm text-center">
                    No funciona en IA
                </p>
                <div className="flex flex-row items-center justify-center gap-5">
                    {/* Botón Deshacer */}
                    <HiReply
                        className={`text-2xl md:text-3xl transition-opacity
                                ${canUndo
                                ? 'text-black dark:text-white hover:opacity-80 cursor-pointer'
                                : 'text-gray-600 dark:text-gray-500 cursor-not-allowed opacity-50'
                            }`}
                        onClick={canUndo ? handleUndoClick : undefined}
                        title="Deshacer (Ctrl+Z)"
                    />

                    {/* Botón Rehacer */}
                    <HiReply
                        className={`transform -scale-x-100 text-2xl md:text-3xl transition-opacity
                                ${canRedo
                                ? 'text-black dark:text-white hover:opacity-80 cursor-pointer'
                                : 'text-gray-600 dark:text-gray-500 cursor-not-allowed opacity-50'
                            }`}
                        onClick={canRedo ? handleRedoClick : undefined}
                        title="Rehacer (Ctrl+Y)"
                    />
                </div>
            </div>

            {/* Al dar clic aquí se manda la información a la base de datos */}
            <div className="flex flex-col items-center justify-center">
                <HiCheck
                    className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleGuardarYRedirigir}
                    title="Guardar y volver al panel principal" />
            </div>
        </div>
    );
}
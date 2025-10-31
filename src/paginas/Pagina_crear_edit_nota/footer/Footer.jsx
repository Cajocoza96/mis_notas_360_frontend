import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiReply, HiCheck, HiPlusCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import {
    setModoModal, setTareaActual,
    toggleVerModalTarea, resetNotaState
} from "../../../store/tareasSlice";

import { useContadores } from "../../../hooks/useContadores";

export default function Footer({ handleUndoClick, handleRedoClick, esModoEdicion, tituloRef, notaRef }) {
    const { actualizarContadores } = useContadores();
    const API_URL = import.meta.env.VITE_API_URL;

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

    const handleGuardarYRedirigir = async () => {
        try {
            // IMPORTANTE: Obtener los valores actuales directamente de los refs
            let tituloActual = '';
            let notaActual = '';

            if (tituloRef && tituloRef.current) {
                tituloActual = tituloRef.current.textContent || '';
            }

            if (notaRef && notaRef.current) {
                notaActual = notaRef.current.textContent || '';
            }

            console.log('=== DEBUG GUARDAR ===');
            console.log('Título del ref:', tituloActual);
            console.log('Nota del ref:', notaActual);
            console.log('Estado:', estadoSeleccionado);
            console.log('Tareas:', tareas);
            console.log('==================');

            // Preparar el array de tareas con su estado de completado
            const tareasParaGuardar = tareas.map(tarea => ({
                texto: tarea.texto,
                completada: tarea.completada  // true o false
            }));

            // Determinar si es guardar nuevo o actualizar existente
            const esActualizacion = esModoEdicion && anotacionId !== null;
            const url = esActualizacion
                ? `${API_URL}/anotaciones/actualizar/${anotacionId}`
                : `${API_URL}/anotaciones/guardar`;

            const metodo = esActualizacion ? 'PUT' : 'POST';

            const payload = {
                titulo: tituloActual,
                nota: notaActual,
                estado: estadoSeleccionado,
                tareas: tareasParaGuardar
            };

            console.log('Payload a enviar:', payload);

            // Guardar o actualizar la anotación con las tareas
            const response = await fetch(url, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();

                await actualizarContadores();
                console.log(esActualizacion ? 'Actualización exitosa:' : 'Guardado exitoso:', data);

                // Redirigir al panel principal
                navigate('/panel-principal', { state: { recargar: true } });

                setTimeout(() => {
                    /* Resetear el estado de la nota y tareas, con un 
                    1 segundo para que no se vea el reseteo*/
                    dispatch(resetNotaState());
                }, 1000);

            } else {
                const errorData = await response.json();
                console.error('Error al guardar la anotación:', errorData);
                alert('Error al guardar la anotación. Por favor intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error al guardar y redirigir:', error);
            alert('Error de conexión. Por favor verifica tu conexión a internet.');
        }
    }

    return (
        <div className="p-2 z-10 w-full
                        bg-blue-200 dark:bg-black
                        grid grid-cols-3">

            <div className="flex flex-col items-center select-none">

                <div className="flex flex-col 
                                2xs:flex-row items-center gap-2 cursor-pointer"
                    onClick={handleverModalTarea}>
                    <HiPlusCircle className="text-2xl md:text-3xl  text-blue-600" />
                    <p className="text-base md:text-xl text-black dark:text-white">
                        Agregar tarea
                    </p>
                </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-5">
                {/* Botón Deshacer */}
                <HiReply
                    className={`text-2xl md:text-3xl cursor-pointer transition-opacity
                                ${canUndo
                            ? 'text-black dark:text-white hover:opacity-80'
                            : 'text-gray-600 dark:text-gray-500 cursor-not-allowed opacity-50'
                        }`}
                    onClick={canUndo ? handleUndoClick : undefined}
                    title="Deshacer (Ctrl+Z)"
                />

                {/* Botón Rehacer */}
                <HiReply
                    className={`transform -scale-x-100 text-2xl md:text-3xl cursor-pointer transition-opacity
                                ${canRedo
                            ? 'text-black dark:text-white hover:opacity-80'
                            : 'text-gray-600 dark:text-gray-500 cursor-not-allowed opacity-50'
                        }`}
                    onClick={canRedo ? handleRedoClick : undefined}
                    title="Rehacer (Ctrl+Y)"
                />
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
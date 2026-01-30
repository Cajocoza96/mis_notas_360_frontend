import React from "react";

import { FaRegCircle } from "react-icons/fa";

import { HiDotsHorizontal, HiCheckCircle } from "react-icons/hi";

import { useDispatch, useSelector } from "react-redux";

import { toggleVerModalTarea, toggleCompletarTarea, 
        setTareaActual, setModoModal } from "../../store/tareasSlice";

export default function Tarea({ tarea, esModoVistaPrevia, 
                                addToHistoryImmediate, tituloRef, notaRef }) {

    const dispatch = useDispatch();

    //  Obtener estado actual desde Redux
    const { tareas } = useSelector((state) => state.tareas);

    const handleTareaLista = () => {
        // Solo permitir completar/descompletar si NO estamos en modo vista previa
        if (!esModoVistaPrevia) {
            dispatch(toggleCompletarTarea(tarea.id));

            //  Agregar al historial DESPUÉS de cambiar el estado de completada
            setTimeout(() => {
                if (addToHistoryImmediate && tituloRef?.current && notaRef?.current) {
                    const nuevoEstado = {
                        titulo: tituloRef.current.innerText || "",
                        nota: notaRef.current.innerText || "",
                        tareas: tareas.map(t => 
                            t.id === tarea.id 
                                ? { ...t, completada: !t.completada }
                                : t
                        )
                    };
                    addToHistoryImmediate(nuevoEstado);
                }
            }, 0);
        }
    }

    const handleverModalTarea = () => {
        // Solo abrir el modal si NO estamos en modo vista previa
        if (!esModoVistaPrevia) {
            dispatch(setModoModal('editar'));
            dispatch(setTareaActual(tarea));
            dispatch(toggleVerModalTarea());
        }
    }

    return (
        <div className="p-2 flex flex-row justify-between items-center gap-2">

            <div className="flex flex-row items-center gap-2 flex-1 min-w-0">

                <div onClick={handleTareaLista} className="flex-shrink-0">

                    {tarea.completada ?
                        <HiCheckCircle className={`text-xl md:text-2xl
                                                text-violet-800 dark:text-violet-400 ${esModoVistaPrevia ? 'cursor-default' : 'cursor-pointer'}`} />
                        :
                        <FaRegCircle className={`text-base md:text-xl 
                                                text-black dark:text-white ${esModoVistaPrevia ? 'cursor-default' : 'cursor-pointer'}`} />
                    }

                </div>

                <p 
                    data-tarea-id={tarea.id}
                    data-tarea-texto="true"
                    className={`text-base md:text-lg text-black dark:text-white break-words
                                ${tarea.completada ? 'line-through' : ''} 
                                ${esModoVistaPrevia ? 'cursor-default' : ''}`}>
                    {tarea.texto}
                </p>
            </div>

            {/* Solo mostrar el icono de opciones si NO estamos en modo vista previa */}
            {!esModoVistaPrevia && (
                <HiDotsHorizontal
                    className="flex-shrink-0 text-2xl md:text-3xl text-black dark:text-white cursor-pointer"
                    onClick={handleverModalTarea}
                />
            )}

        </div>
    );
}
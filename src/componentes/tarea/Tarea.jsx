import React from "react";

import { FaRegCircle } from "react-icons/fa";

import { HiDotsHorizontal, HiCheckCircle } from "react-icons/hi";

import { useDispatch } from "react-redux";

import { toggleVerModalTarea } from "../../store/tareasSlice";

import { toggleCompletarTarea, setTareaActual, setModoModal } from "../../store/tareasSlice";

export default function Tarea({ tarea, esModoVistaPrevia }) {

    const dispatch = useDispatch();

    const handleTareaLista = () => {
        // Solo permitir completar/descompletar si NO estamos en modo vista previa
        if (!esModoVistaPrevia) {
            dispatch(toggleCompletarTarea(tarea.id));
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
        <div className="p-2 flex flex-row justify-between">

            <div className="flex flex-row items-center gap-2">

                <div onClick={handleTareaLista}>

                    {tarea.completada ?
                        <HiCheckCircle className={`text-xl md:text-2xl
                                                text-blue-600 ${esModoVistaPrevia ? 'cursor-default' : 'cursor-pointer'}`} />
                        :
                        <FaRegCircle className={`text-base md:text-xl 
                                                text-black dark:text-white ${esModoVistaPrevia ? 'cursor-default' : 'cursor-pointer'}`} />
                    }

                </div>

                
                {/*Unicamente en esta ocacion cuando se este en vista-previa/nota/:id 
                por medio de la function del filtrado de busqueda debe mostrar resaltado de 
                color text-violet-400 el resultado de la busqueda por el filtro de busqueda.

                Esto corresponde a la tabla tareas en la columna texto_tarea
                */}
                <p className={`text-base md:text-xl text-black dark:text-white
                                ${tarea.completada ? 'line-through' : ''} 
                                ${esModoVistaPrevia ? 'cursor-default' : ''}`}>
                    {tarea.texto}
                </p>
            </div>

            {/* Solo mostrar el icono de opciones si NO estamos en modo vista previa */}
            {!esModoVistaPrevia && (
                <HiDotsHorizontal
                    className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer"
                    onClick={handleverModalTarea}
                />
            )}

        </div>
    );
}
import React from "react";

import { useDispatch } from "react-redux";

import { toggleVerModalOrdenTareas } from "../../../store/tareasSlice";

export default function OrdenarTareasPor() {

    const dispatch = useDispatch();

    const handleVerModalOrdenarTareas = () => {
        dispatch(toggleVerModalOrdenTareas());
    }

    return (
        <div 
            onClick={handleVerModalOrdenarTareas}
            className="p-2 z-10 w-full bg-gray-400 dark:bg-gray-950 select-none
                        text-sm md:text-base text-black dark:text-white
                        flex items-center justify-center">

            <div className="cursor-pointer">

                {/*En este <span> quiero que aparezca el tipo de orden que se escogio,
                pueden ser:
                1. Creación (que corresponde a la columna fecha_creacion en ASC de la tabla tareas
                2. Ascendiente (que corresponde al contenido que hay en la columna texto_tarea
                de la tabla tareas, quiero que se ordene de manera ascendiente )
                3. Descendiente (que corresponde al contenido que hay en la columna texto_tarea
                de la tabla tareas, quiero que se ordene de manera descendiente)
                */}
                
                <p>
                    Tareas en orden de: <span>Creación</span>
                </p>
            </div>

        </div>
    );
}
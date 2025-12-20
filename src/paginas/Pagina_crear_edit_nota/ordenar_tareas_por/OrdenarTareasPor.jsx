import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { toggleVerModalOrdenTareas } from "../../../store/tareasSlice";

export default function OrdenarTareasPor() {

    const dispatch = useDispatch();

    const ordenTareasTemporal = useSelector((state) => state.tareas.ordenTareasTemporal);

    const handleVerModalOrdenarTareas = () => {
        dispatch(toggleVerModalOrdenTareas());
    }

    // Mapeo de textos
    const textoOrden = {
        'creacion': 'Creación',
        'ascendente': 'Ascendente (A-Z)',
        'descendente': 'Descendente (Z-A)'
    };

    return (
        <div
            className="p-2 z-10 w-full bg-gray-400 dark:bg-gray-950 select-none
                        text-sm md:text-base text-black dark:text-white
                        flex items-center justify-center">

            <div
                onClick={handleVerModalOrdenarTareas}
                className="cursor-pointer">
                <p>
                    Tareas en orden de: <span>{textoOrden[ordenTareasTemporal]}</span>
                </p>
            </div>

        </div>
    );
}
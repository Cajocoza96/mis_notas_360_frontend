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
                <p>
                    Tareas en orden de: <span>Creación</span>
                </p>
            </div>

        </div>
    );
}
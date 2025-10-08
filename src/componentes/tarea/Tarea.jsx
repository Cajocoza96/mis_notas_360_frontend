import React, { useState } from "react";

import { FaRegCircle } from "react-icons/fa";

import { HiDotsHorizontal, HiCheckCircle } from "react-icons/hi";

import { useDispatch } from "react-redux";

import { toggleVerModalTarea } from "../../store/layoutSlice";

import { toggleCompletarTarea, setTareaActual, setModoModal } from "../../store/tareasSlice";

export default function Tarea({ tarea }) {

    const dispatch = useDispatch();

    const [tarealista, setTareaLista] = useState(false);

    const handleTareaLista = () => {
        dispatch(toggleCompletarTarea(tarea.id));
    }

    const handleverModalTarea = () => {

        dispatch(setModoModal('editar'));
        dispatch(setTareaActual(tarea));
        dispatch(toggleVerModalTarea());
    }

    return (
        <div className="p-2 flex flex-row justify-between">

            <div className="flex flex-row items-center gap-2 select-none">

                <div onClick={handleTareaLista}>

                    {tarea.completada ?
                        <HiCheckCircle className="text-xl md:text-2xl
                                            text-blue-600 cursor-pointer"/>
                        :
                        <FaRegCircle className="text-base md:text-xl 
                                                text-black dark:text-white cursor-pointer" />
                    }

                </div>


                <p className={`text-base md:text-xl text-black dark:text-white
                                ${tarea.completada ? 'line-through' : ''} `}>
                    {tarea.texto}
                </p>
            </div>

            <HiDotsHorizontal 
                    className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer" 
                    onClick={handleverModalTarea}
                    />

        </div>
    );
}
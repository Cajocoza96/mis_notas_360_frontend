import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiReply, HiCheck, HiPlusCircle } from "react-icons/hi";

import { toggleVerModalTarea } from "../../../store/layoutSlice";

import { setModoModal, setTareaActual } from "../../../store/tareasSlice";

export default function Footer({ handleUndoClick, handleRedoClick }) {

    const { canUndo, canRedo } = useSelector((state) => state.layout);

    const dispatch = useDispatch();

    const handleverModalTarea = () => {
        
        dispatch(setModoModal('crear'));
        dispatch(setTareaActual(null));
        dispatch(toggleVerModalTarea());
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

            <div className="flex flex-col items-center justify-center">
                <HiCheck className="text-2xl md:text-3xl  text-black dark:text-white cursor-pointer" />
            </div>
        </div>
    );
}
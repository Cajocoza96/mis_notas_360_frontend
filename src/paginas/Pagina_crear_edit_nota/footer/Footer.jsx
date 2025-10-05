import React from "react";
import { useSelector } from "react-redux";
import { HiReply, HiCheck } from "react-icons/hi";

export default function Footer({ handleUndoClick, handleRedoClick }) {
    const { canUndo, canRedo } = useSelector((state) => state.layout);

    return (
        <div className="p-2 z-10 w-full
                        bg-blue-200 dark:bg-black
                        flex flex-row items-center justify-around">

            <div></div>

            <div className="flex flex-row items-center gap-6">
                {/* Botón Deshacer */}
                <HiReply
                    className={`text-xl md:text-2xl cursor-pointer transition-opacity
                                ${canUndo
                            ? 'text-black dark:text-white hover:opacity-80'
                            : 'text-gray-600 dark:text-gray-500 cursor-not-allowed opacity-50'
                        }`}
                    onClick={canUndo ? handleUndoClick : undefined}
                    title="Deshacer (Ctrl+Z)"
                />

                {/* Botón Rehacer */}
                <HiReply
                    className={`transform -scale-x-100 text-xl md:text-2xl cursor-pointer transition-opacity
                                ${canRedo
                            ? 'text-black dark:text-white hover:opacity-80'
                            : 'text-gray-600 dark:text-gray-500 cursor-not-allowed opacity-50'
                        }`}
                    onClick={canRedo ? handleRedoClick : undefined}
                    title="Rehacer (Ctrl+Y)"
                />
            </div>

            <HiCheck className="text-xl md:text-2xl text-black dark:text-white cursor-pointer" />
        </div>
    );
}
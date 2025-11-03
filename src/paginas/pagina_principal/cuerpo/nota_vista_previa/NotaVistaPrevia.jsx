import React from "react";

import { HiMinusCircle, HiClock, HiCheckCircle } from "react-icons/hi";

import { HiOutlineStar } from "react-icons/hi2";

import { useNavigate } from "react-router-dom";

export default function NotaVistaPrevia({ anotacionId, iconoFavorito, texto, no_asignado,
    pendiente, finalizado }) {

    const navigate = useNavigate();

    const handleVerVistaPrevia = () => {
        navigate(`/vista-previa/nota/${anotacionId}`);
    }

    return (
        <div className={`w-full h-35 p-2 rounded-md select-none
                        flex flex-col items-center gap-1 overflow-hidden
                        hover:opacity-80 transition-opacity cursor-pointer
                        ${no_asignado ? 'bg-blue-200 dark:bg-blue-950' :
                        pendiente ? 'bg-yellow-200 dark:bg-yellow-950' :
                        finalizado ? 'bg-green-200 dark:bg-green-950' : 'bg-gray-200 dark:bg-black'}`}
            onClick={handleVerVistaPrevia}>

            <div className="w-full flex flex-row items-start justify-between">

                {iconoFavorito && (
                    <HiOutlineStar className="text-2xl md:text-3xl cursor-pointer
                    text-violet-800 dark:text-white" />
                )}

                <div className="text-2xl md:text-3xl">

                    {no_asignado && (
                        <HiMinusCircle className="text-blue-700" />
                    )}

                    {pendiente && (
                        <HiClock className="text-yellow-700" />
                    )}

                    {finalizado && (
                        <HiCheckCircle className="text-green-700" />
                    )}

                </div>
            </div>

            <div className="w-full h-25 text-center overflow-hidden 
                            flex flex-col items-center justify-center">
                <p className="text-base md:text-xl line-clamp-3 w-full px-1
                            text-black dark:text-white">
                    {texto}
                </p>
            </div>

        </div>
    );
}
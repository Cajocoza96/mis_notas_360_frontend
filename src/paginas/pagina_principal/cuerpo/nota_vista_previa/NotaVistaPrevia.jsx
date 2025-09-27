import React from "react";

import { HiOutlineStar } from "react-icons/hi2";

import { HiMinusCircle } from "react-icons/hi";

import { useNavigate } from "react-router-dom";

export default function NotaVistaPrevia({ texto }) {

    const navigate = useNavigate();

    const handleVerVistaPrevia = () => navigate("/vista-previa/nota");

    return (
        <div className="w-full h-35 p-2 rounded-md select-none
                        flex flex-col items-center gap-1 overflow-hidden
                        bg-blue-200 dark:bg-black"
            onClick={handleVerVistaPrevia}>

            <div className="w-full flex flex-row items-start justify-between">
                <HiOutlineStar className="text-2xl md:text-3xl cursor-pointer
                                        text-blue-600 dark:text-white" />

                <HiMinusCircle className="text-2xl md:text-3xl
                                        text-blue-600 dark:text-white"/>
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
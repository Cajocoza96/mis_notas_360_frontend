import React from "react";

import { HiOutlineStar } from "react-icons/hi2";

import { HiSearch, HiPlus } from "react-icons/hi";

import { useDispatch } from "react-redux";

import { toggleVerModalCrear, toggleVerPaletaColores } from "../../../store/layoutSlice";

import { useNavigate } from "react-router-dom";

export default function Footer() {

    const dispatch = useDispatch();

    const handleVerModalCrear = () => {
        dispatch(toggleVerModalCrear())
    }

    const handleVerPaletaColores = () => {
        dispatch(toggleVerPaletaColores())
    }

    const navigate = useNavigate();

    const handleNavegarBuscar = () => navigate("/buscar");

    const handleNavegarEstado = () => navigate("/estados");

    return (
        <div className="fixed bottom-0 p-2 z-10 min-h-0 min-w-0 w-full">

            <div className="grid grid-cols-5 items-center">

                <div className="w-full h-full p-1 active:bg-gray-300 dark:active:bg-gray-600
                                rounded-sm cursor-pointer
                                flex items-center justify-center"
                    onClick={handleNavegarEstado}>
                    <p className="text-base md:text-xl 
                                text-blue-600 dark:text-white">
                        Estados
                    </p>
                </div>

                <div className="w-full h-full p-1 active:bg-gray-300 dark:active:bg-gray-600
                                rounded-sm cursor-pointer
                                flex items-center justify-center"
                    onClick={handleNavegarBuscar}>
                    <HiSearch className="text-2xl md:text-3xl text-blue-600 dark:text-white" />
                </div>

                <div className="w-full h-full p-1 active:bg-gray-300 dark:active:bg-gray-600
                                rounded-sm cursor-pointer
                                flex items-center justify-center"
                    onClick={handleVerModalCrear}>
                    <div className="bg-blue-600 rounded-[50%] p-2
                                flex item-center justify-center">
                        <HiPlus className="text-2xl md:text-3xl text-white" />
                    </div>
                </div>

                <div className="w-full h-full p-1 active:bg-gray-300 dark:active:bg-gray-600
                                rounded-sm cursor-pointer
                                flex items-center justify-center">
                    <HiOutlineStar className="text-2xl md:text-3xl text-blue-600 dark:text-white" />
                </div>

                <div className="w-full h-full p-1 active:bg-gray-300 dark:active:bg-gray-600
                                rounded-sm cursor-pointer
                                flex items-center justify-center"
                    onClick={handleVerPaletaColores}>
                    <div className="rounded-[50%] p-3 border border-black
                                    [background:linear-gradient(135deg,#2563eb_50%,transparent_50%)]"></div>

                </div>
            </div>

        </div>
    );
}
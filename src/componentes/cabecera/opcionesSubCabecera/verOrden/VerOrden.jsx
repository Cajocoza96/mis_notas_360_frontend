import React from "react";

import { useDispatch } from "react-redux";

import { toggleVerOpcionesCabecera, toggleVerOrden } from "../../../../store/layoutSlice";

import SubOpcionesCabecera from "../SubOpcionesCabecera";

import { HiCheckCircle } from "react-icons/hi";

export default function VerOrden() {

    const dispatch = useDispatch();

    const handleOrdenarNotas = () => {

        requestAnimationFrame(() => {
            dispatch(toggleVerOrden())
            dispatch(toggleVerOpcionesCabecera())
        })

    }

    return (
        <>
            <div className="w-full p-1 border-b border-gray-400 select-none
                                                text-black dark:text-white
                                                bg-white dark:bg-gray-800 cursor-pointer">
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Ordenar por"
                />
            </div>

            <div className="w-full p-1 border-b border-gray-400 select-none
                                                    text-black dark:text-white 
                                                    bg-gray-300 dark:bg-gray-700 cursor-pointer"
                onClick={handleOrdenarNotas}>
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Título"

                /* 
                circulo={theme === "dark" && (
                    <HiCheckCircle className="text-2xl md:text-3xl text-blue-600" />
                )}
                */
                />
            </div>

            <div className="w-full p-1 border-b border-gray-400 select-none
                                                    text-black dark:text-white 
                                                    bg-gray-300 dark:bg-gray-700 cursor-pointer"
                onClick={handleOrdenarNotas}>
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Fecha de creación"

                /* 
                circulo={theme === "dark" && (
                    <HiCheckCircle className="text-2xl md:text-3xl text-blue-600" />
                )}
                */
                />
            </div>

            <div className="w-full p-1 border-b border-gray-400 select-none
                                                    text-black dark:text-white 
                                                    bg-gray-300 dark:bg-gray-700 cursor-pointer"
                onClick={handleOrdenarNotas}>
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Fecha de modificación"

                /* 
                circulo={theme === "dark" && (
                    <HiCheckCircle className="text-2xl md:text-3xl text-blue-600" />
                )}
                */
                />
            </div>

        </>
    );
}
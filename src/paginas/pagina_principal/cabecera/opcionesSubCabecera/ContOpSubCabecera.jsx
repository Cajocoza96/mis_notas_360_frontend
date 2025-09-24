import React from "react";

import { useTheme } from "../../../../hooks/useTheme";

import { useDispatch, useSelector } from "react-redux";

import { toggleVerOpcionesCabecera, toogleVerModo } from "../../../../store/layoutSlice";

import OpcionesCabecera from "./OpcionesCabecera";

import VerModo from "./verModo/VerModo";

import { HiOutlineDesktopComputer, HiOutlineMoon, HiOutlineSun,
        HiMenuAlt3, HiOutlineTrash } from "react-icons/hi";

export default function ContOpSubCabecera() {

    const { theme } = useTheme();

    const dispatch = useDispatch();

    const handleVerOpcionesCabecera = () => {
        dispatch(toggleVerOpcionesCabecera())
    }

    const handleVerModo = () => {
        dispatch(toogleVerModo())
    }

    const verOpcionesCabecera = useSelector((state) => state.layout.verOpcionesCabecera);

    const verModo = useSelector((state) => state.layout.verModo);

    return (
        <>
            <div className="fixed inset-0 z-20 bg-black/70" onClick={handleVerOpcionesCabecera}></div>
            <div className="fixed bottom-0 z-20 w-full h-auto bg-white">

                {verOpcionesCabecera && !verModo && (
                    <>
                        <div className="w-full p-1 border-b border-gray-400
                                        text-black dark:text-white 
                                        bg-white dark:bg-gray-800 cursor-pointer">
                            <OpcionesCabecera
                                iconoOpcion={<HiMenuAlt3 className="text-xl md:text-2xl" />}
                                nombreOpcion="Ordenar"
                            />
                        </div>

                        <div className="w-full p-1 border-b border-gray-400
                                        text-black dark:text-white 
                                        bg-white dark:bg-gray-800 cursor-pointer"
                            onClick={handleVerModo}>
                            <OpcionesCabecera
                                iconoOpcion={theme == "system" && (
                                    <HiOutlineDesktopComputer className="text-xl md:text-2xl" />) ||
                                    theme == "light" && (
                                        <HiOutlineSun className="text-xl md:text-2xl" />) ||
                                    theme == "dark" && (
                                        <HiOutlineMoon className="text-xl md:text-2xl" />)
                                }
                                nombreOpcion={theme == "system" && ("Sistema (predeterminado)") ||
                                    theme == "light" && ("Claro") ||
                                    theme == "dark" && ("Oscuro")
                                }
                            />
                        </div>

                        <div className="w-full p-1 border-b border-gray-400
                                        text-black dark:text-white 
                                        bg-white dark:bg-gray-800 cursor-pointer">
                            <OpcionesCabecera
                                iconoOpcion={<HiOutlineTrash className="text-xl md:text-2xl" />}
                                nombreOpcion="Papelera"
                            />
                        </div>
                    </>
                )}

                {verModo && (
                    <VerModo />
                )}

            </div>
        </>
    );
}
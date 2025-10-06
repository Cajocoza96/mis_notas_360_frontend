import React from "react";

import { useNavigate } from "react-router-dom";

import { useTheme } from "../../../hooks/useTheme";

import { useDispatch, useSelector } from "react-redux";

import {
    toggleVerOpcionesCabecera, toggleVerOpcCabPagVisPrev,
    toogleVerModo, toggleVerOrden, toggleVerFechaCreaModCantText
} from "../../../store/layoutSlice";

import OpcionesCabecera from "./OpcionesCabecera";

import VerModo from "./verModo/VerModo";

import VerOrden from "./verOrden/VerOrden";

import VerFechaCreaModCantText from "./ver_fecha_crea_mod_cant_text/VerFechaCreaModCantText";

import {
    HiOutlineDesktopComputer, HiOutlineMoon, HiOutlineSun,
    HiMenuAlt3, HiOutlineTrash, HiOutlineInformationCircle
} from "react-icons/hi";

export default function ContOpSubCabecera() {

    const { theme } = useTheme();

    const dispatch = useDispatch();

    const handleVerOpcionesCabecera = () => {
        dispatch(toggleVerOpcionesCabecera())
    }

    const handleVerModo = () => {
        dispatch(toogleVerModo())
    }

    const handleVerOrden = () => {
        dispatch(toggleVerOrden())
    }

    const handleVerOpcCabPagVisPrev = () => {

        requestAnimationFrame(() => {
            dispatch(toggleVerOpcCabPagVisPrev())
            dispatch(toggleVerFechaCreaModCantText())
        })
    }

    const handleVerFechaCreaModCantText = () => {
        dispatch(toggleVerFechaCreaModCantText())
    }

    const verOpcionesCabecera = useSelector((state) => state.layout.verOpcionesCabecera);

    const verModo = useSelector((state) => state.layout.verModo);

    const verOrden = useSelector((state) => state.layout.verOrden);

    const verOpcCabPagVisPrev = useSelector((state) => state.layout.verOpcCabPagVisPrev);

    const verFechaCreaModCantText = useSelector((state) => state.layout.verFechaCreaModCantText);

    const navigate = useNavigate();

    const handleNavegarPapelera = () => {
        dispatch(toggleVerOpcionesCabecera())
        navigate("/papelera");
    }

    return (
        <>
            {verOpcionesCabecera && (
                <>
                    <div className="fixed inset-0 z-20 bg-black/70" onClick={handleVerOpcionesCabecera}></div>
                    <div className="fixed bottom-0 z-20 w-full h-auto bg-white">

                        {verOpcionesCabecera && !verModo && !verOrden && (
                            <>
                                <div className="w-full p-1 border-b border-gray-400
                                        text-black dark:text-white 
                                        bg-white dark:bg-gray-800 cursor-pointer"
                                    onClick={handleVerOrden}>
                                    <OpcionesCabecera
                                        className="justify-start"
                                        iconoOpcion={<HiMenuAlt3 className="text-2xl md:text-3xl" />}
                                        nombreOpcion="Ordenar"
                                    />
                                </div>

                                <div className="w-full p-1 border-b border-gray-400
                                        text-black dark:text-white 
                                        bg-white dark:bg-gray-800 cursor-pointer"
                                    onClick={handleVerModo}>
                                    <OpcionesCabecera
                                        className="justify-start"
                                        iconoOpcion={theme == "system" && (
                                            <HiOutlineDesktopComputer className="text-2xl md:text-3xl" />) ||
                                            theme == "light" && (
                                                <HiOutlineSun className="text-2xl md:text-3xl" />) ||
                                            theme == "dark" && (
                                                <HiOutlineMoon className="text-2xl md:text-3xl" />)
                                        }
                                        nombreOpcion={theme == "system" && ("Sistema (predeterminado)") ||
                                            theme == "light" && ("Claro") ||
                                            theme == "dark" && ("Oscuro")
                                        }
                                    />
                                </div>

                                <div className="w-full p-1 border-b border-gray-400
                                        text-black dark:text-white 
                                        bg-white dark:bg-gray-800 cursor-pointer"
                                    onClick={handleNavegarPapelera}>
                                    <OpcionesCabecera
                                        className="justify-start"
                                        iconoOpcion={<HiOutlineTrash className="text-2xl md:text-3xl" />}
                                        nombreOpcion="Papelera"
                                    />
                                </div>
                            </>
                        )}

                        {verModo && (
                            <VerModo />
                        )}

                        {verOrden && (
                            <VerOrden />
                        )}

                    </div>
                </>
            )}

            {verOpcCabPagVisPrev && (
                <>
                    <div className="fixed inset-0 z-20 bg-black/70" onClick={handleVerOpcCabPagVisPrev}></div>
                    <div className="fixed bottom-0 z-20 w-full h-auto bg-white">

                        {verOpcCabPagVisPrev && !verFechaCreaModCantText && (
                            <>
                                <div className="w-full p-1 border-b border-gray-400
                                        text-black dark:text-white
                                        bg-white dark:bg-gray-800 cursor-pointer"
                                    onClick={handleVerFechaCreaModCantText}>
                                    <OpcionesCabecera
                                        className="justify-center"
                                        iconoOpcion={<HiOutlineInformationCircle className="text-2xl md:text-3xl" />}
                                    />
                                </div>

                                <div className="w-full p-1 border-b border-gray-400
                                        text-black dark:text-white
                                        bg-white dark:bg-gray-800 cursor-pointer">
                                    <OpcionesCabecera
                                        className="justify-center"
                                        iconoOpcion={<HiOutlineTrash className="text-2xl md:text-3xl" />}
                                    />
                                </div>

                            </>
                        )}

                        {verFechaCreaModCantText && (
                            <VerFechaCreaModCantText />
                        )}

                    </div>

                </>
            )}
        </>
    );
}
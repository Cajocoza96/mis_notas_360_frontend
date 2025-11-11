import React from "react";

import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import { useTheme } from "../../../hooks/useTheme";

import { useDispatch, useSelector } from "react-redux";

import {
    toggleVerOpcionesCabecera, toggleVerOpcCabPagVisPrev, toggleVerFechaCreaModCantText
} from "../../../store/layoutSlice";

import { toggleVerModo, toggleVerOrden } from "../../../store/preferenciaSlice";

import { toggleVerModalPapeleraNota, toggleVerModalEliminarNotaDefinitiva } from "../../../store/tareasSlice";

import OpcionesCabecera from "./OpcionesCabecera";

import VerModo from "./verModo/VerModo";

import VerOrden from "./verOrden/VerOrden";

import VerFechaCreaModCantText from "./ver_fecha_crea_mod_cant_text/VerFechaCreaModCantText";

import {
    HiOutlineDesktopComputer, HiOutlineMoon, HiOutlineSun,
    HiMenuAlt3, HiOutlineTrash, HiOutlineInformationCircle, HiSelector
} from "react-icons/hi";

import { MdDeleteForever } from "react-icons/md";

export default function ContOpSubCabecera() {

    const { theme } = useTheme();

    const dispatch = useDispatch();

    const handleVerOpcionesCabecera = () => {
        dispatch(toggleVerOpcionesCabecera())
    }

    const handleVerModo = () => {
        dispatch(toggleVerModo())
    }

    const handleSeleccionarTodo = () => {
        dispatch(toggleVerOpcionesCabecera())
    }

    const handleVerOrden = () => {
        dispatch(toggleVerOrden())
    }

    const handleVerOpcCabPagVisPrev = () => {
        dispatch(toggleVerOpcCabPagVisPrev())

        if (verFechaCreaModCantText) {
            dispatch(toggleVerFechaCreaModCantText());
        }
    }

    const handleVerFechaCreaModCantText = () => {
        dispatch(toggleVerFechaCreaModCantText())
    }

    const handleVerPapeleraNota = () => {
        if (verOpcCabPagVisPrev) {
            dispatch(toggleVerOpcCabPagVisPrev())
        }
        dispatch(toggleVerModalPapeleraNota())
    }

    const handleVerEliminarNotaDefinitiva = () => {
        if (verOpcCabPagVisPrev) {
            dispatch(toggleVerOpcCabPagVisPrev())
        }
        dispatch(toggleVerModalEliminarNotaDefinitiva())
    }


    const verOpcionesCabecera = useSelector((state) => state.layout.verOpcionesCabecera);

    const verModo = useSelector((state) => state.preferencia.verModo);

    const verOrden = useSelector((state) => state.preferencia.verOrden);

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

                    <motion.div
                        className="fixed bottom-0 z-20 w-full h-auto bg-white"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}>

                        {verOpcionesCabecera && !verModo && !verOrden && (
                            <>  
                                {/*
                                <div className="w-full p-1 border-b border-gray-400
                                        text-black dark:text-white 
                                        bg-white dark:bg-gray-800 cursor-pointer"
                                    onClick={handleSeleccionarTodo}>
                                    <OpcionesCabecera
                                        className="justify-start"
                                        iconoOpcion={<HiSelector className="text-2xl md:text-3xl" />}
                                        nombreOpcion="Seleccionar todo"
                                    />
                                </div>
                                */}

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
                                        iconoOpcion={theme == "sistema" && (
                                            <HiOutlineDesktopComputer className="text-2xl md:text-3xl" />) ||
                                            theme == "claro" && (
                                                <HiOutlineSun className="text-2xl md:text-3xl" />) ||
                                            theme == "oscuro" && (
                                                <HiOutlineMoon className="text-2xl md:text-3xl" />)
                                        }
                                        nombreOpcion={theme == "sistema" && ("Sistema (predeterminado)") ||
                                            theme == "claro" && ("Claro") ||
                                            theme == "oscuro" && ("Oscuro")
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

                    </motion.div>
                </>
            )}

            {verOpcCabPagVisPrev && (
                <>
                    <div className="fixed inset-0 z-20 bg-black/70" onClick={handleVerOpcCabPagVisPrev}></div>

                    <motion.div
                        className="fixed bottom-0 z-20 w-full h-auto bg-white"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}>

                        {verOpcCabPagVisPrev && !verFechaCreaModCantText && (
                            <>
                                <div className="w-full p-1 border-b border-gray-400
                                        text-black dark:text-white
                                        bg-white dark:bg-gray-800 cursor-pointer">
                                    <OpcionesCabecera
                                        className="justify-center"
                                        iconoOpcion={<HiOutlineInformationCircle
                                            onClick={handleVerFechaCreaModCantText}
                                            className="text-2xl md:text-3xl" />}
                                    />
                                </div>

                                <div className="w-full p-1 border-b border-gray-400
                                        text-black dark:text-white
                                        bg-white dark:bg-gray-800 cursor-pointer">
                                    <OpcionesCabecera
                                        className="justify-center"
                                        iconoOpcion={

                                            /*Al dar clic aqui se debe mostrar el modal*/
                                            <HiOutlineTrash
                                                onClick={handleVerPapeleraNota}
                                                className="text-2xl md:text-3xl" />}
                                    />
                                </div>

                                <div className="w-full p-1 border-b border-gray-400
                                        text-red-700 dark:text-red-500
                                        bg-white dark:bg-gray-800 cursor-pointer">
                                    <OpcionesCabecera
                                        className="justify-center"
                                        iconoOpcion={

                                            <MdDeleteForever
                                                onClick={handleVerEliminarNotaDefinitiva}
                                                className="text-3xl md:text-4xl" />}
                                    />
                                </div>

                            </>
                        )}

                        {verFechaCreaModCantText && (
                            <VerFechaCreaModCantText />
                        )}

                    </motion.div>

                </>
            )}
        </>
    );
}
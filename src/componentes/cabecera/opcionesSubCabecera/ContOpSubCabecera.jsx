import React from "react";

import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import { useTheme } from "../../../hooks/useTheme";

import { useDispatch, useSelector } from "react-redux";

import {
    toggleVerOpcionesCabecera, toggleVerOpcCabPagVisPrev, toggleVerFechaCreaModCantText
} from "../../../store/layoutSlice";

import { toggleVerModo, toggleVerOrden } from "../../../store/preferenciaSlice";

import {
    toggleVerModalPapeleraNota, toggleVerModalPapeleraTodasLasNotas,
    toggleVerModalEliminarNotaDefinitiva,
    toggleVerModalEliminarTodasLasNotasDefinitivo, setAnotacionId
} from "../../../store/tareasSlice";

import { toggleSeleccionarTodasAnotaciones, limpiarSeleccion } from "../../../store/anotacionesSlice";

import OpcionesCabecera from "./OpcionesCabecera";

import VerModo from "./verModo/VerModo";

import VerOrden from "./verOrden/VerOrden";

import VerFechaCreaModCantText from "./ver_fecha_crea_mod_cant_text/VerFechaCreaModCantText";

import {
    HiOutlineDesktopComputer, HiOutlineMoon, HiOutlineSun,
    HiMenuAlt3, HiOutlineTrash, HiOutlineInformationCircle, HiSelector
} from "react-icons/hi";

import useConexionInternet from "../../../hooks/useConexionInternet";

import { MdDeleteForever } from "react-icons/md";

export default function ContOpSubCabecera() {

    const { isOnline } = useConexionInternet();

    const { theme } = useTheme();

    const dispatch = useDispatch();

    //  Estados de selección
    const seleccionar = useSelector((state) => state.anotaciones.seleccionar);
    const seleccionarTodo = useSelector((state) => state.anotaciones.seleccionarTodo);
    const anotacionesSeleccionadas = useSelector((state) => state.anotaciones.anotacionesSeleccionadas);

    const { anotaciones = [] } = useSelector((state) => state.anotaciones);

    const handleVerOpcionesCabecera = () => {
        dispatch(toggleVerOpcionesCabecera())
    }

    const handleVerModo = () => {
        if (!isOnline) {
            return
        } else {
            dispatch(toggleVerModo())
        }
    }

    //  Manejar seleccionar todo / anular selección
    const handleSeleccionarTodo = () => {
        if (verOpcionesCabecera) {
            dispatch(toggleVerOpcionesCabecera());
        }
        dispatch(toggleSeleccionarTodasAnotaciones());
    }

    // Mover seleccionadas a papelera
    const handleMoverSeleccionadasPapelera = () => {
        if (verOpcionesCabecera) {
            dispatch(toggleVerOpcionesCabecera());
        }

        // Mostrar modal de confirmación para mover a papelera
        dispatch(toggleVerModalPapeleraTodasLasNotas());
    }

    // Eliminar seleccionadas definitivamente
    const handleEliminarSeleccionadasDefinitivo = () => {
        if (verOpcionesCabecera) {
            dispatch(toggleVerOpcionesCabecera());
        }
        dispatch(toggleVerModalEliminarTodasLasNotasDefinitivo());
    }


    const handleVerOrden = () => {
        if (!isOnline) {
            return
        } else {
            dispatch(toggleVerOrden())
        }
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
                <motion.div
                    className="fixed inset-0 z-20 bg-black/70"
                    onClick={handleVerOpcionesCabecera}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}>

                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        className="fixed bottom-0 z-20 w-full h-auto bg-white"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}>

                        {verOpcionesCabecera && !verModo && !verOrden && (
                            <>
                                {/*  Opciones cuando NO está en modo selección */}
                                {!seleccionar && (
                                    <>
                                        {anotaciones.length > 0 && isOnline && (
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
                                        )}

                                        {/*Cuando seleccionar sea true esto va a ocultarse*/}
                                        <div className={`w-full p-1 border-b border-gray-400
                                        text-black dark:text-white 
                                        ${!isOnline ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                        bg-white dark:bg-gray-800`}
                                            onClick={handleVerOrden}>
                                            <OpcionesCabecera
                                                className="justify-start"
                                                iconoOpcion={<HiMenuAlt3 className="text-2xl md:text-3xl" />}
                                                nombreOpcion="Ordenar"
                                            />
                                        </div>

                                        {/*Cuando seleccionar sea true esto va a ocultarse*/}
                                        <div className={`w-full p-1 border-b border-gray-400
                                        ${!isOnline ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                        text-black dark:text-white 
                                        bg-white dark:bg-gray-800`}
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

                                        {/*Cuando seleccionar sea true esto va a ocultarse*/}
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


                                {/*  Opciones cuando SÍ está en modo selección */}
                                {seleccionar && (
                                    <>
                                        {isOnline && (
                                            <div className="w-full p-1 border-b border-gray-400
                                        text-black dark:text-white 
                                        bg-white dark:bg-gray-800 cursor-pointer"
                                                onClick={handleSeleccionarTodo}>
                                                <OpcionesCabecera
                                                    className="justify-start"
                                                    iconoOpcion={<HiSelector className="text-2xl md:text-3xl" />}
                                                    nombreOpcion={seleccionarTodo ? "Anular selección" : "Seleccionar todo"}
                                                />
                                            </div>
                                        )}

                                        <div className="w-full p-1 border-b border-gray-400
                                            text-black dark:text-white 
                                            bg-white dark:bg-gray-800 cursor-pointer"
                                            onClick={handleMoverSeleccionadasPapelera}>
                                            <OpcionesCabecera
                                                className="justify-start"
                                                iconoOpcion={<HiOutlineTrash className="text-2xl md:text-3xl" />}
                                                nombreOpcion={`Mover a papelera (${anotacionesSeleccionadas.length})`}
                                            />
                                        </div>

                                        <div className="w-full p-1 border-b border-gray-400
                                            text-red-700 dark:text-red-500 
                                            bg-white dark:bg-gray-800 cursor-pointer"
                                            onClick={handleEliminarSeleccionadasDefinitivo}>
                                            <OpcionesCabecera
                                                className="justify-start"
                                                iconoOpcion={<MdDeleteForever className="text-2xl md:text-3xl" />}
                                                nombreOpcion={`Eliminar definitivamente (${anotacionesSeleccionadas.length})`}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {verModo && <VerModo />}
                        {verOrden && <VerOrden />}

                    </motion.div>

                </motion.div>

            )}

            {verOpcCabPagVisPrev && (
                <>
                    <motion.div
                        className="fixed inset-0 z-20 bg-black/70"
                        onClick={handleVerOpcCabPagVisPrev}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}>

                        <motion.div
                            onClick={(e) => e.stopPropagation()}
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

                    </motion.div>

                </>
            )}
        </>
    );
}
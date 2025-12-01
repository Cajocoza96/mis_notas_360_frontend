import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { HiOutlineBookOpen } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import { BiWifiOff } from "react-icons/bi";
import useConexionInternet from "../../hooks/useConexionInternet";
import { useLocation, useNavigate } from "react-router-dom";

import BotonAccion from "../botones/BotonAccion";

export default function CargandoNoHayNada({
    pantallaCompletaCarga,
    iconoDeCarga,
    CargandoAnotaciones,
    sinEstadoFavoritoNada,
    noHayEliminadas,
    iconoSinConexion
}) {
    const verSoloFavoritos = useSelector((state) => state.preferencia.verSoloFavoritos);
    const verAnotacEstado = useSelector((state) => state.preferencia.verAnotacEstado);

    const [cargando, setCargando] = useState(false);

    // Hook de conexión a internet
    const { isOnline, justReconnected, timeOffline } = useConexionInternet();

    const location = useLocation();

    const navigate = useNavigate();

    const handleNavegarInicio = () => navigate("/");

    const MiBoton = motion.create(BotonAccion);

    const esPaginaEstado = location.pathname.includes('/estados');

    const esPaginaPanelPrincipal = location.pathname.includes('/panel-principal');

    return (
        <>
            {pantallaCompletaCarga && isOnline && (
                <div className="fixed inset-0 z-90 bg-black/50
                                flex items-center justify-center">
                    <FaSpinner className="animate-spin text-2xl md:text-3xl text-white" />
                </div>
            )}

            {iconoDeCarga && isOnline && (
                <FaSpinner className="animate-spin text-2xl md:text-3xl text-black dark:text-white" />
            )}

            {iconoSinConexion && (
                <BiWifiOff className="text-2xl md:text-3xl text-black dark:text-white" />
            )}

            {CargandoAnotaciones && isOnline && (
                <div className="col-span-full text-center p-4 select-none
                                flex flex-col items-center justify-center gap-3">
                    <FaSpinner className="animate-spin text-2xl md:text-3xl text-black dark:text-white" />
                </div>
            )}

            {/* Mensaje de conexión a internet */}
            {!isOnline && !iconoSinConexion && !esPaginaEstado && (
                <div className="col-span-full text-center p-4 select-none
                                text-black dark:text-white
                                flex flex-col items-center justify-center gap-3">
                    <p className="text-base md:text-xl font-semibold">
                        Sin conexión a internet
                    </p>

                    <BiWifiOff className="text-6xl md:text-7xl" />

                    <p className="text-base md:text-xl">
                        Al volver la conexión, los datos se actualizarán automáticamente.
                    </p>

                    {!esPaginaPanelPrincipal && (
                        <MiBoton
                            className="bg-violet-800 text-white
                                        hover:bg-violet-800 active:bg-violet-800
                                        rounded-full"
                            accion="Volver a inicio"
                            onClick={handleNavegarInicio}
                            whileHover={{
                                scale: 1.15,
                                boxShadow: "0px 4px 20px rgba(147, 51, 234, 0.4)"
                            }}
                            whileTap={{
                                scale: 0.96,
                                boxShadow: "0px 2px 8px rgba(147, 51, 234, 0.3"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                        />
                    )}

                </div>
            )}

            {/* Contenido normal cuando hay conexión y no está reconectando */}
            {sinEstadoFavoritoNada && !cargando && isOnline && !justReconnected && (
                <div className="col-span-full text-center p-4 select-none
                                flex flex-col items-center justify-center gap-3">
                    <p className="text-base md:text-xl text-black dark:text-white">
                        {verAnotacEstado === 'ver_no_asignado' && verSoloFavoritos
                            ? 'No tienes anotaciones favoritas sin asignar'
                            : verAnotacEstado === 'ver_no_asignado' ? 'No tienes anotaciones sin asignar'
                                : verAnotacEstado === 'ver_pendiente' && verSoloFavoritos
                                    ? 'No tienes anotaciones favoritas pendientes'
                                    : verAnotacEstado === 'ver_pendiente' ? 'No tienes anotaciones pendientes'
                                        : verAnotacEstado === 'ver_finalizado' && verSoloFavoritos
                                            ? 'No tienes anotaciones favoritas finalizadas'
                                            : verAnotacEstado === 'ver_finalizado' ? 'No tienes anotaciones finalizadas'
                                                : verSoloFavoritos ? 'No tienes anotaciones favoritas.'
                                                    : 'No tienes anotaciones. ¡Crea tu primera nota!'}
                    </p>

                    <div>
                        <HiOutlineBookOpen className="text-6xl md:text-7xl text-black dark:text-white" />
                    </div>
                </div>
            )}

            {noHayEliminadas && !cargando && isOnline && !justReconnected && (
                <div className="col-span-full text-center p-4 select-none
                                flex flex-col items-center justify-center gap-3">
                    <p className="text-base md:text-xl text-black dark:text-white">
                        No tienes anotaciones eliminadas.
                    </p>

                    <div>
                        <HiOutlineBookOpen className="text-6xl md:text-7xl text-black dark:text-white" />
                    </div>
                </div>
            )}
        </>
    );
}
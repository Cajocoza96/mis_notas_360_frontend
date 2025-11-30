import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { HiOutlineBookOpen } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import { BiWifiOff } from "react-icons/bi";
import useConexionInternet from "../../hooks/useConexionInternet";
import { useLocation } from "react-router-dom";

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

    const esPaginaEstado = location.pathname.includes('/estados');
    const esPaginaAgregar = location.pathname.includes('/agregar-nota');
    const esPaginaEditar = location.pathname.includes('/editar/nota/');

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

            {iconoSinConexion && !isOnline && (
                <BiWifiOff className="text-2xl md:text-3xl text-black dark:text-white" />
            )}

            {CargandoAnotaciones && isOnline && (
                <div className="col-span-full text-center p-4 select-none
                                flex flex-col items-center justify-center gap-3">
                    <FaSpinner className="animate-spin text-2xl md:text-3xl text-black dark:text-white" />
                </div>
            )}

            {/* Mensaje de conexión a internet */}
            {!isOnline && !iconoSinConexion && !esPaginaEstado && !esPaginaAgregar && !esPaginaEditar &&(
                <div className="col-span-full text-center p-4 select-none
                                text-black dark:text-white
                                flex flex-col items-center justify-center gap-3">
                    <p className="text-base md:text-xl font-semibold">
                        Sin conexión a internet
                    </p>

                    <BiWifiOff className="text-6xl md:text-7xl" />
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